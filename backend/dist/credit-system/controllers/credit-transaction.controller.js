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
exports.CreditTransactionController = exports.GetAllCreditTransactionsDto = void 0;
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
class GetAllCreditTransactionsDto {
    page = 1;
    limit = 10;
    startDate;
    endDate;
    action;
    targetUserId;
}
exports.GetAllCreditTransactionsDto = GetAllCreditTransactionsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: 'La página debe ser un número entero.' }),
    (0, class_validator_1.Min)(1, { message: 'La página debe ser al menos 1.' }),
    __metadata("design:type", Number)
], GetAllCreditTransactionsDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: 'El límite debe ser un número entero.' }),
    (0, class_validator_1.Min)(1, { message: 'El límite debe ser al menos 1.' }),
    __metadata("design:type", Number)
], GetAllCreditTransactionsDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'La fecha de inicio debe ser una fecha válida (YYYY-MM-DD).' }),
    __metadata("design:type", String)
], GetAllCreditTransactionsDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'La fecha de fin debe ser una fecha válida (YYYY-MM-DD).' }),
    __metadata("design:type", String)
], GetAllCreditTransactionsDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(credit_transaction_entity_1.CreditTransactionAction, {
        message: 'La acción proporcionada no es válida.',
    }),
    __metadata("design:type", String)
], GetAllCreditTransactionsDto.prototype, "action", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetAllCreditTransactionsDto.prototype, "targetUserId", void 0);
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
    async getAllCreditTransactions(queryDto) {
        this.logger.log(`Admin fetching all credit transactions with filters: ${JSON.stringify(queryDto)}`, 'CreditTransactionController');
        return this.creditService.getAllCreditTransactions(queryDto);
    }
    async adminAdjustCredits(adjustmentData, req) {
        const adminUserId = req.user.id;
        const { targetUserId, amount, reason } = adjustmentData;
        return this.creditService.adminAdjustCredits(adminUserId, targetUserId, amount, reason);
    }
    async getPurchaseStatus(sessionId, req) {
        const userId = req.user.id;
        if (!userId) {
            throw new common_1.BadRequestException('User ID not found in token.');
        }
        const transaction = await this.creditService.findTransactionByGatewayIdAndUser(sessionId, userId);
        if (!transaction) {
            return {
                status: 'pending_webhook',
                message: 'La transacción está siendo procesada.',
            };
        }
        if (transaction.action === credit_transaction_entity_1.CreditTransactionAction.PURCHASE_SUCCESS) {
            return {
                status: 'completed',
                message: 'Compra completada y créditos aplicados.',
                creditsAdded: transaction.amount,
                newBalance: transaction.balanceAfter,
            };
        }
        else {
            return {
                status: 'unknown',
                message: 'El estado de la transacción es desconocido.',
            };
        }
    }
    async createCheckoutSession(createCheckoutSessionDto, req) {
        const userId = req.user.id;
        const { packageId } = createCheckoutSessionDto;
        const session = await this.stripeService.createStripeCheckoutSession(userId, packageId);
        return { ...session };
    }
    async handleStripeWebhook(sig, req, res) {
        const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
        if (!sig || !webhookSecret) {
            this.logger.warn('Stripe webhook missing signature or secret.', 'CreditTransactionController');
            return res.status(400).send('Webhook signature or secret missing.');
        }
        const requestBodyBuffer = req.body;
        console.log('Webhook Received. Has rawBody:', requestBodyBuffer);
        if (!requestBodyBuffer) {
            this.logger.error('Raw body is not available for Stripe webhook verification.', '', 'CreditTransactionController');
            return res
                .status(400)
                .send('Webhook error: Raw body not available. Ensure NestJS is configured for raw body parsing on this route.');
        }
        let event;
        try {
            event = this.stripeService.constructWebhookEvent(requestBodyBuffer, sig, webhookSecret);
            this.logger.log(`Stripe webhook event received: ${event.id}, type: ${event.type}`, 'CreditTransactionController');
        }
        catch (err) {
            this.logger.error(`⚠️  Webhook signature verification failed: ${err.message}`, err.stack, 'CreditTransactionController');
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                this.logger.log(`Processing checkout.session.completed for session: ${session.id}`, 'CreditTransactionController');
                try {
                    await this.creditService.handleSuccessfulCheckoutSession(session);
                    this.logger.log(`Successfully processed checkout.session.completed for: ${session.id}`, 'CreditTransactionController');
                }
                catch (error) {
                    this.logger.error(`Error processing checkout session ${session.id} in CreditService: ${error.message}`, error.stack, 'CreditTransactionController');
                }
                break;
            default:
                this.logger.log(`Unhandled Stripe event type: ${event.type}`, 'CreditTransactionController');
        }
        res.status(200).json({ received: true });
    }
};
exports.CreditTransactionController = CreditTransactionController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GetAllCreditTransactionsDto]),
    __metadata("design:returntype", Promise)
], CreditTransactionController.prototype, "getAllCreditTransactions", null);
__decorate([
    (0, common_1.Post)('admin/adjust'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CreditTransactionController.prototype, "adminAdjustCredits", null);
__decorate([
    (0, common_1.Get)('purchase-status/:sessionId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('sessionId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CreditTransactionController.prototype, "getPurchaseStatus", null);
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
    (0, common_1.Post)('stripe-webhook'),
    __param(0, (0, common_1.Headers)('stripe-signature')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CreditTransactionController.prototype, "handleStripeWebhook", null);
exports.CreditTransactionController = CreditTransactionController = __decorate([
    (0, common_1.Controller)('credit-transactions'),
    __metadata("design:paramtypes", [credit_service_1.CreditService,
        stripe_service_1.StripeService,
        config_1.ConfigService,
        logger_service_1.CustomLoggerService])
], CreditTransactionController);
//# sourceMappingURL=credit-transaction.controller.js.map