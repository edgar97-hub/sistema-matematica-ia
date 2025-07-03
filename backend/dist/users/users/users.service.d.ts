import { Repository, EntityManager } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { CreateUserPwaDto } from '../dto/create-user-pwa.dto';
import { UpdateUserPwaProfileDto } from '../dto/update-user-pwa-profile.dto';
import { UpdateUserByAdminDto } from '../dto/update-user-by-admin.dto';
import { CountryService } from '../../educational-content/services/country.service';
import { FindAllUsersQueryDto } from '../dto/FindAllUsersQueryDto.dto';
import { CreditTransactionEntity } from 'src/credit-system/entities/credit-transaction.entity';
export declare class UsersService {
    private readonly userRepository;
    private readonly countryService;
    constructor(userRepository: Repository<UserEntity>, countryService: CountryService);
    create(createUserDto: CreateUserPwaDto): Promise<UserEntity>;
    findAll(queryDto: FindAllUsersQueryDto): Promise<{
        data: UserEntity[];
        total: number;
    }>;
    findById(id: number): Promise<any>;
    findByEmail(email: string): Promise<UserEntity | null>;
    findByGoogleId(googleId: string): Promise<UserEntity | null>;
    updateByAdmin(userId: number, updateUserDto: UpdateUserByAdminDto): Promise<UserEntity>;
    updateProfileByUserStandar(userId: number, updateProfileDto: UpdateUserPwaProfileDto): Promise<UserEntity>;
    updateEmail(userId: number, newEmail: string): Promise<UserEntity>;
    remove(id: number): Promise<UserEntity>;
    findOrCreateFromGoogle(profile: CreateUserPwaDto): Promise<UserEntity>;
    internalRecordTransaction(data: Partial<CreditTransactionEntity>, manager: EntityManager): Promise<CreditTransactionEntity>;
}
