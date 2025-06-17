import { UsersService } from './users.service';
import { CreateUserPwaDto } from '../dto/create-user-pwa.dto';
import { UpdateUserByAdminDto } from '../dto/update-user-by-admin.dto';
import { UpdateUserPwaProfileDto } from '../dto/update-user-pwa-profile.dto';
import { FindAllUsersQueryDto } from '../dto/FindAllUsersQueryDto.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserPwaDto): Promise<import("../entities/user.entity").UserEntity>;
    findAll(queryDto: FindAllUsersQueryDto): Promise<{
        data: import("../entities/user.entity").UserEntity[];
        total: number;
    }>;
    findOne(id: number): Promise<import("../entities/user.entity").UserEntity>;
    updateByAdmin(id: number, updateUserByAdminDto: UpdateUserByAdminDto): Promise<import("../entities/user.entity").UserEntity>;
    remove(id: number): Promise<void>;
    getProfile(user: any): Promise<import("../entities/user.entity").UserEntity>;
    updateProfile(user: any, updateProfileDto: UpdateUserPwaProfileDto): Promise<import("../entities/user.entity").UserEntity>;
    updateEmail(id: number, email: string): Promise<import("../entities/user.entity").UserEntity>;
}
