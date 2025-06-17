import { UsersService } from '../users/users/users.service';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { FilterOrderDto } from './dto/filter-order.dto';
import { SortOrderDto } from './dto/sort-order.dto';
import { UpdateOrderStatusAdminDto } from './dto/update-order-status-admin.dto';
export declare const imageFileFilterHelper: (req: any, file: any, callback: any) => any;
export declare class OrdersController {
    private readonly ordersService;
    private readonly usersService;
    constructor(ordersService: OrdersService, usersService: UsersService);
    create(user: any, createOrderDto: CreateOrderDto, imageFile: any): Promise<import("./entities/order.entity").OrderEntity>;
    findAll(user: any, page: string, limit: string): Promise<{
        data: import("./entities/order.entity").OrderEntity[];
        total: number;
    }>;
    findOne(id: string, user: any): Promise<import("./entities/order.entity").OrderEntity>;
    findAllOrders(page: number, limit: number, filters: FilterOrderDto, sort: SortOrderDto): Promise<{
        data: import("./entities/order.entity").OrderEntity[];
        total: number;
    }>;
    findOrderByIdForAdmin(id: number): Promise<import("./entities/order.entity").OrderEntity>;
    updateOrderStatusByAdmin(id: number, updateOrderStatusAdminDto: UpdateOrderStatusAdminDto): Promise<import("./entities/order.entity").OrderEntity>;
}
