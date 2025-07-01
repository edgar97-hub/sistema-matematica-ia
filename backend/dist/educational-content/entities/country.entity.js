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
exports.FindAllCountriesQueryDto = exports.CountryEntity = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../common/entities/base.entity");
const educational_stage_entity_1 = require("./educational-stage.entity");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
let CountryEntity = class CountryEntity extends base_entity_1.BaseEntity {
    name;
    code;
    flag_url;
    is_active;
    display_order;
    educational_stages;
};
exports.CountryEntity = CountryEntity;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, unique: true }),
    __metadata("design:type", String)
], CountryEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 3, unique: true, nullable: true }),
    __metadata("design:type", String)
], CountryEntity.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], CountryEntity.prototype, "flag_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], CountryEntity.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], CountryEntity.prototype, "display_order", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => educational_stage_entity_1.EducationalStageEntity, (stage) => stage.country),
    __metadata("design:type", Array)
], CountryEntity.prototype, "educational_stages", void 0);
exports.CountryEntity = CountryEntity = __decorate([
    (0, typeorm_1.Entity)('countries')
], CountryEntity);
class FindAllCountriesQueryDto {
    page = 1;
    limit = 10;
    sortField;
    sortDirection;
    name;
    isActive;
}
exports.FindAllCountriesQueryDto = FindAllCountriesQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], FindAllCountriesQueryDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], FindAllCountriesQueryDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)([
        'createdAt',
        'name',
        'email',
        'credits',
        'countryOfOrigin',
        'isActive',
    ]),
    __metadata("design:type", String)
], FindAllCountriesQueryDto.prototype, "sortField", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['ASC', 'DESC']),
    __metadata("design:type", String)
], FindAllCountriesQueryDto.prototype, "sortDirection", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FindAllCountriesQueryDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === 'true')
            return true;
        if (value === 'false')
            return false;
        return value;
    }),
    (0, class_validator_1.IsBoolean)({ message: 'isActive debe ser un booleano (true o false)' }),
    __metadata("design:type", Boolean)
], FindAllCountriesQueryDto.prototype, "isActive", void 0);
//# sourceMappingURL=country.entity.js.map