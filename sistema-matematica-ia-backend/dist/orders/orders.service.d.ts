import { Repository } from 'typeorm';
import { OrderEntity } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UsersService } from '../users/users/users.service';
import { FileStorageService } from '../file-storage/file-storage/file-storage.service';
import { OrderPipelineStatus } from './enums/order-pipeline-status.enum';
import { CreditService } from '../credit-system/services/credit.service';
import { MathpixService } from '../math-processing/mathpix/mathpix.service';
import { FilterOrderDto } from './dto/filter-order.dto';
import { SortOrderDto } from './dto/sort-order.dto';
import { SystemConfigurationService } from '../system-configuration/services/system-configuration.service';
import { OpenaiService } from '../math-processing/openai/openai.service';
export declare class OrdersService {
    private readonly orderRepository;
    private readonly usersService;
    private readonly fileStorageService;
    private readonly creditService;
    private readonly mathpixService;
    private readonly openaiService;
    private readonly systemConfigurationService;
    constructor(orderRepository: Repository<OrderEntity>, usersService: UsersService, fileStorageService: FileStorageService, creditService: CreditService, mathpixService: MathpixService, openaiService: OpenaiService, systemConfigurationService: SystemConfigurationService);
    createOrder(userId: string, createOrderDto: CreateOrderDto, imageFile: any): Promise<OrderEntity>;
    findUserOrders(userId: string, page?: number, limit?: number): Promise<{
        data: OrderEntity[];
        total: number;
    }>;
    findOrderByIdForUser(orderId: string, userId: string): Promise<OrderEntity | null>;
    updateOcrResult(orderId: number, extractionData: any, status: OrderPipelineStatus, error?: string | null): Promise<void>;
    private processOcr;
    findAllOrders(page?: number, limit?: number, filters?: FilterOrderDto, sort?: SortOrderDto): Promise<{
        data: OrderEntity[];
        total: number;
    }>;
    findOrderByIdForAdmin(orderId: string): Promise<OrderEntity | null>;
    updateOrderStatusByAdmin(orderId: string, newStatus: OrderPipelineStatus, adminNotes?: string): Promise<OrderEntity>;
    updateOrderDetails(orderId: number, updates: Partial<OrderEntity>): Promise<void>;
}
