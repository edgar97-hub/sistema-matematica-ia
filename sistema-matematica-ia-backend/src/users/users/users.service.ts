import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindOptionsWhere,
  ILike,
  FindOneOptions,
  FindManyOptions,
} from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserPwaRole } from '../enums/user-pwa-role.enum';
import { CreateUserPwaDto } from '../dto/create-user-pwa.dto';
import { UpdateUserPwaProfileDto } from '../dto/update-user-pwa-profile.dto';
import { UpdateUserByAdminDto } from '../dto/update-user-by-admin.dto';
import { CountryService } from '../../educational-content/services/country.service';
import { FindAllUsersQueryDto } from '../dto/FindAllUsersQueryDto.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly countryService: CountryService,
  ) {}

  async findAll(
    queryDto: FindAllUsersQueryDto,
  ): Promise<{ data: UserEntity[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      sortField,
      sortDirection,
      name,
      email,
      isActive,
      countryOfOrigin,
    } = queryDto;

    const skip = (page - 1) * limit;

    const queryOptions: FindManyOptions<UserEntity> = {
      skip: skip,
      take: limit,
      order: {},
      where: {},
    };

    if (sortField && sortDirection) {
      queryOptions.order = { [sortField]: sortDirection };
    } else {
      queryOptions.order = { createdAt: 'DESC' }; // Orden por defecto
    }

    if (name) {
      queryOptions.where = { ...queryOptions.where, name: ILike(`%${name}%`) }; // ILike para case-insensitive
    }
    if (email) {
      queryOptions.where = {
        ...queryOptions.where,
        email: ILike(`%${email}%`),
      };
    }
    if (isActive !== undefined) {
      // isActive puede ser true o false
      queryOptions.where = { ...queryOptions.where, isActive: isActive };
    }
    if (countryOfOrigin) {
      queryOptions.where = {
        ...queryOptions.where,
        countryOfOrigin: ILike(`%${countryOfOrigin}%`),
      };
    }

    const [data, total] = await this.userRepository.findAndCount(queryOptions);
    return { data, total };
  }
  async findById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const options: FindOneOptions<UserEntity> = { where: { email } };
    return this.userRepository.findOne(options);
  }

  async findByGoogleId(googleId: string): Promise<UserEntity | null> {
    const options: FindOneOptions<UserEntity> = { where: { googleId } };
    return this.userRepository.findOne(options);
  }

  async create(createUserDto: CreateUserPwaDto): Promise<UserEntity> {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const user = this.userRepository.create({
      ...createUserDto,
      role: UserPwaRole.CLIENT,
      isActive: true,
      credits: 0,
    });

    return this.userRepository.save(user);
  }

  async updateProfile(
    userId: number,
    updateProfileDto: UpdateUserPwaProfileDto,
  ): Promise<UserEntity> {
    const user = await this.findById(userId);

    if (user.countryOfOrigin) {
      throw new BadRequestException('Country of origin can only be set once');
    }

    const isValidCountry = await this.countryService.isValidCountry(
      updateProfileDto.countryOfOrigin,
    );
    if (!isValidCountry) {
      throw new BadRequestException('Invalid country of origin');
    }

    user.countryOfOrigin = updateProfileDto.countryOfOrigin;
    return this.userRepository.save(user);
  }

  async updateByAdmin(
    userId: number,
    updateUserDto: UpdateUserByAdminDto,
  ): Promise<UserEntity> {
    const user = await this.findById(userId);

    if (updateUserDto.name) user.name = updateUserDto.name;
    if (updateUserDto.isActive !== undefined)
      user.isActive = updateUserDto.isActive;
    if (updateUserDto.countryOfOrigin) {
      const isValidCountry = await this.countryService.isValidCountry(
        updateUserDto.countryOfOrigin,
      );
      if (!isValidCountry) {
        throw new BadRequestException('Invalid country of origin');
      }
      user.countryOfOrigin = updateUserDto.countryOfOrigin;
    }

    return this.userRepository.save(user);
  }

  async updateUserCredits(
    userId: number,
    newCreditBalance: number,
  ): Promise<UserEntity> {
    const user = await this.findById(userId);
    user.credits = newCreditBalance;
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findById(id);
    user.isActive = !user.isActive;
    await this.userRepository.save(user);
  }

  async findOrCreateFromGoogle(profile: CreateUserPwaDto): Promise<UserEntity> {
    let user = await this.findByGoogleId(profile.googleId);

    if (user) {
      if (
        user.name !== profile.name ||
        user.pictureUrl !== profile.pictureUrl
      ) {
        user.name = profile.name;
        user.pictureUrl = profile.pictureUrl ?? '';
        user = await this.userRepository.save(user);
      }
      return user;
    }

    return this.create(profile);
  }

  async updateEmail(userId: number, newEmail: string): Promise<UserEntity> {
    const user = await this.findById(userId);
    const existingUser = await this.findByEmail(newEmail);

    if (existingUser && existingUser.id !== userId) {
      throw new BadRequestException('Email is already in use');
    }

    user.email = newEmail;
    return this.userRepository.save(user);
  }
}
