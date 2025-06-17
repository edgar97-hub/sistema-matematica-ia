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
exports.CountryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const country_entity_1 = require("../entities/country.entity");
let CountryService = class CountryService {
    countryRepository;
    constructor(countryRepository) {
        this.countryRepository = countryRepository;
    }
    async findAll(page = 1, limit = 10, filter, sort) {
        const where = {};
        const order = {};
        if (filter) {
            where.name = { $ilike: `%${filter}%` };
        }
        if (sort) {
            const [field, direction] = sort.split(':');
            order[field] = direction.toUpperCase();
        }
        const [items, total] = await this.countryRepository.findAndCount({
            where,
            order,
            take: limit,
            skip: (page - 1) * limit,
        });
        return { items, total };
    }
    async findOne(id) {
        const country = await this.countryRepository.findOne({ where: { id } });
        if (!country) {
            throw new common_1.NotFoundException(`Country with ID "${id}" not found`);
        }
        return country;
    }
    async create(createCountryDto) {
        const newCountry = this.countryRepository.create(createCountryDto);
        return this.countryRepository.save(newCountry);
    }
    async update(id, updateCountryDto) {
        await this.countryRepository.update(id, updateCountryDto);
        const updatedCountry = await this.countryRepository.findOne({ where: { id } });
        if (!updatedCountry) {
            throw new common_1.NotFoundException(`Country with ID "${id}" not found`);
        }
        return updatedCountry;
    }
    async remove(id) {
        const result = await this.countryRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Country with ID "${id}" not found`);
        }
    }
    async findActiveCountriesForPwa() {
        return this.countryRepository.createQueryBuilder('country')
            .leftJoinAndSelect('country.educational_stages', 'stage')
            .where('country.is_active = :isActive', { isActive: true })
            .andWhere('stage.is_active = :isActive', { isActive: true })
            .getMany();
    }
    async isValidCountry(countryName) {
        const country = await this.countryRepository.findOne({
            where: { name: countryName, is_active: true }
        });
        return !!country;
    }
};
exports.CountryService = CountryService;
exports.CountryService = CountryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(country_entity_1.CountryEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CountryService);
//# sourceMappingURL=country.service.js.map