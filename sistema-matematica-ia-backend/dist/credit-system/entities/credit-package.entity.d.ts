import { BaseEntity } from '../../common/entities/base.entity';
export declare class CreditPackageEntity extends BaseEntity {
    name: string;
    description: string;
    credit_amount: number;
    price: number;
    is_active: boolean;
}
