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
exports.EducationalSubdivisionEntity = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../common/entities/base.entity");
const educational_stage_entity_1 = require("./educational-stage.entity");
let EducationalSubdivisionEntity = class EducationalSubdivisionEntity extends base_entity_1.BaseEntity {
    name;
    description;
    display_order;
    is_active;
    educational_stage_id;
    educational_stage;
};
exports.EducationalSubdivisionEntity = EducationalSubdivisionEntity;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], EducationalSubdivisionEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], EducationalSubdivisionEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], EducationalSubdivisionEntity.prototype, "display_order", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], EducationalSubdivisionEntity.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], EducationalSubdivisionEntity.prototype, "educational_stage_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => educational_stage_entity_1.EducationalStageEntity, stage => stage.educational_subdivisions, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'educational_stage_id' }),
    __metadata("design:type", educational_stage_entity_1.EducationalStageEntity)
], EducationalSubdivisionEntity.prototype, "educational_stage", void 0);
exports.EducationalSubdivisionEntity = EducationalSubdivisionEntity = __decorate([
    (0, typeorm_1.Entity)('educational_subdivisions')
], EducationalSubdivisionEntity);
//# sourceMappingURL=educational-subdivision.entity.js.map