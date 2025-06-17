import { BaseEntity } from '../../common/entities/base.entity';
import { AdminRole } from '../enums/admin-role.enum';
export declare class AdminUserEntity extends BaseEntity {
    username: string;
    password: string;
    email: string;
    name: string;
    role: AdminRole;
    isActive: boolean;
    hashPassword(): Promise<void>;
    validatePassword(password: string): Promise<boolean>;
}
