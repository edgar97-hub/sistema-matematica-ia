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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./entities/order.entity");
const users_service_1 = require("../users/users/users.service");
const file_storage_service_1 = require("../file-storage/file-storage/file-storage.service");
const order_pipeline_status_enum_1 = require("./enums/order-pipeline-status.enum");
const credit_service_1 = require("../credit-system/services/credit.service");
const mathpix_service_1 = require("../math-processing/mathpix/mathpix.service");
const system_configuration_service_1 = require("../system-configuration/services/system-configuration.service");
const openai_service_1 = require("../math-processing/openai/openai.service");
let OrdersService = class OrdersService {
    orderRepository;
    usersService;
    fileStorageService;
    creditService;
    mathpixService;
    openaiService;
    systemConfigurationService;
    constructor(orderRepository, usersService, fileStorageService, creditService, mathpixService, openaiService, systemConfigurationService) {
        this.orderRepository = orderRepository;
        this.usersService = usersService;
        this.fileStorageService = fileStorageService;
        this.creditService = creditService;
        this.mathpixService = mathpixService;
        this.openaiService = openaiService;
        this.systemConfigurationService = systemConfigurationService;
    }
    async createOrder(userId, createOrderDto, imageFile) {
        try {
            await this.creditService.useCredits(parseInt(userId), 1, 'ORDER_CREATION');
            const { url: originalImageUrl } = await this.fileStorageService.uploadFile(imageFile, 'orders/images');
            let mathpixExtraction;
            try {
                mathpixExtraction =
                    await this.mathpixService.extractTextFromImageUrl(originalImageUrl);
            }
            catch (e) {
                console.error('Mathpix extraction failed:', e);
                mathpixExtraction = { error: e.message };
            }
            const order = this.orderRepository.create({
                userId: userId,
                countrySelected: createOrderDto.countrySelected,
                educationalStageSelected: createOrderDto.educationalStageSelected,
                subdivisionGradeSelected: createOrderDto.subdivisionGradeSelected,
                topic: createOrderDto.topic,
                originalImageUrl: originalImageUrl,
                mathpixExtraction: mathpixExtraction,
                status: order_pipeline_status_enum_1.OrderPipelineStatus.PENDING,
            });
            const savedOrder = await this.orderRepository.save(order);
            console.log('TODO: Disparar pipeline de procesamiento para la orden ID:', savedOrder.id);
            this.processOcr(savedOrder.id, savedOrder.originalImageUrl, createOrderDto.countrySelected, createOrderDto.educationalStageSelected, createOrderDto.subdivisionGradeSelected);
            return savedOrder;
        }
        catch (error) {
            console.error('Error creating order:', error);
            throw new common_1.BadRequestException('Failed to create order');
        }
    }
    async findUserOrders(userId, page = 1, limit = 10) {
        const [data, total] = await this.orderRepository.findAndCount({
            where: { userId },
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, total };
    }
    async findOrderByIdForUser(orderId, userId) {
        const order = await this.orderRepository.findOne({
            where: { id: parseInt(orderId), userId },
        });
        return order;
    }
    async updateOcrResult(orderId, extractionData, status, error) {
        const order = await this.orderRepository.findOne({
            where: { id: orderId },
        });
        if (!order) {
            console.error(`Order with ID "${orderId}" not found`);
            return;
        }
        order.mathpixExtraction = extractionData;
        order.status = status;
        await this.orderRepository.save(order);
    }
    async processOcr(orderId, imageUrl, country, stage, subdivision) {
        try {
            const mathpixExtraction = await this.mathpixService.extractTextFromImageUrl(imageUrl);
            if (!mathpixExtraction) {
                console.error(`Mathpix failed for order ${orderId}:`, 'mathpixExtraction.error');
                await this.updateOcrResult(orderId, null, order_pipeline_status_enum_1.OrderPipelineStatus.OCR_FAILED, 'mathpixExtraction.error');
            }
            else {
                try {
                    const systemConfiguration = await this.systemConfigurationService.getConfiguration();
                    const promptBase = systemConfiguration.openAiPromptBase;
                    const openAiSolution = await this.openaiService.generateStepByStepSolution('mathpixExtraction.text', promptBase, country, stage, subdivision);
                    await this.updateOrderDetails(orderId, {
                        openAiSolution: openAiSolution,
                        status: order_pipeline_status_enum_1.OrderPipelineStatus.AI_SOLUTION_PENDING,
                    });
                }
                catch (openaiError) {
                    console.error(`OpenAI failed for order ${orderId}:`, openaiError);
                    await this.updateOrderDetails(orderId, {
                        status: order_pipeline_status_enum_1.OrderPipelineStatus.AI_SOLUTION_FAILED,
                        errorMessage: openaiError.message,
                    });
                }
            }
        }
        catch (error) {
            console.error(`Error processing OCR for order ${orderId}:`, error);
            await this.updateOcrResult(orderId, null, order_pipeline_status_enum_1.OrderPipelineStatus.OCR_FAILED, error.message);
        }
    }
    async findAllOrders(page = 1, limit = 10, filters, sort) {
        const where = {};
        if (filters?.status) {
            where.status = filters.status;
        }
        if (filters?.userId) {
            where.userId = filters.userId;
        }
        if (filters?.startDate) {
        }
        if (filters?.endDate) {
        }
        const order = {};
        if (sort?.field && sort?.direction) {
            order[sort.field] = sort.direction;
        }
        else {
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
    async findOrderByIdForAdmin(orderId) {
        const order = await this.orderRepository.findOne({
            where: { id: parseInt(orderId) },
        });
        return order;
    }
    async updateOrderStatusByAdmin(orderId, newStatus, adminNotes) {
        const order = await this.orderRepository.findOne({
            where: { id: parseInt(orderId) },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID "${orderId}" not found`);
        }
        order.status = newStatus;
        await this.orderRepository.save(order);
        return order;
    }
    async updateOrderDetails(orderId, updates) {
        try {
            await this.orderRepository.update(orderId, updates);
        }
        catch (error) {
            console.error(`Error updating order ${orderId}:`, error);
            throw new common_1.BadRequestException(`Failed to update order ${orderId}`);
        }
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.OrderEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        file_storage_service_1.FileStorageService,
        credit_service_1.CreditService,
        mathpix_service_1.MathpixService,
        openai_service_1.OpenaiService,
        system_configuration_service_1.SystemConfigurationService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map