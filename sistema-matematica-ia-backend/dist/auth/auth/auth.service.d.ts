import { JwtService } from '@nestjs/jwt';
import { AdminUsersService } from '../../admin-users/admin-users/admin-users.service';
import { AdminUserEntity } from '../../admin-users/entities/admin-user.entity';
import { UsersService } from '../../users/users/users.service';
import { UserEntity } from '../../users/entities/user.entity';
import { SystemConfigurationService } from '../../system-configuration/services/system-configuration.service';
import { CreditService } from '../../credit-system/services/credit.service';
export interface JwtPayload {
    sub: number;
    username?: string;
    email?: string;
    role: string;
    type: 'admin' | 'pwa';
}
export declare class AuthService {
    private adminUsersService;
    private usersService;
    private jwtService;
    private systemConfigurationService;
    private creditService;
    constructor(adminUsersService: AdminUsersService, usersService: UsersService, jwtService: JwtService, systemConfigurationService: SystemConfigurationService, creditService: CreditService);
    validateAdmin(username: string, password: string): Promise<AdminUserEntity | null>;
    loginAdmin(user: AdminUserEntity): Promise<{
        accessToken: string;
        user: {
            id: number;
            username: string;
            email: string;
            name: string;
            role: import("../../admin-users/enums/admin-role.enum").AdminRole;
        };
    }>;
    findOrCreatePwaUser(profile: any): Promise<UserEntity>;
    loginPwaUser(user: UserEntity): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            name: string;
            profile_picture: string;
            credit_balance: number;
            role: import("../../users/enums/user-pwa-role.enum").UserPwaRole;
        };
    }>;
    validateJwtPayload(payload: JwtPayload): Promise<AdminUserEntity | UserEntity | null>;
}
