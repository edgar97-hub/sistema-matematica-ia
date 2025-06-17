import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { CreateUserPwaDto } from '../dto/create-user-pwa.dto';
import { UpdateUserPwaProfileDto } from '../dto/update-user-pwa-profile.dto';
import { UpdateUserByAdminDto } from '../dto/update-user-by-admin.dto';
import { CountryService } from '../../educational-content/services/country.service';
import { FindAllUsersQueryDto } from '../dto/FindAllUsersQueryDto.dto';
export declare class UsersService {
    private readonly userRepository;
    private readonly countryService;
    constructor(userRepository: Repository<UserEntity>, countryService: CountryService);
    findAll(queryDto: FindAllUsersQueryDto): Promise<{
        data: UserEntity[];
        total: number;
    }>;
    findById(id: number): Promise<UserEntity>;
    findByEmail(email: string): Promise<UserEntity | null>;
    findByGoogleId(googleId: string): Promise<UserEntity | null>;
    create(createUserDto: CreateUserPwaDto): Promise<UserEntity>;
    updateProfile(userId: number, updateProfileDto: UpdateUserPwaProfileDto): Promise<UserEntity>;
    updateByAdmin(userId: number, updateUserDto: UpdateUserByAdminDto): Promise<UserEntity>;
    updateUserCredits(userId: number, newCreditBalance: number): Promise<UserEntity>;
    remove(id: number): Promise<void>;
    findOrCreateFromGoogle(profile: CreateUserPwaDto): Promise<UserEntity>;
    updateEmail(userId: number, newEmail: string): Promise<UserEntity>;
}
