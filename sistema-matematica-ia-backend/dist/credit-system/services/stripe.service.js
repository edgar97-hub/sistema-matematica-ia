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
const logger_service_1 = require("../../common/services/logger.service");
const credit_package_entity_1 = require("../entities/credit-package.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let StripeService = class StripeService {
    configService;
    logger;
    creditPackageRepository;
    userRepository;
    stripe;
    constructor(configService, logger, creditPackageRepository, userRepository) {
        this.configService = configService;
        this.logger = logger;
        this.creditPackageRepository = creditPackageRepository;
        this.userRepository = userRepository;
    }
    onModuleInit() {
    }
    async createStripeCheckoutSession(userId, packageId) {
        try {
            const creditPackage = await this.creditPackageRepository.findOne({ where: { id: packageId } });
            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!creditPackage || !user) {
                throw new Error('Credit package or user not found');
            }
            const session = await this.stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: `${creditPackage.credit_amount} Credits`,
                                description: `Purchase of ${creditPackage.credit_amount} credits`,
                            },
                            unit_amount: creditPackage.price * 100,
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `${this.configService.get('FRONTEND_URL')}/credits/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${this.configService.get('FRONTEND_URL')}/credits/cancel`,
                client_reference_id: userId.toString(),
                metadata: {
                    packageId: packageId.toString(),
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
    async createPaymentIntent(amount, currency) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount,
                currency,
            });
            this.logger.log(`Payment intent created: ${paymentIntent.id}`, 'StripeService');
            return paymentIntent;
        }
        catch (error) {
            this.logger.error(`Error creating payment intent: ${error.message}`, error.stack, 'StripeService');
            throw error;
        }
    }
    async confirmPaymentIntent(paymentIntentId) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId);
            this.logger.log(`Payment intent confirmed: ${paymentIntent.id}`, 'StripeService');
            return paymentIntent;
        }
        catch (error) {
            this.logger.error(`Error confirming payment intent: ${error.message}`, error.stack, 'StripeService');
            throw error;
        }
    }
    async createCustomer(email) {
        try {
            const customer = await this.stripe.customers.create({ email });
            this.logger.log(`Customer created: ${customer.id}`, 'StripeService');
            return customer;
        }
        catch (error) {
            this.logger.error(`Error creating customer: ${error.message}`, error.stack, 'StripeService');
            throw error;
        }
    }
    async createSetupIntent(customerId) {
        try {
            const setupIntent = await this.stripe.setupIntents.create({
                customer: customerId,
                usage: 'off_session',
            });
            this.logger.log(`Setup intent created: ${setupIntent.id}`, 'StripeService');
            return setupIntent;
        }
        catch (error) {
            this.logger.error(`Error creating setup intent: ${error.message}`, error.stack, 'StripeService');
            throw error;
        }
    }
    async chargeCustomer(customerId, amount, currency) {
        try {
            const paymentMethods = await this.stripe.paymentMethods.list({
                customer: customerId,
                type: 'card',
            });
            if (paymentMethods.data.length === 0) {
                this.logger.error(`No payment method found for customer: ${customerId}`, '', 'StripeService');
                throw new Error('No payment method found for this customer');
            }
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount,
                currency,
                customer: customerId,
                payment_method: paymentMethods.data[0].id,
                off_session: true,
                confirm: true,
            });
            this.logger.log(`Customer charged successfully: ${paymentIntent.id}`, 'StripeService');
            return paymentIntent;
        }
        catch (error) {
            this.logger.error(`Error charging customer: ${error.message}`, error.stack, 'StripeService');
            throw error;
        }
    }
    async constructWebhookEvent(payload, signature, webhookSecret) {
        try {
            const event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
            return event;
        }
        catch (error) {
            this.logger.error(`Error constructing webhook event: ${error.message}`, error.stack, 'StripeService');
            throw error;
        }
    }
    async retrieveCheckoutSession(sessionId) {
        try {
            const session = await this.stripe.checkout.sessions.retrieve(sessionId);
            return session;
        }
        catch (error) {
            this.logger.error(`Error retrieving checkout session: ${error.message}`, error.stack, 'StripeService');
            throw error;
        }
    }
};
exports.StripeService = StripeService;
exports.StripeService = StripeService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(credit_package_entity_1.CreditPackageEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        logger_service_1.CustomLoggerService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], StripeService);
//# sourceMappingURL=stripe.service.js.map