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
exports.EducationalSubdivisionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const educational_subdivision_entity_1 = require("../entities/educational-subdivision.entity");
let EducationalSubdivisionService = class EducationalSubdivisionService {
    educationalSubdivisionRepository;
    constructor(educationalSubdivisionRepository) {
        this.educationalSubdivisionRepository = educationalSubdivisionRepository;
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
        const [items, total] = await this.educationalSubdivisionRepository.findAndCount({
            where,
            order,
            take: limit,
            skip: (page - 1) * limit,
        });
        return { items, total };
    }
    async findOne(id) {
        const subdivision = await this.educationalSubdivisionRepository.findOne({ where: { id } });
        if (!subdivision) {
            throw new common_1.NotFoundException(`Educational Subdivision with ID "${id}" not found`);
        }
        return subdivision;
    }
    async create(createEducationalSubdivisionDto) {
        const newSubdivision = this.educationalSubdivisionRepository.create(createEducationalSubdivisionDto);
        return this.educationalSubdivisionRepository.save(newSubdivision);
    }
    async update(id, updateEducationalSubdivisionDto) {
        await this.educationalSubdivisionRepository.update(id, updateEducationalSubdivisionDto);
        const updatedSubdivision = await this.educationalSubdivisionRepository.findOne({ where: { id } });
        if (!updatedSubdivision) {
            throw new common_1.NotFoundException(`Educational Subdivision with ID "${id}" not found`);
        }
        return updatedSubdivision;
    }
    async remove(id) {
        const result = await this.educationalSubdivisionRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Educational Subdivision with ID "${id}" not found`);
        }
    }
    async findActiveSubdivisionsByStage(stageId) {
        return this.educationalSubdivisionRepository.find({
            where: {
                educational_stage_id: stageId,
                is_active: true
            },
            order: {
                display_order: 'ASC'
            }
        });
    }
};
exports.EducationalSubdivisionService = EducationalSubdivisionService;
exports.EducationalSubdivisionService = EducationalSubdivisionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(educational_subdivision_entity_1.EducationalSubdivisionEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EducationalSubdivisionService);
//# sourceMappingURL=educational-subdivision.service.js.map