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
exports.EducationalStageController = void 0;
const common_1 = require("@nestjs/common");
const educational_stage_service_1 = require("../services/educational-stage.service");
const educational_stage_dto_1 = require("../dto/educational-stage.dto");
let EducationalStageController = class EducationalStageController {
    educationalStageService;
    constructor(educationalStageService) {
        this.educationalStageService = educationalStageService;
    }
    create(createEducationalStageDto) {
        return this.educationalStageService.create(createEducationalStageDto);
    }
    findAll(page = 1, limit = 10, filter, sort) {
        return this.educationalStageService.findAll(page, limit, filter, sort);
    }
    findActiveByCountry(countryId) {
        return this.educationalStageService.findActiveStagesByCountry(+countryId);
    }
    findOne(id) {
        return this.educationalStageService.findOne(+id);
    }
    update(id, updateEducationalStageDto) {
        return this.educationalStageService.update(+id, updateEducationalStageDto);
    }
    remove(id) {
        return this.educationalStageService.remove(+id);
    }
};
exports.EducationalStageController = EducationalStageController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [educational_stage_dto_1.CreateEducationalStageDto]),
    __metadata("design:returntype", void 0)
], EducationalStageController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('filter')),
    __param(3, (0, common_1.Query)('sort')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", void 0)
], EducationalStageController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('by-country/:countryId/pwa-list'),
    __param(0, (0, common_1.Param)('countryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EducationalStageController.prototype, "findActiveByCountry", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EducationalStageController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, educational_stage_dto_1.UpdateEducationalStageDto]),
    __metadata("design:returntype", void 0)
], EducationalStageController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EducationalStageController.prototype, "remove", null);
exports.EducationalStageController = EducationalStageController = __decorate([
    (0, common_1.Controller)('educational-stages'),
    __metadata("design:paramtypes", [educational_stage_service_1.EducationalStageService])
], EducationalStageController);
//# sourceMappingURL=educational-stage.controller.js.map