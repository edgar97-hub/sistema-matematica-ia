import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { CustomLoggerService } from '../../common/services/logger.service';
import { CreditPackageEntity } from '../entities/credit-package.entity';
import { UserEntity } from '../../users/entities/user.entity';
export declare class StripeService implements OnModuleInit {
    private configService;
    private logger;
    private creditPackageRepository;
    private userRepository;
    private stripe;
    constructor(configService: ConfigService, logger: CustomLoggerService, creditPackageRepository: Repository<CreditPackageEntity>, userRepository: Repository<UserEntity>);
    onModuleInit(): void;
    createStripeCheckoutSession(userId: number, packageId: number): Promise<Stripe.Checkout.Session>;
    createPaymentIntent(amount: number, currency: string): Promise<Stripe.PaymentIntent>;
    confirmPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent>;
    createCustomer(email: string): Promise<Stripe.Customer>;
    createSetupIntent(customerId: string): Promise<Stripe.SetupIntent>;
    chargeCustomer(customerId: string, amount: number, currency: string): Promise<Stripe.PaymentIntent>;
    constructWebhookEvent(payload: string | Buffer, signature: string, webhookSecret: string): Promise<Stripe.Event>;
    retrieveCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session>;
}
