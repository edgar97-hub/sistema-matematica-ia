import { BaseEntity } from '../../common/entities/base.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { AdminUserEntity } from '../../admin-users/entities/admin-user.entity';
import { CreditPackageEntity } from './credit-package.entity';
export declare enum CreditTransactionAction {
    PURCHASE_SUCCESS = "purchase_success",
    USAGE_RESOLUTION = "usage_resolution",
    WELCOME_BONUS = "welcome_bonus",
    ADMIN_ADJUSTMENT = "admin_adjustment"
}
export declare class CreditTransactionEntity extends BaseEntity {
    targetUser: UserEntity;
    target_user_id: number;
    adminUser: AdminUserEntity;
    admin_user_id: number;
    action: CreditTransactionAction;
    amount: number;
    balance_before: number;
    balance_after: number;
    reason: string;
    payment_gateway: string;
    gateway_transaction_id: string;
    gateway_transaction_status: string;
    gateway_response_payload: any;
    creditPackage: CreditPackageEntity;
    credit_package_id: number;
}
