import { Repository, EntityManager } from 'typeorm';
import { OrderEntity } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UsersService } from '../users/users/users.service';
import { FileStorageService } from '../file-storage/file-storage/file-storage.service';
import { OrderPipelineStatus } from './enums/order-pipeline-status.enum';
import { FilterOrderDto } from './dto/filter-order.dto';
import { SortOrderDto } from './dto/sort-order.dto';
import { SystemConfigurationService } from '../system-configuration/services/system-configuration.service';
import { OpenaiService } from '../math-processing/openai/openai.service';
import { SimpleTexService } from '../math-processing/services/simpletex.service';
import { ManimService } from 'src/math-processing/manim/manim.service';
import { PaginatedResponse, PaginationDto } from './dto/pagination.dto';
export declare class OrdersService {
    private readonly orderRepository;
    private readonly usersService;
    private readonly fileStorageService;
    private readonly manimService;
    private readonly simpleTexService;
    private readonly openaiService;
    private readonly systemConfigurationService;
    private readonly entityManager;
    constructor(orderRepository: Repository<OrderEntity>, usersService: UsersService, fileStorageService: FileStorageService, manimService: ManimService, simpleTexService: SimpleTexService, openaiService: OpenaiService, systemConfigurationService: SystemConfigurationService, entityManager: EntityManager);
    createOrder(userId: number, createOrderDto: CreateOrderDto, imageFile: Express.Multer.File): Promise<OrderEntity>;
    private processOrderPipeline;
    findAllOrders(page?: number, limit?: number, filters?: FilterOrderDto, sort?: SortOrderDto): Promise<{
        data: OrderEntity[];
        total: number;
    }>;
    findOrderByIdForAdmin(orderId: string): Promise<OrderEntity | null>;
    updateOrderStatusByAdmin(orderId: string, newStatus: OrderPipelineStatus, adminNotes?: string): Promise<OrderEntity>;
    findUserOrdersPaginated(userId: number, paginationDto: PaginationDto): Promise<PaginatedResponse<any>>;
    getFinalVideoPath(userId: number, orderId: number): Promise<string>;
    findOrderByIdForUser(orderId: string, userId: number): Promise<OrderEntity | null>;
}
