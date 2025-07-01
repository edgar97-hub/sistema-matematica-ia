import { Repository } from 'typeorm';
import { AdminUserEntity } from '../entities/admin-user.entity';
import { AdminRole } from '../enums/admin-role.enum';
export declare class AdminUsersService {
    private readonly adminUserRepository;
    constructor(adminUserRepository: Repository<AdminUserEntity>);
    findByUsername(username: string): Promise<AdminUserEntity | null>;
    findById(id: number): Promise<AdminUserEntity | null>;
    create(adminUserData: {
        username: string;
        password: string;
        email: string;
        name: string;
        role?: AdminRole;
    }): Promise<AdminUserEntity>;
    validateUser(username: string, password: string): Promise<AdminUserEntity | null>;
    findAll(): Promise<AdminUserEntity[]>;
}
