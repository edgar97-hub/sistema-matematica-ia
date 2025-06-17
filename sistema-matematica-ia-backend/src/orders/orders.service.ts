import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike, FindOneOptions } from 'typeorm';
import { OrderEntity } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UsersService } from '../users/users/users.service';
import { FileStorageService } from '../file-storage/file-storage/file-storage.service';
import { OrderPipelineStatus } from './enums/order-pipeline-status.enum';
import { CreditService } from '../credit-system/services/credit.service';
import { Express } from 'express';
import { MathpixService } from '../math-processing/mathpix/mathpix.service';
import { FilterOrderDto } from './dto/filter-order.dto';
import { SortOrderDto } from './dto/sort-order.dto';
import { SystemConfigurationService } from '../system-configuration/services/system-configuration.service';
import { OpenaiService } from '../math-processing/openai/openai.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly usersService: UsersService,
    private readonly fileStorageService: FileStorageService,
    private readonly creditService: CreditService,
    private readonly mathpixService: MathpixService,
    private readonly openaiService: OpenaiService,
    private readonly systemConfigurationService: SystemConfigurationService,
  ) {}

  async createOrder(
    userId: string,
    createOrderDto: CreateOrderDto,
    imageFile: any,
  ): Promise<OrderEntity> {
    try {
      // Deduct credits
      await this.creditService.useCredits(
        parseInt(userId),
        1,
        'ORDER_CREATION',
      );

      // Upload file to S3
      const { url: originalImageUrl } =
        await this.fileStorageService.uploadFile(imageFile, 'orders/images');

      // Extract text from image using Mathpix
      let mathpixExtraction: any;
      try {
        mathpixExtraction =
          await this.mathpixService.extractTextFromImageUrl(originalImageUrl);
      } catch (e) {
        console.error('Mathpix extraction failed:', e);
        mathpixExtraction = { error: e.message };
      }

      // Create order entity
      const order = this.orderRepository.create({
        userId: userId,
        countrySelected: createOrderDto.countrySelected,
        educationalStageSelected: createOrderDto.educationalStageSelected,
        subdivisionGradeSelected: createOrderDto.subdivisionGradeSelected,
        topic: createOrderDto.topic,
        originalImageUrl: originalImageUrl,
        mathpixExtraction: mathpixExtraction,
        status: OrderPipelineStatus.PENDING,
      });

      const savedOrder = await this.orderRepository.save(order);

      console.log(
        'TODO: Disparar pipeline de procesamiento para la orden ID:',
        savedOrder.id,
      );

      // Process OCR asynchronously
      this.processOcr(
        savedOrder.id,
        savedOrder.originalImageUrl,
        createOrderDto.countrySelected,
        createOrderDto.educationalStageSelected,
        createOrderDto.subdivisionGradeSelected,
      );

      return savedOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new BadRequestException('Failed to create order');
    }
  }

  async findUserOrders(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: OrderEntity[]; total: number }> {
    const [data, total] = await this.orderRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total };
  }

  async findOrderByIdForUser(
    orderId: string,
    userId: string,
  ): Promise<OrderEntity | null> {
    const order = await this.orderRepository.findOne({
      where: { id: parseInt(orderId), userId },
    });

    return order;
  }

  async updateOcrResult(
    orderId: number,
    extractionData: any,
    status: OrderPipelineStatus,
    error?: string | null,
  ): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    if (!order) {
      console.error(`Order with ID "${orderId}" not found`);
      return;
    }

    order.mathpixExtraction = extractionData;
    order.status = status;
    // order.errorMessage = error || null;

    await this.orderRepository.save(order);
  }

  private async processOcr(
    orderId: number,
    imageUrl: string,
    country?: string,
    stage?: string,
    subdivision?: string,
  ): Promise<void> {
    try {
      const mathpixExtraction =
        await this.mathpixService.extractTextFromImageUrl(imageUrl);

      if (!mathpixExtraction) {
        console.error(
          `Mathpix failed for order ${orderId}:`,
          'mathpixExtraction.error',
        );
        await this.updateOcrResult(
          orderId,
          null,
          OrderPipelineStatus.OCR_FAILED,
          'mathpixExtraction.error',
        );
      } else {
        try {
          const systemConfiguration =
            await this.systemConfigurationService.getConfiguration();
          const promptBase = systemConfiguration.openAiPromptBase;

          // mathpixExtraction.text
          const openAiSolution =
            await this.openaiService.generateStepByStepSolution(
              'mathpixExtraction.text',
              promptBase,
              country,
              stage,
              subdivision,
            );

          await this.updateOrderDetails(orderId, {
            openAiSolution: openAiSolution,
            status: OrderPipelineStatus.AI_SOLUTION_PENDING,
          });
        } catch (openaiError) {
          console.error(`OpenAI failed for order ${orderId}:`, openaiError);
          await this.updateOrderDetails(orderId, {
            status: OrderPipelineStatus.AI_SOLUTION_FAILED,
            errorMessage: openaiError.message,
          });
        }
      }
    } catch (error) {
      console.error(`Error processing OCR for order ${orderId}:`, error);
      await this.updateOcrResult(
        orderId,
        null,
        OrderPipelineStatus.OCR_FAILED,
        error.message,
      );
    }
  }

  async findAllOrders(
    page: number = 1,
    limit: number = 10,
    filters?: FilterOrderDto,
    sort?: SortOrderDto,
  ): Promise<{ data: OrderEntity[]; total: number }> {
    const where: FindOptionsWhere<OrderEntity> = {};

    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.userId) {
      where.userId = filters.userId;
    }
    if (filters?.startDate) {
      // where.createdAt = ILike(`%${filters.startDate }%`) ; // Adjust as needed for date range
    }
    if (filters?.endDate) {
      // where.createdAt = ILike(`%${filters.endDate}%`); // Adjust as needed for date range
    }

    const order: { [key: string]: 'ASC' | 'DESC' } = {};
    if (sort?.field && sort?.direction) {
      order[sort.field] = sort.direction;
    } else {
      order.createdAt = 'DESC';
    }

    const [data, total] = await this.orderRepository.findAndCount({
      where,
      order,
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total };
  }

  async findOrderByIdForAdmin(orderId: string): Promise<OrderEntity | null> {
    const order = await this.orderRepository.findOne({
      where: { id: parseInt(orderId) },
    });

    return order;
  }

  async updateOrderStatusByAdmin(
    orderId: string,
    newStatus: OrderPipelineStatus,
    adminNotes?: string,
  ): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({
      where: { id: parseInt(orderId) },
    });
    if (!order) {
      throw new NotFoundException(`Order with ID "${orderId}" not found`);
    }

    order.status = newStatus;
    // TODO: Implement adminNotes logging or storage if needed
    await this.orderRepository.save(order);

    return order;
  }

  async updateOrderDetails(
    orderId: number,
    updates: Partial<OrderEntity>,
  ): Promise<void> {
    try {
      await this.orderRepository.update(orderId, updates);
    } catch (error) {
      console.error(`Error updating order ${orderId}:`, error);
      throw new BadRequestException(`Failed to update order ${orderId}`);
    }
  }
}
