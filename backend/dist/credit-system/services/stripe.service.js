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
exports.StripeService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const stripe_1 = require("stripe");
const logger_service_1 = require("../../common/services/logger.service");
const credit_package_entity_1 = require("../entities/credit-package.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const credit_transaction_entity_1 = require("../entities/credit-transaction.entity");
let StripeService = class StripeService {
    configService;
    logger;
    creditPackageRepository;
    userRepository;
    creditTransactionRepository;
    stripe;
    constructor(configService, logger, creditPackageRepository, userRepository, creditTransactionRepository) {
        this.configService = configService;
        this.logger = logger;
        this.creditPackageRepository = creditPackageRepository;
        this.userRepository = userRepository;
        this.creditTransactionRepository = creditTransactionRepository;
    }
    onModuleInit() {
        const stripeSecretKey = this.configService.get('STRIPE_SECRET_KEY');
        if (!stripeSecretKey) {
            this.logger.error('STRIPE_SECRET_KEY is not defined in the environment variables', '', 'StripeService');
            throw new Error('STRIPE_SECRET_KEY is not defined in the environment variables');
        }
        this.stripe = new stripe_1.default(stripeSecretKey, {
            apiVersion: '2025-05-28.basil',
            typescript: true,
        });
        this.logger.log('Stripe service initialized', 'StripeService');
    }
    async createStripeCheckoutSession(userId, packageId) {
        try {
            const creditPackage = await this.creditPackageRepository.findOne({
                where: { id: packageId },
            });
            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!creditPackage || !user) {
                throw new Error('Credit package or user not found');
            }
            const priceInSoles = creditPackage.price;
            const amountInCentsForStripe = Math.round(priceInSoles * 100);
            const session = await this.stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'pen',
                            product_data: {
                                name: creditPackage.name,
                                description: `Paquete de ${creditPackage.creditAmount} créditos para el Sistema de Resolución Matemática.`,
                            },
                            unit_amount: amountInCentsForStripe,
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `${this.configService.get('FRONTEND_URL')}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${this.configService.get('FRONTEND_URL')}/payment/cancel`,
                client_reference_id: userId.toString(),
                metadata: {
                    userId: userId.toString(),
                    packageId: packageId.toString(),
                    creditsAmount: creditPackage.creditAmount.toString(),
                },
            });
            this.logger.log(`Checkout session created: ${session.id}`, 'StripeService');
            return session;
        }
        catch (error) {
            this.logger.error(`Error creating checkout session: ${error.message}`, error.stack, 'StripeService');
            throw error;
        }
    }
    constructWebhookEvent(payload, sig, endpointSecret) {
        if (!this.stripe) {
            throw new common_1.InternalServerErrorException('Stripe service is not available.');
        }
        return this.stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    }
};
exports.StripeService = StripeService;
exports.StripeService = StripeService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(credit_package_entity_1.CreditPackageEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(credit_transaction_entity_1.CreditTransactionEntity)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        logger_service_1.CustomLoggerService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], StripeService);
//# sourceMappingURL=stripe.service.js.map