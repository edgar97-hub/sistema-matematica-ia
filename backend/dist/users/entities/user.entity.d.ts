import { BaseEntity } from '../../common/entities/base.entity';
import { CreditTransactionEntity } from '../../credit-system/entities/credit-transaction.entity';
import { UserPwaRole } from '../enums/user-pwa-role.enum';
import { OrderEntity } from 'src/orders/entities/order.entity';
export declare class UserEntity extends BaseEntity {
    name: string;
    email: string;
    googleId: string;
    pictureUrl: string;
    creditBalance: number;
    role: UserPwaRole;
    isActive: boolean;
    countryOfOrigin: string;
    creditTransactions: CreditTransactionEntity[];
    orders: OrderEntity[];
}
