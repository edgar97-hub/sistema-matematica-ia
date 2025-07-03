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
exports.CreditService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const credit_package_entity_1 = require("../entities/credit-package.entity");
const credit_transaction_entity_1 = require("../entities/credit-transaction.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const stripe_service_1 = require("./stripe.service");
const logger_service_1 = require("../../common/services/logger.service");
let CreditService = class CreditService {
    creditPackageRepository;
    creditTransactionRepository;
    userRepository;
    stripeService;
    logger;
    entityManager;
    constructor(creditPackageRepository, creditTransactionRepository, userRepository, stripeService, logger, entityManager) {
        this.creditPackageRepository = creditPackageRepository;
        this.creditTransactionRepository = creditTransactionRepository;
        this.userRepository = userRepository;
        this.stripeService = stripeService;
        this.logger = logger;
        this.entityManager = entityManager;
    }
    async getAllCreditTransactions(queryDto) {
        const { page = 1, limit = 10, startDate, endDate, action, targetUserId, } = queryDto;
        const skip = (page - 1) * limit;
        const where = {};
        if (targetUserId) {
            where.targetUserId = parseInt(targetUserId);
        }
        if (action) {
            where.action = action;
        }
        if (startDate && endDate) {
            where.createdAt = (0, typeorm_2.Between)(new Date(startDate), new Date(endDate + 'T23:59:59.999Z'));
        }
        else if (startDate) {
            where.createdAt = (0, typeorm_2.MoreThanOrEqual)(new Date(startDate));
        }
        else if (endDate) {
            where.createdAt = (0, typeorm_2.LessThanOrEqual)(new Date(endDate + 'T23:59:59.999Z'));
        }
        this.logger.log(`Querying credit transactions with where: ${JSON.stringify(where)}, skip: ${skip}, take: ${limit}`, 'CreditService');
        try {
            const [data, total] = await this.creditTransactionRepository.findAndCount({
                where,
                relations: ['targetUser', 'adminUser', 'creditPackage'],
                order: { createdAt: 'DESC' },
                skip: skip,
                take: limit,
            });
            const formattedData = data.map((tx) => ({
                ...tx,
                targetUser: tx.targetUser
                    ? {
                        id: tx.targetUser.id,
                        name: tx.targetUser.name,
                        email: tx.targetUser.email,
                    }
                    : undefined,
                adminUser: tx.adminUser
                    ? { id: tx.adminUser.id, name: tx.adminUser.name }
                    : undefined,
                creditPackage: tx.creditPackage
                    ? { id: tx.creditPackage.id, name: tx.creditPackage.name }
                    : undefined,
            }));
            return {
                data: formattedData,
                total,
                page: Number(page),
                limit: Number(limit),
            };
        }
        catch (error) {
            this.logger.error(`Error fetching all credit transactions: ${error.message}`, error.stack, 'CreditService');
            throw error;
        }
    }
    async recordTransaction(data) {
        return this.entityManager.transaction(async (transactionalEntityManager) => {
            const user = await transactionalEntityManager.findOne(user_entity_1.UserEntity, {
                where: { id: data.targetUserId },
            });
            if (!user) {
                throw new common_1.NotFoundException(`User with ID "${data.targetUserId}" not found`);
            }
            if (typeof data.amount !== 'number') {
                throw new common_1.BadRequestException('Transaction amount must be a number');
            }
            const transaction = transactionalEntityManager.create(credit_transaction_entity_1.CreditTransactionEntity, {
                ...data,
            });
            await transactionalEntityManager.save(transaction);
            return transaction;
        });
    }
    async handleSuccessfulCheckoutSession(session) {
        this.logger.log(`Handling successful checkout session: ${session.id}, Payment Status: ${session.payment_status}`, 'CreditService');
        if (session.payment_status !== 'paid') {
            this.logger.warn(`Checkout session ${session.id} not successfully paid. Status: ${session.payment_status}`, 'CreditService');
            return;
        }
        const gatewayTransactionId = session.id;
        const existingTransaction = await this.creditTransactionRepository.findOne({
            where: {
                gatewayTransactionId: gatewayTransactionId,
                action: credit_transaction_entity_1.CreditTransactionAction.PURCHASE_SUCCESS,
            },
        });
        if (existingTransaction) {
            this.logger.log(`Stripe event for session ${gatewayTransactionId} already processed. Skipping.`, 'CreditService');
            return;
        }
        const userIdString = session.metadata?.userId;
        const packageIdString = session.metadata?.packageId;
        const creditsFromString = session.metadata?.creditsAmount;
        if (!userIdString || !packageIdString || !creditsFromString) {
            this.logger.error(`Missing metadata (userId, packageId, or creditsAmount) in Stripe session: ${session.id}`, JSON.stringify(session.metadata), 'CreditService');
            throw new common_1.BadRequestException('Stripe session metadata incomplete.');
        }
        const userId = userIdString;
        const packageId = packageIdString;
        const creditsToAdd = parseInt(creditsFromString, 10);
        if (isNaN(creditsToAdd)) {
            this.logger.error(`Invalid creditsAmount in metadata: ${creditsFromString} for session ${session.id}`, '', 'CreditService');
            throw new common_1.BadRequestException('Invalid creditsAmount in Stripe session metadata.');
        }
        await this.entityManager.transaction(async (transactionalEntityManager) => {
            const userRepo = transactionalEntityManager.getRepository(user_entity_1.UserEntity);
            const packageRepo = transactionalEntityManager.getRepository(credit_package_entity_1.CreditPackageEntity);
            const transactionRepo = transactionalEntityManager.getRepository(credit_transaction_entity_1.CreditTransactionEntity);
            const user = await userRepo.findOne({ where: { id: parseInt(userId) } });
            if (!user) {
                throw new common_1.NotFoundException(`User with ID "${userId}" not found for credit purchase.`);
            }
            const creditPackage = await packageRepo.findOne({
                where: { id: parseInt(packageId) },
            });
            if (!creditPackage) {
                throw new common_1.NotFoundException(`Credit package with ID "${packageId}" not found.`);
            }
            if (creditPackage.creditAmount !== creditsToAdd) {
                this.logger.warn(`Credits mismatch for package ${packageId} in session ${session.id}. Expected ${creditPackage.creditAmount}, got ${creditsToAdd}. Using package's amount.`, 'CreditService');
            }
            const balanceBefore = user.creditBalance;
            user.creditBalance += creditPackage.creditAmount;
            const balanceAfter = user.creditBalance;
            await userRepo.save(user);
            const transactionData = {
                targetUserId: user.id,
                action: credit_transaction_entity_1.CreditTransactionAction.PURCHASE_SUCCESS,
                amount: creditPackage.creditAmount,
                balanceBefore,
                balanceAfter,
                paymentGateway: 'stripe',
                gatewayTransactionId: gatewayTransactionId,
                gatewayTransactionStatus: session.payment_status,
                gatewayResponsePayload: session,
                creditPackageId: creditPackage.id,
                reason: `Compra del paquete: ${creditPackage.name}`,
            };
            const newTransaction = transactionRepo.create(transactionData);
            await transactionRepo.save(newTransaction);
            this.logger.log(`Credits added and transaction recorded for user ${userId} from Stripe session ${session.id}`, 'CreditService');
        });
    }
    async adminAdjustCredits(adminUserId, targetUserId, amount, reason) {
        return this.entityManager.transaction(async (tem) => {
            const userRepo = tem.getRepository(user_entity_1.UserEntity);
            const user = await userRepo.findOneBy({ id: targetUserId });
            if (!user)
                throw new common_1.NotFoundException(`User with ID ${targetUserId} not found.`);
            const balanceBefore = user.creditBalance;
            user.creditBalance += amount;
            const balanceAfter = user.creditBalance;
            await userRepo.save(user);
            return this.internalRecordTransaction({
                targetUserId: user.id,
                adminUserId: adminUserId,
                action: credit_transaction_entity_1.CreditTransactionAction.ADMIN_ADJUSTMENT,
                amount: amount,
                balanceBefore,
                balanceAfter,
                reason,
            }, tem);
        });
    }
    async addWelcomeCredits(targetUserId, amount) {
        try {
            return this.entityManager.transaction(async (tem) => {
                const userRepo = tem.getRepository(user_entity_1.UserEntity);
                const user = await userRepo.findOneBy({ id: targetUserId });
                if (!user)
                    throw new common_1.NotFoundException(`User with ID ${targetUserId} not found.`);
                const balanceBefore = user.creditBalance;
                user.creditBalance += amount;
                const balanceAfter = user.creditBalance;
                await userRepo.save(user);
                return this.internalRecordTransaction({
                    targetUserId: targetUserId,
                    action: credit_transaction_entity_1.CreditTransactionAction.WELCOME_BONUS,
                    amount: amount,
                    balanceBefore,
                    balanceAfter,
                    reason: 'Créditos de bonificación de bienvenida',
                }, tem);
            });
        }
        catch (error) {
            this.logger.error(`Error adding welcome credits: ${error.message}`, error.stack, 'CreditService');
            throw error;
        }
    }
    async findTransactionByGatewayIdAndUser(gatewayTransactionId, targetUserId) {
        this.logger.log(`Finding transaction by gatewayId: ${gatewayTransactionId} for user: ${targetUserId}`, 'CreditService');
        return this.creditTransactionRepository.findOne({
            where: {
                gatewayTransactionId,
                targetUserId: targetUserId,
                action: credit_transaction_entity_1.CreditTransactionAction.PURCHASE_SUCCESS,
            },
        });
    }
    async internalRecordTransaction(data, manager) {
        const transactionRepo = manager.getRepository(credit_transaction_entity_1.CreditTransactionEntity);
        const transaction = transactionRepo.create(data);
        return transactionRepo.save(transaction);
    }
};
exports.CreditService = CreditService;
exports.CreditService = CreditService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(credit_package_entity_1.CreditPackageEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(credit_transaction_entity_1.CreditTransactionEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        stripe_service_1.StripeService,
        logger_service_1.CustomLoggerService,
        typeorm_2.EntityManager])
], CreditService);
//# sourceMappingURL=credit.service.js.map