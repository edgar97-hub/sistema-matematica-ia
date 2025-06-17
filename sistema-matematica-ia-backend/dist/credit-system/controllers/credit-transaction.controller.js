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
exports.CreditTransactionController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const admin_guard_1 = require("../../auth/guards/admin.guard");
const credit_service_1 = require("../services/credit.service");
const stripe_service_1 = require("../services/stripe.service");
const credit_transaction_entity_1 = require("../entities/credit-transaction.entity");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const config_1 = require("@nestjs/config");
const logger_service_1 = require("../../common/services/logger.service");
const rawBody = require("raw-body");
class GetAllCreditTransactionsDto {
    page;
    limit;
    startDate;
    endDate;
    action;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], GetAllCreditTransactionsDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], GetAllCreditTransactionsDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], GetAllCreditTransactionsDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], GetAllCreditTransactionsDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(credit_transaction_entity_1.CreditTransactionAction),
    __metadata("design:type", String)
], GetAllCreditTransactionsDto.prototype, "action", void 0);
class CreateCheckoutSessionDto {
    packageId;
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateCheckoutSessionDto.prototype, "packageId", void 0);
let CreditTransactionController = class CreditTransactionController {
    creditService;
    stripeService;
    configService;
    logger;
    constructor(creditService, stripeService, configService, logger) {
        this.creditService = creditService;
        this.stripeService = stripeService;
        this.configService = configService;
        this.logger = logger;
    }
    async createCheckoutSession(createCheckoutSessionDto, req) {
        const userId = req.user.id;
        const { packageId } = createCheckoutSessionDto;
        const session = await this.stripeService.createStripeCheckoutSession(userId, packageId);
        return { sessionId: session.id };
    }
    async getUserCreditHistory(userId, page = 1, limit = 10) {
        return this.creditService.getUserCreditHistory(userId, page, limit);
    }
    async getAllCreditTransactions(query) {
        const { page = 1, limit = 10, startDate, endDate, action } = query;
        const filters = {};
        if (startDate)
            filters.startDate = new Date(startDate);
        if (endDate)
            filters.endDate = new Date(endDate);
        if (action)
            filters.action = action;
        return this.creditService.getAllCreditTransactions(page, limit, filters);
    }
    async handleStripeWebhook(req, res) {
        const sig = req.headers['stripe-signature'];
        const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
        if (!webhookSecret) {
            this.logger.error('Stripe webhook secret is not defined', '', 'CreditTransactionController');
            return res.status(500).send('Webhook Error: Secret is not configured');
        }
        let event;
        try {
            const body = await rawBody(req);
            event = await this.stripeService.constructWebhookEvent(body, sig, webhookSecret);
        }
        catch (err) {
            this.logger.error(`Webhook Error: ${err.message}`, err.stack, 'CreditTransactionController');
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            try {
                await this.creditService.handleCheckoutSessionCompleted(session);
                this.logger.log(`Credit purchase confirmed for session: ${session.id}`, 'CreditTransactionController');
            }
            catch (error) {
                this.logger.error(`Error handling completed checkout session: ${error.message}`, error.stack, 'CreditTransactionController');
            }
        }
        res.json({ received: true });
    }
    async adminAdjustCredits(adjustmentData) {
        const { userId, amount, reason } = adjustmentData;
        return this.creditService.adminAdjustCredits(userId, amount, reason);
    }
};
exports.CreditTransactionController = CreditTransactionController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('create-checkout-session'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateCheckoutSessionDto, Object]),
    __metadata("design:returntype", Promise)
], CreditTransactionController.prototype, "createCheckoutSession", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.Get)('history/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], CreditTransactionController.prototype, "getUserCreditHistory", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GetAllCreditTransactionsDto]),
    __metadata("design:returntype", Promise)
], CreditTransactionController.prototype, "getAllCreditTransactions", null);
__decorate([
    (0, common_1.Post)('stripe-webhook'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CreditTransactionController.prototype, "handleStripeWebhook", null);
__decorate([
    (0, common_1.Post)('admin/adjust'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CreditTransactionController.prototype, "adminAdjustCredits", null);
exports.CreditTransactionController = CreditTransactionController = __decorate([
    (0, common_1.Controller)('credit-transactions'),
    __metadata("design:paramtypes", [credit_service_1.CreditService,
        stripe_service_1.StripeService,
        config_1.ConfigService,
        logger_service_1.CustomLoggerService])
], CreditTransactionController);
function getRawBody(req) {
    return new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', () => {
            resolve(Buffer.from(data));
        });
        req.on('error', reject);
    });
}
//# sourceMappingURL=credit-transaction.controller.js.map