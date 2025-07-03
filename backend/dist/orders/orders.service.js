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
const system_configuration_service_1 = require("../system-configuration/services/system-configuration.service");
const openai_service_1 = require("../math-processing/openai/openai.service");
const user_entity_1 = require("../users/entities/user.entity");
const credit_transaction_entity_1 = require("../credit-system/entities/credit-transaction.entity");
const simpletex_service_1 = require("../math-processing/services/simpletex.service");
const path_1 = require("path");
const manim_service_1 = require("../math-processing/manim/manim.service");
let OrdersService = class OrdersService {
    orderRepository;
    usersService;
    fileStorageService;
    manimService;
    simpleTexService;
    openaiService;
    systemConfigurationService;
    entityManager;
    constructor(orderRepository, usersService, fileStorageService, manimService, simpleTexService, openaiService, systemConfigurationService, entityManager) {
        this.orderRepository = orderRepository;
        this.usersService = usersService;
        this.fileStorageService = fileStorageService;
        this.manimService = manimService;
        this.simpleTexService = simpleTexService;
        this.openaiService = openaiService;
        this.systemConfigurationService = systemConfigurationService;
        this.entityManager = entityManager;
    }
    async createOrder(userId, createOrderDto, imageFile) {
        let savedOrder = undefined;
        try {
            const uploadResult = await this.fileStorageService.uploadFile(imageFile, `orders/images/${userId}`);
            if (!uploadResult || !uploadResult.url) {
                console.error(`Fallo al subir la imagen para el usuario ${userId}`, '', 'OrdersService_CreateOrder');
                throw new common_1.InternalServerErrorException('Fallo al procesar la imagen del problema.');
            }
            console.log(`Imagen subida a: ${uploadResult.url} para usuario ${userId}`, 'OrdersService_CreateOrder');
            const newOrderData = {
                ...createOrderDto,
                userId,
                originalImageUrl: uploadResult.url,
                status: order_pipeline_status_enum_1.OrderPipelineStatus.OCR_PENDING,
                creditsConsumed: 1,
            };
            savedOrder = await this.entityManager
                .getRepository(order_entity_1.OrderEntity)
                .save(this.entityManager.getRepository(order_entity_1.OrderEntity).create(newOrderData));
            console.log(`Orden ${savedOrder.id}  creada, estado: ${savedOrder.status}`, 'OrdersService_CreateOrder');
            this.processOrderPipeline(savedOrder.id).catch((pipelineError) => {
                console.error(`Error en el pipeline asíncrono para la orden ${savedOrder?.id}: ${pipelineError.message}`, pipelineError.stack, 'OrdersService_CreateOrder_PipelineCatch');
            });
            return savedOrder;
        }
        catch (error) {
            console.error(`Error en createOrder para usuario ${userId}: ${error.message}`, error.stack, 'OrdersService_CreateOrder');
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException ||
                error instanceof common_1.InternalServerErrorException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Ocurrió un error al crear la orden.');
        }
    }
    async processOrderPipeline(orderId) {
        console.log(`Pipeline: Iniciando para orden ${orderId}`, 'OrdersService_Pipeline');
        let order = null;
        try {
            order = await this.entityManager.findOne(order_entity_1.OrderEntity, {
                where: { id: orderId },
            });
            if (!order) {
                console.error(`Pipeline: Orden ${orderId} no encontrada para procesar.`, '', 'OrdersService_Pipeline');
                return;
            }
            console.log('--- 1. OCR con Mathpix ---');
            console.log(`Pipeline: Iniciando OCR para orden ${order.id} (Estado actual: ${order.status})`, 'OrdersService_Pipeline');
            if (order.status !== order_pipeline_status_enum_1.OrderPipelineStatus.OCR_PENDING &&
                order.status !== order_pipeline_status_enum_1.OrderPipelineStatus.PENDING) {
                console.warn(`Pipeline: Orden ${order.id} no está en estado OCR_PENDING o PENDING. Estado actual: ${order.status}. Omitiendo OCR.`, '', 'OrdersService_Pipeline');
            }
            else {
                await this.entityManager.update(order_entity_1.OrderEntity, order.id, {
                    status: order_pipeline_status_enum_1.OrderPipelineStatus.PROCESSING_OCR,
                });
                order.status = order_pipeline_status_enum_1.OrderPipelineStatus.PROCESSING_OCR;
                console.log(`Pipeline: Orden ${order.id} actualizada a PROCESSING_OCR`, 'OrdersService_Pipeline');
                let imageBuffer;
                try {
                    imageBuffer = await this.fileStorageService.readFileToBuffer(order.originalImageUrl);
                }
                catch (readError) {
                    console.error(`Pipeline: No se pudo leer el archivo de imagen local ${order.originalImageUrl} para orden ${order.id}`, readError.stack, 'OrdersService_Pipeline');
                    await this.entityManager.update(order_entity_1.OrderEntity, order.id, {
                        status: order_pipeline_status_enum_1.OrderPipelineStatus.OCR_FAILED,
                        errorMessage: 'Error interno al acceder a la imagen para OCR: ' +
                            readError.message,
                    });
                    return;
                }
                const originalFilename = (0, path_1.parse)(order.originalImageUrl).base;
                const simpleTexResponse = await this.simpleTexService.extractMathFromImageBuffer(imageBuffer, originalFilename);
                const extractedMathText = simpleTexResponse.res?.latex;
                console.log('extractedMathText', extractedMathText);
                if (!simpleTexResponse.status ||
                    !extractedMathText ||
                    extractedMathText.trim() === '' ||
                    extractedMathText === '[EMPTY]' ||
                    extractedMathText === '[DOCIMG]') {
                    await this.entityManager.update(order_entity_1.OrderEntity, order.id, {
                        status: order_pipeline_status_enum_1.OrderPipelineStatus.OCR_FAILED,
                        errorMessage: simpleTexResponse.status +
                            ' SimpleTex OCR no devolvió texto extraído.',
                        mathpixExtraction: JSON.stringify(simpleTexResponse),
                    });
                    return;
                }
                console.log('OCR Exitoso, actualizamos la orden con el texto y el estado para deducir crédito');
                await this.entityManager.update(order_entity_1.OrderEntity, order.id, {
                    mathpixExtraction: extractedMathText,
                    status: order_pipeline_status_enum_1.OrderPipelineStatus.OCR_SUCCESSFUL_CREDIT_PENDING,
                });
                order.mathpixExtraction = extractedMathText;
                order.status = order_pipeline_status_enum_1.OrderPipelineStatus.OCR_SUCCESSFUL_CREDIT_PENDING;
                console.log(`Pipeline: OCR completado para orden ${order.id}. Estado: ${order.status}`, 'OrdersService_Pipeline');
            }
            console.log('--- 2. Deducir Créditos (TRANSACCIONAL) ---');
            if (order.status === order_pipeline_status_enum_1.OrderPipelineStatus.OCR_SUCCESSFUL_CREDIT_PENDING) {
                console.log(`Pipeline: Intentando deducir créditos para orden ${order.id}`, 'OrdersService_Pipeline');
                try {
                    await this.entityManager.transaction(async (tem) => {
                        const orderInTransaction = await tem.findOneOrFail(order_entity_1.OrderEntity, {
                            where: { id: order.id },
                        });
                        const userInTransaction = await tem.findOneOrFail(user_entity_1.UserEntity, {
                            where: { id: orderInTransaction.userId },
                        });
                        const creditsToConsume = orderInTransaction.creditsConsumed || 1;
                        if (userInTransaction.creditBalance < creditsToConsume) {
                            throw new common_1.BadRequestException('Créditos insuficientes al momento de la deducción.');
                        }
                        const balanceBefore = userInTransaction.creditBalance;
                        userInTransaction.creditBalance -= creditsToConsume;
                        const balanceAfter = userInTransaction.creditBalance;
                        await tem.save(user_entity_1.UserEntity, userInTransaction);
                        await this.usersService.internalRecordTransaction({
                            targetUserId: userInTransaction.id,
                            action: credit_transaction_entity_1.CreditTransactionAction.USAGE_RESOLUTION,
                            amount: -Math.abs(creditsToConsume),
                            balanceBefore,
                            balanceAfter,
                            reason: `Resolución Orden ${orderInTransaction.id}`,
                        }, tem);
                        orderInTransaction.status = order_pipeline_status_enum_1.OrderPipelineStatus.AI_SOLUTION_PENDING;
                        await tem.save(order_entity_1.OrderEntity, orderInTransaction);
                        order = orderInTransaction;
                        console.log(`Pipeline: Créditos deducidos y orden ${order.id} actualizada a AI_SOLUTION_PENDING`, 'OrdersService_Pipeline');
                    });
                }
                catch (deductionError) {
                    console.error(`Pipeline: Fallo al deducir créditos para orden ${order.id}: ${deductionError.message}`, deductionError.stack, 'OrdersService_Pipeline');
                    await this.entityManager.update(order_entity_1.OrderEntity, order.id, {
                        status: order_pipeline_status_enum_1.OrderPipelineStatus.CREDIT_DEDUCTION_FAILED,
                        errorMessage: deductionError.message || 'Fallo al deducir créditos.',
                    });
                    return;
                }
            }
            console.log('--- 3. Generación de Solución con OpenAI ---');
            if (order.status === order_pipeline_status_enum_1.OrderPipelineStatus.AI_SOLUTION_PENDING) {
                console.log(`Pipeline: Iniciando generación de solución IA para ${order.id}`, 'OrdersService_Pipeline');
                const config = await this.systemConfigurationService.getConfiguration();
                const solutionJson = await this.openaiService.generateStepByStepSolution(order.mathpixExtraction, config.openAiPromptBase, order.countrySelected, order.educationalStageSelected, order.subdivisionGradeSelected);
                await this.entityManager.update(order_entity_1.OrderEntity, order.id, {
                    openAiSolution: solutionJson,
                    status: order_pipeline_status_enum_1.OrderPipelineStatus.GENERATING_VIDEO_PENDING,
                });
                order.openAiSolution = solutionJson;
                order.status = order_pipeline_status_enum_1.OrderPipelineStatus.GENERATING_VIDEO_PENDING;
                console.log(`Pipeline: Solución IA generada para ${order.id}`);
            }
            if (order.status === order_pipeline_status_enum_1.OrderPipelineStatus.GENERATING_VIDEO_PENDING) {
                console.log(`Solicitando video final al microservicio Manim para orden ${order.id}`, 'OrdersService_Pipeline');
                const solution = order.openAiSolution;
                if (!solution || !solution.steps || solution.steps.length === 0) {
                    throw new Error('La solución de IA no es válida para generar el video.');
                }
                const manimResult = await this.manimService.renderFullVoiceoverVideo({
                    orderId: order.id.toString(),
                    solutionJson: solution,
                });
                console.log('manimResult', manimResult);
                if (manimResult.error || !manimResult.localPath) {
                    throw new Error(`Fallo en el microservicio Manim: ${manimResult.error}`);
                }
                const finalVideoPath = manimResult.localPath;
                console.log(`Video final completo recibido en: ${finalVideoPath}`, 'OrdersService_Pipeline');
                const finalVideoPublicUrl = `/final_videos/${(0, path_1.basename)(finalVideoPath)}`;
                await this.entityManager.update(order_entity_1.OrderEntity, order.id, {
                    finalVideoUrl: finalVideoPublicUrl,
                    status: order_pipeline_status_enum_1.OrderPipelineStatus.COMPLETED,
                    completedAt: new Date(),
                });
                console.log(`¡COMPLETADO! Video final para orden ${order.id} en ${finalVideoPublicUrl}`, 'OrdersService_Pipeline');
            }
        }
        catch (pipelineError) {
            console.error(`Pipeline: Error procesando orden ${orderId}: ${pipelineError.message}`, pipelineError.stack, 'OrdersService_Pipeline');
            let finalErrorStatus = order_pipeline_status_enum_1.OrderPipelineStatus.FAILED_GENERAL;
            if (order && order.id) {
                const currentOrderInDb = await this.entityManager.findOne(order_entity_1.OrderEntity, {
                    where: { id: order.id },
                });
                if (currentOrderInDb &&
                    !currentOrderInDb.status.endsWith('FAILED') &&
                    currentOrderInDb.status !== order_pipeline_status_enum_1.OrderPipelineStatus.COMPLETED) {
                    if (pipelineError.message?.includes('OpenAI TTS'))
                        finalErrorStatus = order_pipeline_status_enum_1.OrderPipelineStatus.AUDIO_FAILED;
                    await this.entityManager.update(order_entity_1.OrderEntity, order.id, {
                        status: finalErrorStatus,
                        errorMessage: `Error en pipeline (estado anterior: ${order.status}): ${pipelineError.message}`,
                    });
                }
            }
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
    async findUserOrdersPaginated(userId, paginationDto) {
        const { page = 1, limit = 10 } = paginationDto;
        const skip = (page - 1) * limit;
        const [orders, total] = await this.orderRepository.findAndCount({
            where: { userId: userId },
            order: { createdAt: 'DESC' },
            take: limit,
            skip: skip,
            select: [
                'id',
                'topic',
                'educationalStageSelected',
                'subdivisionGradeSelected',
                'status',
                'finalVideoUrl',
                'createdAt',
            ],
        });
        const data = orders.map((order) => ({
            id: order.id,
            topic: order.topic,
            educationalStageSelected: order.educationalStageSelected,
            subdivisionGradeSelected: order.subdivisionGradeSelected,
            status: order.status,
            finalVideoUrl: order.finalVideoUrl,
            createdAt: order.createdAt.toISOString(),
        }));
        const lastPage = Math.ceil(total / limit);
        return {
            data,
            meta: {
                total,
                page,
                lastPage,
            },
        };
    }
    async getFinalVideoPath(userId, orderId) {
        const order = await this.orderRepository.findOne({
            where: { id: orderId },
            select: ['id', 'userId', 'finalVideoUrl'],
        });
        if (!order) {
            throw new common_1.NotFoundException('La orden no existe.');
        }
        if (order.userId !== userId) {
            throw new common_1.ForbiddenException('No tienes permiso para acceder a este recurso.');
        }
        if (!order.finalVideoUrl) {
            throw new common_1.NotFoundException('El video para esta orden aún no está disponible o ha fallado.');
        }
        const filePath = (0, path_1.join)(process.cwd(), 'uploads', order.finalVideoUrl);
        return filePath;
    }
    async findOrderByIdForUser(orderId, userId) {
        const order = await this.orderRepository.findOne({
            where: { id: parseInt(orderId), userId },
        });
        if (!order) {
            throw new common_1.NotFoundException('Orden no encontrada.');
        }
        return order;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.OrderEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        file_storage_service_1.FileStorageService,
        manim_service_1.ManimService,
        simpletex_service_1.SimpleTexService,
        openai_service_1.OpenaiService,
        system_configuration_service_1.SystemConfigurationService,
        typeorm_2.EntityManager])
], OrdersService);
//# sourceMappingURL=orders.service.js.map