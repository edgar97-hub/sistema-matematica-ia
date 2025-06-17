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
exports.CreditController = void 0;
const common_1 = require("@nestjs/common");
const credit_service_1 = require("../services/credit.service");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const user_decorator_1 = require("../../users/decorators/user.decorator");
const user_entity_1 = require("../../users/entities/user.entity");
const logger_service_1 = require("../../common/services/logger.service");
let CreditController = class CreditController {
    creditService;
    logger;
    constructor(creditService, logger) {
        this.creditService = creditService;
        this.logger = logger;
    }
    async purchaseCredits(user, packageId) {
        try {
            const result = await this.creditService.purchaseCredits(user.id, packageId);
            this.logger.log(`User ${user.id} initiated credit purchase: ${result.id}`, 'CreditController');
            return result;
        }
        catch (error) {
            this.logger.error(`Error in credit purchase: ${error.message}`, error.stack, 'CreditController');
            throw new common_1.HttpException('Failed to purchase credits', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async confirmPurchase(paymentIntentId) {
        try {
            const result = await this.creditService.confirmCreditPurchase(paymentIntentId);
            this.logger.log(`Credit purchase confirmed: ${result}`, 'CreditController');
            return result;
        }
        catch (error) {
            this.logger.error(`Error in confirming credit purchase: ${error.message}`, error.stack, 'CreditController');
            throw new common_1.HttpException('Failed to confirm credit purchase', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async useCredits(user, amount, description) {
        try {
            const result = await this.creditService.useCredits(user.id, amount, description);
            this.logger.log(`User ${user.id} used credits: ${result.id}`, 'CreditController');
            return result;
        }
        catch (error) {
            this.logger.error(`Error in using credits: ${error.message}`, error.stack, 'CreditController');
            throw new common_1.HttpException('Failed to use credits', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getCreditBalance(user) {
        try {
            const balance = await this.creditService.getCreditBalance(user.id);
            this.logger.log(`Retrieved credit balance for user ${user.id}`, 'CreditController');
            return { balance };
        }
        catch (error) {
            this.logger.error(`Error in getting credit balance: ${error.message}`, error.stack, 'CreditController');
            throw new common_1.HttpException('Failed to get credit balance', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getCreditTransactions(user) {
        try {
            const transactions = await this.creditService.getCreditTransactions(user.id);
            this.logger.log(`Retrieved credit transactions for user ${user.id}`, 'CreditController');
            return transactions;
        }
        catch (error) {
            this.logger.error(`Error in getting credit transactions: ${error.message}`, error.stack, 'CreditController');
            throw new common_1.HttpException('Failed to get credit transactions', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.CreditController = CreditController;
__decorate([
    (0, common_1.Post)('purchase/:packageId'),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Param)('packageId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.UserEntity, Number]),
    __metadata("design:returntype", Promise)
], CreditController.prototype, "purchaseCredits", null);
__decorate([
    (0, common_1.Post)('confirm-purchase'),
    __param(0, (0, common_1.Body)('paymentIntentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CreditController.prototype, "confirmPurchase", null);
__decorate([
    (0, common_1.Post)('use'),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Body)('amount', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)('description')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.UserEntity, Number, String]),
    __metadata("design:returntype", Promise)
], CreditController.prototype, "useCredits", null);
__decorate([
    (0, common_1.Get)('balance'),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], CreditController.prototype, "getCreditBalance", null);
__decorate([
    (0, common_1.Get)('transactions'),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], CreditController.prototype, "getCreditTransactions", null);
exports.CreditController = CreditController = __decorate([
    (0, common_1.Controller)('credits'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [credit_service_1.CreditService,
        logger_service_1.CustomLoggerService])
], CreditController);
//# sourceMappingURL=credit.controller.js.map