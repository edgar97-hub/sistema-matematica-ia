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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EducationalStageEntity = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../common/entities/base.entity");
const country_entity_1 = require("./country.entity");
const educational_subdivision_entity_1 = require("./educational-subdivision.entity");
let EducationalStageEntity = class EducationalStageEntity extends base_entity_1.BaseEntity {
    name;
    description;
    min_age;
    max_age;
    display_order;
    is_active;
    country_id;
    country;
    educational_subdivisions;
};
exports.EducationalStageEntity = EducationalStageEntity;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], EducationalStageEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], EducationalStageEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], EducationalStageEntity.prototype, "min_age", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], EducationalStageEntity.prototype, "max_age", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], EducationalStageEntity.prototype, "display_order", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], EducationalStageEntity.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], EducationalStageEntity.prototype, "country_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => country_entity_1.CountryEntity, country => country.educational_stages, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'country_id' }),
    __metadata("design:type", country_entity_1.CountryEntity)
], EducationalStageEntity.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => educational_subdivision_entity_1.EducationalSubdivisionEntity, subdivision => subdivision.educational_stage),
    __metadata("design:type", Array)
], EducationalStageEntity.prototype, "educational_subdivisions", void 0);
exports.EducationalStageEntity = EducationalStageEntity = __decorate([
    (0, typeorm_1.Entity)('educational_stages')
], EducationalStageEntity);
//# sourceMappingURL=educational-stage.entity.js.map