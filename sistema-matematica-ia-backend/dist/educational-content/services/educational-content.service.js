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
exports.EducationalContentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const country_entity_1 = require("../entities/country.entity");
const educational_stage_entity_1 = require("../entities/educational-stage.entity");
const educational_subdivision_entity_1 = require("../entities/educational-subdivision.entity");
let EducationalContentService = class EducationalContentService {
    countryRepository;
    stageRepository;
    subdivisionRepository;
    constructor(countryRepository, stageRepository, subdivisionRepository) {
        this.countryRepository = countryRepository;
        this.stageRepository = stageRepository;
        this.subdivisionRepository = subdivisionRepository;
    }
    async createCountry(countryData) {
        const country = this.countryRepository.create(countryData);
        return this.countryRepository.save(country);
    }
    async getAllCountries() {
        return this.countryRepository.find({ order: { display_order: 'ASC' } });
    }
    async getCountryById(id) {
        const country = await this.countryRepository.findOne({ where: { id } });
        if (!country) {
            throw new common_1.NotFoundException(`Country with ID "${id}" not found`);
        }
        return country;
    }
    async updateCountry(id, countryData) {
        await this.countryRepository.update(id, countryData);
        return this.getCountryById(id);
    }
    async deleteCountry(id) {
        const result = await this.countryRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Country with ID "${id}" not found`);
        }
    }
    async createEducationalStage(stageData) {
        const stage = this.stageRepository.create(stageData);
        return this.stageRepository.save(stage);
    }
    async getAllEducationalStages(countryId) {
        return this.stageRepository.find({
            where: { country_id: countryId },
            order: { display_order: 'ASC' }
        });
    }
    async getEducationalStageById(id) {
        const stage = await this.stageRepository.findOne({ where: { id } });
        if (!stage) {
            throw new common_1.NotFoundException(`Educational Stage with ID "${id}" not found`);
        }
        return stage;
    }
    async updateEducationalStage(id, stageData) {
        await this.stageRepository.update(id, stageData);
        return this.getEducationalStageById(id);
    }
    async deleteEducationalStage(id) {
        const result = await this.stageRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Educational Stage with ID "${id}" not found`);
        }
    }
    async createEducationalSubdivision(subdivisionData) {
        const subdivision = this.subdivisionRepository.create(subdivisionData);
        return this.subdivisionRepository.save(subdivision);
    }
    async getAllEducationalSubdivisions(stageId) {
        return this.subdivisionRepository.find({
            where: { educational_stage_id: stageId },
            order: { display_order: 'ASC' }
        });
    }
    async getEducationalSubdivisionById(id) {
        const subdivision = await this.subdivisionRepository.findOne({ where: { id } });
        if (!subdivision) {
            throw new common_1.NotFoundException(`Educational Subdivision with ID "${id}" not found`);
        }
        return subdivision;
    }
    async updateEducationalSubdivision(id, subdivisionData) {
        await this.subdivisionRepository.update(id, subdivisionData);
        return this.getEducationalSubdivisionById(id);
    }
    async deleteEducationalSubdivision(id) {
        const result = await this.subdivisionRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Educational Subdivision with ID "${id}" not found`);
        }
    }
    async getCompleteStructure() {
        return this.countryRepository.find({
            relations: ['educational_stages', 'educational_stages.educational_subdivisions'],
            order: {
                display_order: 'ASC',
                educational_stages: {
                    display_order: 'ASC',
                    educational_subdivisions: {
                        display_order: 'ASC'
                    }
                }
            }
        });
    }
};
exports.EducationalContentService = EducationalContentService;
exports.EducationalContentService = EducationalContentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(country_entity_1.CountryEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(educational_stage_entity_1.EducationalStageEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(educational_subdivision_entity_1.EducationalSubdivisionEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], EducationalContentService);
//# sourceMappingURL=educational-content.service.js.map