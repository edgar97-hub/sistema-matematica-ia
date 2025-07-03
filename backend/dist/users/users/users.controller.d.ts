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
    findOne(id: number): Promise<any>;
    updateByAdmin(id: number, updateUserByAdminDto: UpdateUserByAdminDto): Promise<import("../entities/user.entity").UserEntity>;
    getProfile(user: any): Promise<any>;
    updateProfileByUserStandar(user: any, updateProfileDto: UpdateUserPwaProfileDto): Promise<import("../entities/user.entity").UserEntity>;
    updateEmail(id: number, email: string): Promise<import("../entities/user.entity").UserEntity>;
    remove(id: number): Promise<import("../entities/user.entity").UserEntity>;
}
