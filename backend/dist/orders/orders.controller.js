"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = exports.imageFileFilterHelper = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const admin_guard_1 = require("../auth/guards/admin.guard");
const users_service_1 = require("../users/users/users.service");
const orders_service_1 = require("./orders.service");
const create_order_dto_1 = require("./dto/create-order.dto");
const platform_express_1 = require("@nestjs/platform-express");
const user_decorator_1 = require("../users/decorators/user.decorator");
const filter_order_dto_1 = require("./dto/filter-order.dto");
const sort_order_dto_1 = require("./dto/sort-order.dto");
const update_order_status_admin_dto_1 = require("./dto/update-order-status-admin.dto");
const pagination_dto_1 = require("./dto/pagination.dto");
const imageFileFilterHelper = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new common_1.BadRequestException('Only image files are allowed!'), false);
    }
    callback(null, true);
};
exports.imageFileFilterHelper = imageFileFilterHelper;
let OrdersController = class OrdersController {
    ordersService;
    usersService;
    constructor(ordersService, usersService) {
        this.ordersService = ordersService;
        this.usersService = usersService;
    }
    async create(user, createOrderDto, imageFile) {
        try {
            return await this.ordersService.createOrder(user.id.toString(), createOrderDto, imageFile);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async findAllOrders(page, limit, filters, sort) {
        try {
            return await this.ordersService.findAllOrders(page, limit, filters, sort);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async findOrderByIdForAdmin(id) {
        try {
            const order = await this.ordersService.findOrderByIdForAdmin(id.toString());
            if (!order) {
                throw new common_1.NotFoundException(`Order with ID "${id}" not found`);
            }
            return order;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async updateOrderStatusByAdmin(id, updateOrderStatusAdminDto) {
        try {
            return await this.ordersService.updateOrderStatusByAdmin(id.toString(), updateOrderStatusAdminDto.status, updateOrderStatusAdminDto.adminNotes);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getMyOrders(user, paginationDto) {
        const userId = user.id;
        return this.ordersService.findUserOrdersPaginated(userId, paginationDto);
    }
    async downloadVideo(orderId, res, user) {
        const userId = user.id;
        const filePath = await this.ordersService.getFinalVideoPath(userId, orderId);
        res.download(filePath, `resolucion_orden_${orderId}.mp4`, (err) => {
            if (err) {
                res.status(404).send({ message: 'No se pudo encontrar el video.' });
            }
        });
    }
    async getOrderById(id, user) {
        const userId = user.id;
        return this.ordersService.findOrderByIdForUser(id, userId);
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('imageFile', {
        limits: { fileSize: 10 * 1024 * 1024 },
        fileFilter: exports.imageFileFilterHelper,
    })),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_order_dto_1.CreateOrderDto, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('admin/all'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Query)('page', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, filter_order_dto_1.FilterOrderDto,
        sort_order_dto_1.SortOrderDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findAllOrders", null);
__decorate([
    (0, common_1.Get)('admin/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findOrderByIdForAdmin", null);
__decorate([
    (0, common_1.Patch)('admin/:id/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_order_status_admin_dto_1.UpdateOrderStatusAdminDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "updateOrderStatusByAdmin", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('pwa/my-orders'),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getMyOrders", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('download/:orderId'),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "downloadVideo", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getOrderById", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)('orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [orders_service_1.OrdersService,
        users_service_1.UsersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map