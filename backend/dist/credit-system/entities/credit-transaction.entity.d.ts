import { BaseEntity } from '../../common/entities/base.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { AdminUserEntity } from '../../admin-users/entities/admin-user.entity';
import { CreditPackageEntity } from './credit-package.entity';
import { OrderEntity } from 'src/orders/entities/order.entity';
export declare enum CreditTransactionAction {
    PURCHASE_SUCCESS = "purchase_success",
    USAGE_RESOLUTION = "usage_resolution",
    WELCOME_BONUS = "welcome_bonus",
    ADMIN_ADJUSTMENT = "admin_adjustment"
}
export declare class CreditTransactionEntity extends BaseEntity {
    orders: OrderEntity[];
    targetUser: UserEntity;
    targetUserId: number;
    adminUser: AdminUserEntity;
    adminUserId: number;
    action: CreditTransactionAction;
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    reason: string;
    paymentGateway: string;
    gatewayTransactionId: string;
    gatewayTransactionStatus: string;
    gatewayResponsePayload: any;
    creditPackage: CreditPackageEntity;
    creditPackageId: number;
}
