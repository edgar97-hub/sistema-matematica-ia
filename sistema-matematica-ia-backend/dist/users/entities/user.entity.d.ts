import { BaseEntity } from '../../common/entities/base.entity';
import { CreditTransactionEntity } from '../../credit-system/entities/credit-transaction.entity';
import { UserPwaRole } from '../enums/user-pwa-role.enum';
export declare class UserEntity extends BaseEntity {
    name: string;
    email: string;
    googleId: string;
    pictureUrl: string;
    credits: number;
    credit_balance: number;
    role: UserPwaRole;
    isActive: boolean;
    countryOfOrigin: string;
    credit_transactions: CreditTransactionEntity[];
}
