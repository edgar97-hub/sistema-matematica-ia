import { CreditService } from '../services/credit.service';
import { UserEntity } from '../../users/entities/user.entity';
import { CustomLoggerService } from '../../common/services/logger.service';
export declare class CreditController {
    private readonly creditService;
    private readonly logger;
    constructor(creditService: CreditService, logger: CustomLoggerService);
    purchaseCredits(user: UserEntity, packageId: number): Promise<import("../entities/credit-transaction.entity").CreditTransactionEntity>;
    confirmPurchase(paymentIntentId: string): Promise<void>;
    useCredits(user: UserEntity, amount: number, description: string): Promise<import("../entities/credit-transaction.entity").CreditTransactionEntity>;
    getCreditBalance(user: UserEntity): Promise<{
        balance: number;
    }>;
    getCreditTransactions(user: UserEntity): Promise<import("../entities/credit-transaction.entity").CreditTransactionEntity[]>;
}
