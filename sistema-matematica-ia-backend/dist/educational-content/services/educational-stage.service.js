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
exports.EducationalStageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const educational_stage_entity_1 = require("../entities/educational-stage.entity");
let EducationalStageService = class EducationalStageService {
    educationalStageRepository;
    constructor(educationalStageRepository) {
        this.educationalStageRepository = educationalStageRepository;
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
        const [items, total] = await this.educationalStageRepository.findAndCount({
            where,
            order,
            take: limit,
            skip: (page - 1) * limit,
        });
        return { items, total };
    }
    async findOne(id) {
        const stage = await this.educationalStageRepository.findOne({ where: { id } });
        if (!stage) {
            throw new common_1.NotFoundException(`Educational Stage with ID "${id}" not found`);
        }
        return stage;
    }
    async create(createEducationalStageDto) {
        const newStage = this.educationalStageRepository.create(createEducationalStageDto);
        return this.educationalStageRepository.save(newStage);
    }
    async update(id, updateEducationalStageDto) {
        await this.educationalStageRepository.update(id, updateEducationalStageDto);
        const updatedStage = await this.educationalStageRepository.findOne({ where: { id } });
        if (!updatedStage) {
            throw new common_1.NotFoundException(`Educational Stage with ID "${id}" not found`);
        }
        return updatedStage;
    }
    async remove(id) {
        const result = await this.educationalStageRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Educational Stage with ID "${id}" not found`);
        }
    }
    async findActiveStagesByCountry(countryId) {
        return this.educationalStageRepository.createQueryBuilder('stage')
            .leftJoinAndSelect('stage.educational_subdivisions', 'subdivision')
            .where('stage.country_id = :countryId', { countryId })
            .andWhere('stage.is_active = :isActive', { isActive: true })
            .andWhere('subdivision.is_active = :isActive', { isActive: true })
            .getMany();
    }
};
exports.EducationalStageService = EducationalStageService;
exports.EducationalStageService = EducationalStageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(educational_stage_entity_1.EducationalStageEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EducationalStageService);
//# sourceMappingURL=educational-stage.service.js.map