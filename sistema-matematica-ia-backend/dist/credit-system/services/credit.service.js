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
    async recordTransaction(data) {
        return this.entityManager.transaction(async (transactionalEntityManager) => {
            const user = await transactionalEntityManager.findOne(user_entity_1.UserEntity, {
                where: { id: data.target_user_id },
            });
            if (!user) {
                throw new common_1.NotFoundException(`User with ID "${data.target_user_id}" not found`);
            }
            if (typeof data.amount !== 'number') {
                throw new common_1.BadRequestException('Transaction amount must be a number');
            }
            const balanceBefore = user.credit_balance;
            user.credit_balance += data.amount;
            const balanceAfter = user.credit_balance;
            const transaction = transactionalEntityManager.create(credit_transaction_entity_1.CreditTransactionEntity, {
                ...data,
                balance_before: balanceBefore,
                balance_after: balanceAfter,
            });
            await transactionalEntityManager.save(user);
            await transactionalEntityManager.save(transaction);
            return transaction;
        });
    }
    async purchaseCredits(userId, packageId) {
        try {
            const creditPackage = await this.creditPackageRepository.findOne({
                where: { id: packageId },
            });
            if (!creditPackage) {
                throw new common_1.NotFoundException(`Credit package with ID "${packageId}" not found`);
            }
            const paymentIntent = await this.stripeService.createPaymentIntent(creditPackage.price * 100, 'usd');
            const transaction = await this.recordTransaction({
                action: credit_transaction_entity_1.CreditTransactionAction.PURCHASE_SUCCESS,
                amount: creditPackage.credit_amount,
                target_user_id: userId,
                credit_package_id: packageId,
                payment_gateway: 'stripe',
                gateway_transaction_id: paymentIntent.id,
                gateway_transaction_status: paymentIntent.status,
                gateway_response_payload: paymentIntent,
            });
            this.logger.log(`Credit purchase initiated: ${transaction.id}`, 'CreditService');
            return transaction;
        }
        catch (error) {
            this.logger.error(`Error purchasing credits: ${error.message}`, error.stack, 'CreditService');
            throw error;
        }
    }
    async confirmCreditPurchase(sessionId) {
        try {
            const session = await this.stripeService.retrieveCheckoutSession(sessionId);
            if (session.payment_status !== 'paid') {
                this.logger.warn(`Checkout session ${sessionId} is not paid`, 'CreditService');
                return;
            }
            if (!session.client_reference_id || !session.metadata?.packageId) {
                throw new Error('Missing user ID or package ID in session metadata');
            }
            const userId = parseInt(session.client_reference_id);
            const packageId = parseInt(session.metadata.packageId);
            if (isNaN(userId) || isNaN(packageId)) {
                throw new Error('Invalid user ID or package ID in session metadata');
            }
            const creditPackage = await this.creditPackageRepository.findOne({ where: { id: packageId } });
            if (!creditPackage) {
                throw new common_1.NotFoundException(`Credit package with ID ${packageId} not found`);
            }
            await this.recordTransaction({
                action: credit_transaction_entity_1.CreditTransactionAction.PURCHASE_SUCCESS,
                amount: creditPackage.credit_amount,
                target_user_id: userId,
                credit_package_id: packageId,
                payment_gateway: 'stripe',
                gateway_transaction_id: sessionId,
                gateway_transaction_status: 'completed',
            });
            this.logger.log(`Credit purchase confirmed for user ${userId}, package ${packageId}`, 'CreditService');
        }
        catch (error) {
            this.logger.error(`Error confirming credit purchase: ${error.message}`, error.stack, 'CreditService');
            throw error;
        }
    }
    async handleCheckoutSessionCompleted(session) {
        try {
            await this.confirmCreditPurchase(session.id);
        }
        catch (error) {
            this.logger.error(`Error handling completed checkout session: ${error.message}`, error.stack, 'CreditService');
            throw error;
        }
    }
    async useCredits(userId, amount, description) {
        try {
            return await this.recordTransaction({
                action: credit_transaction_entity_1.CreditTransactionAction.USAGE_RESOLUTION,
                amount: -amount,
                target_user_id: userId,
                reason: description,
            });
        }
        catch (error) {
            this.logger.error(`Error using credits: ${error.message}`, error.stack, 'CreditService');
            throw error;
        }
    }
    async getCreditBalance(userId) {
        try {
            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user) {
                throw new common_1.NotFoundException(`User with ID "${userId}" not found`);
            }
            return user.credit_balance;
        }
        catch (error) {
            this.logger.error(`Error getting credit balance: ${error.message}`, error.stack, 'CreditService');
            throw error;
        }
    }
    async getCreditTransactions(userId) {
        try {
            return this.creditTransactionRepository.find({
                where: { target_user_id: userId },
                order: { createdAt: 'DESC' },
            });
        }
        catch (error) {
            this.logger.error(`Error getting credit transactions: ${error.message}`, error.stack, 'CreditService');
            throw error;
        }
    }
    async addWelcomeCredits(userId, amount) {
        try {
            return await this.recordTransaction({
                action: credit_transaction_entity_1.CreditTransactionAction.WELCOME_BONUS,
                amount: amount,
                target_user_id: userId,
                reason: 'Welcome bonus credits',
            });
        }
        catch (error) {
            this.logger.error(`Error adding welcome credits: ${error.message}`, error.stack, 'CreditService');
            throw error;
        }
    }
    async adminAdjustCredits(userId, amount, reason) {
        try {
            return await this.recordTransaction({
                action: credit_transaction_entity_1.CreditTransactionAction.ADMIN_ADJUSTMENT,
                amount: amount,
                target_user_id: userId,
                reason: reason,
            });
        }
        catch (error) {
            this.logger.error(`Error adjusting credits by admin: ${error.message}`, error.stack, 'CreditService');
            throw error;
        }
    }
    async getUserCreditHistory(targetUserId, page, limit) {
        try {
            const [data, total] = await this.creditTransactionRepository.findAndCount({
                where: { target_user_id: parseInt(targetUserId) },
                order: { createdAt: 'DESC' },
                skip: (page - 1) * limit,
                take: limit,
            });
            return { data, total };
        }
        catch (error) {
            this.logger.error(`Error getting user credit history: ${error.message}`, error.stack, 'CreditService');
            throw error;
        }
    }
    async getAllCreditTransactions(page, limit, filters) {
        try {
            const query = this.creditTransactionRepository.createQueryBuilder('transaction');
            if (filters?.startDate) {
                query.andWhere('transaction.createdAt >= :startDate', { startDate: filters.startDate });
            }
            if (filters?.endDate) {
                query.andWhere('transaction.createdAt <= :endDate', { endDate: filters.endDate });
            }
            if (filters?.action) {
                query.andWhere('transaction.action = :action', { action: filters.action });
            }
            query.orderBy('transaction.createdAt', 'DESC')
                .skip((page - 1) * limit)
                .take(limit);
            const [data, total] = await query.getManyAndCount();
            return { data, total };
        }
        catch (error) {
            this.logger.error(`Error getting all credit transactions: ${error.message}`, error.stack, 'CreditService');
            throw error;
        }
    }
    async deductCreditsForOrder(userId, orderId, amount) {
        try {
            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user) {
                throw new common_1.NotFoundException(`User with ID "${userId}" not found`);
            }
            if (user.credit_balance < amount) {
                throw new common_1.BadRequestException('Insufficient credits for this order');
            }
            const transaction = await this.recordTransaction({
                action: credit_transaction_entity_1.CreditTransactionAction.USAGE_RESOLUTION,
                amount: -amount,
                target_user_id: userId,
                reason: `Credit deduction for order ${orderId}`,
            });
            this.logger.log(`Credits deducted for order: User ${userId}, Order ${orderId}, Amount ${amount}`, 'CreditService');
            return transaction;
        }
        catch (error) {
            this.logger.error(`Error deducting credits for order: ${error.message}`, error.stack, 'CreditService');
            throw error;
        }
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