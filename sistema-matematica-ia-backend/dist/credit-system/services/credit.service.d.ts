import { Repository, EntityManager } from 'typeorm';
import { CreditPackageEntity } from '../entities/credit-package.entity';
import { CreditTransactionEntity, CreditTransactionAction } from '../entities/credit-transaction.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { StripeService } from './stripe.service';
import { CustomLoggerService } from '../../common/services/logger.service';
import Stripe from 'stripe';
export declare class CreditService {
    private creditPackageRepository;
    private creditTransactionRepository;
    private userRepository;
    private stripeService;
    private logger;
    private entityManager;
    constructor(creditPackageRepository: Repository<CreditPackageEntity>, creditTransactionRepository: Repository<CreditTransactionEntity>, userRepository: Repository<UserEntity>, stripeService: StripeService, logger: CustomLoggerService, entityManager: EntityManager);
    recordTransaction(data: Partial<CreditTransactionEntity>): Promise<CreditTransactionEntity>;
    purchaseCredits(userId: number, packageId: number): Promise<CreditTransactionEntity>;
    confirmCreditPurchase(sessionId: string): Promise<void>;
    handleCheckoutSessionCompleted(session: Stripe.Checkout.Session): Promise<void>;
    useCredits(userId: number, amount: number, description: string): Promise<CreditTransactionEntity>;
    getCreditBalance(userId: number): Promise<number>;
    getCreditTransactions(userId: number): Promise<CreditTransactionEntity[]>;
    addWelcomeCredits(userId: number, amount: number): Promise<CreditTransactionEntity>;
    adminAdjustCredits(userId: number, amount: number, reason: string): Promise<CreditTransactionEntity>;
    getUserCreditHistory(targetUserId: string, page: number, limit: number): Promise<{
        data: CreditTransactionEntity[];
        total: number;
    }>;
    getAllCreditTransactions(page: number, limit: number, filters?: {
        startDate?: Date;
        endDate?: Date;
        action?: CreditTransactionAction;
    }): Promise<{
        data: CreditTransactionEntity[];
        total: number;
    }>;
    deductCreditsForOrder(userId: number, orderId: string, amount: number): Promise<CreditTransactionEntity>;
}
