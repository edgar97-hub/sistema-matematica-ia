import { BaseEntity } from '../../common/entities/base.entity';
export declare class CreditPackageEntity extends BaseEntity {
    name: string;
    description: string;
    creditAmount: number;
    price: number;
    isActive: boolean;
    currency: string;
}
