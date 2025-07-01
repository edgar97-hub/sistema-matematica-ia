import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { CustomLoggerService } from '../../common/services/logger.service';
import { CreditPackageEntity } from '../entities/credit-package.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { CreditTransactionEntity } from '../entities/credit-transaction.entity';
export declare class StripeService implements OnModuleInit {
    private configService;
    private logger;
    private creditPackageRepository;
    private userRepository;
    private creditTransactionRepository;
    private stripe;
    constructor(configService: ConfigService, logger: CustomLoggerService, creditPackageRepository: Repository<CreditPackageEntity>, userRepository: Repository<UserEntity>, creditTransactionRepository: Repository<CreditTransactionEntity>);
    onModuleInit(): void;
    createStripeCheckoutSession(userId: number, packageId: number): Promise<Stripe.Checkout.Session>;
    constructWebhookEvent(payload: Buffer, sig: string, endpointSecret: string): Stripe.Event;
}
