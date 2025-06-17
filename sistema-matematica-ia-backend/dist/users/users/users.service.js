"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const user_pwa_role_enum_1 = require("../enums/user-pwa-role.enum");
const country_service_1 = require("../../educational-content/services/country.service");
let UsersService = class UsersService {
    userRepository;
    countryService;
    constructor(userRepository, countryService) {
        this.userRepository = userRepository;
        this.countryService = countryService;
    }
    async findAll(queryDto) {
        const { page = 1, limit = 10, sortField, sortDirection, name, email, isActive, countryOfOrigin, } = queryDto;
        const skip = (page - 1) * limit;
        const queryOptions = {
            skip: skip,
            take: limit,
            order: {},
            where: {},
        };
        if (sortField && sortDirection) {
            queryOptions.order = { [sortField]: sortDirection };
        }
        else {
            queryOptions.order = { createdAt: 'DESC' };
        }
        if (name) {
            queryOptions.where = { ...queryOptions.where, name: (0, typeorm_2.ILike)(`%${name}%`) };
        }
        if (email) {
            queryOptions.where = {
                ...queryOptions.where,
                email: (0, typeorm_2.ILike)(`%${email}%`),
            };
        }
        if (isActive !== undefined) {
            queryOptions.where = { ...queryOptions.where, isActive: isActive };
        }
        if (countryOfOrigin) {
            queryOptions.where = {
                ...queryOptions.where,
                countryOfOrigin: (0, typeorm_2.ILike)(`%${countryOfOrigin}%`),
            };
        }
        const [data, total] = await this.userRepository.findAndCount(queryOptions);
        return { data, total };
    }
    async findById(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID "${id}" not found`);
        }
        return user;
    }
    async findByEmail(email) {
        const options = { where: { email } };
        return this.userRepository.findOne(options);
    }
    async findByGoogleId(googleId) {
        const options = { where: { googleId } };
        return this.userRepository.findOne(options);
    }
    async create(createUserDto) {
        const existingUser = await this.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new common_1.BadRequestException('User with this email already exists');
        }
        const user = this.userRepository.create({
            ...createUserDto,
            role: user_pwa_role_enum_1.UserPwaRole.CLIENT,
            isActive: true,
            credits: 0,
        });
        return this.userRepository.save(user);
    }
    async updateProfile(userId, updateProfileDto) {
        const user = await this.findById(userId);
        if (user.countryOfOrigin) {
            throw new common_1.BadRequestException('Country of origin can only be set once');
        }
        const isValidCountry = await this.countryService.isValidCountry(updateProfileDto.countryOfOrigin);
        if (!isValidCountry) {
            throw new common_1.BadRequestException('Invalid country of origin');
        }
        user.countryOfOrigin = updateProfileDto.countryOfOrigin;
        return this.userRepository.save(user);
    }
    async updateByAdmin(userId, updateUserDto) {
        const user = await this.findById(userId);
        if (updateUserDto.name)
            user.name = updateUserDto.name;
        if (updateUserDto.isActive !== undefined)
            user.isActive = updateUserDto.isActive;
        if (updateUserDto.countryOfOrigin) {
            const isValidCountry = await this.countryService.isValidCountry(updateUserDto.countryOfOrigin);
            if (!isValidCountry) {
                throw new common_1.BadRequestException('Invalid country of origin');
            }
            user.countryOfOrigin = updateUserDto.countryOfOrigin;
        }
        return this.userRepository.save(user);
    }
    async updateUserCredits(userId, newCreditBalance) {
        const user = await this.findById(userId);
        user.credits = newCreditBalance;
        return this.userRepository.save(user);
    }
    async remove(id) {
        const user = await this.findById(id);
        user.isActive = !user.isActive;
        await this.userRepository.save(user);
    }
    async findOrCreateFromGoogle(profile) {
        let user = await this.findByGoogleId(profile.googleId);
        if (user) {
            if (user.name !== profile.name ||
                user.pictureUrl !== profile.pictureUrl) {
                user.name = profile.name;
                user.pictureUrl = profile.pictureUrl ?? '';
                user = await this.userRepository.save(user);
            }
            return user;
        }
        return this.create(profile);
    }
    async updateEmail(userId, newEmail) {
        const user = await this.findById(userId);
        const existingUser = await this.findByEmail(newEmail);
        if (existingUser && existingUser.id !== userId) {
            throw new common_1.BadRequestException('Email is already in use');
        }
        user.email = newEmail;
        return this.userRepository.save(user);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        country_service_1.CountryService])
], UsersService);
//# sourceMappingURL=users.service.js.map