import { CreditService } from '../services/credit.service';
import { StripeService } from '../services/stripe.service';
import { CreditTransactionAction } from '../entities/credit-transaction.entity';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { CustomLoggerService } from '../../common/services/logger.service';
declare class GetAllCreditTransactionsDto {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    action?: CreditTransactionAction;
}
declare class CreateCheckoutSessionDto {
    packageId: number;
}
export declare class CreditTransactionController {
    private readonly creditService;
    private readonly stripeService;
    private readonly configService;
    private readonly logger;
    constructor(creditService: CreditService, stripeService: StripeService, configService: ConfigService, logger: CustomLoggerService);
    createCheckoutSession(createCheckoutSessionDto: CreateCheckoutSessionDto, req: Request): Promise<{
        sessionId: string;
    }>;
    getUserCreditHistory(userId: string, page?: number, limit?: number): Promise<{
        data: import("../entities/credit-transaction.entity").CreditTransactionEntity[];
        total: number;
    }>;
    getAllCreditTransactions(query: GetAllCreditTransactionsDto): Promise<{
        data: import("../entities/credit-transaction.entity").CreditTransactionEntity[];
        total: number;
    }>;
    handleStripeWebhook(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    adminAdjustCredits(adjustmentData: {
        userId: number;
        amount: number;
        reason: string;
    }): Promise<import("../entities/credit-transaction.entity").CreditTransactionEntity>;
}
export {};
