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
exports.EducationalSubdivisionController = void 0;
const common_1 = require("@nestjs/common");
const educational_subdivision_service_1 = require("../services/educational-subdivision.service");
const educational_subdivision_dto_1 = require("../dto/educational-subdivision.dto");
let EducationalSubdivisionController = class EducationalSubdivisionController {
    educationalSubdivisionService;
    constructor(educationalSubdivisionService) {
        this.educationalSubdivisionService = educationalSubdivisionService;
    }
    create(createEducationalSubdivisionDto) {
        return this.educationalSubdivisionService.create(createEducationalSubdivisionDto);
    }
    findAll(page = 1, limit = 10, filter, sort) {
        return this.educationalSubdivisionService.findAll(page, limit, filter, sort);
    }
    findActiveByStage(stageId) {
        return this.educationalSubdivisionService.findActiveSubdivisionsByStage(+stageId);
    }
    findOne(id) {
        return this.educationalSubdivisionService.findOne(+id);
    }
    update(id, updateEducationalSubdivisionDto) {
        return this.educationalSubdivisionService.update(+id, updateEducationalSubdivisionDto);
    }
    remove(id) {
        return this.educationalSubdivisionService.remove(+id);
    }
};
exports.EducationalSubdivisionController = EducationalSubdivisionController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [educational_subdivision_dto_1.CreateEducationalSubdivisionDto]),
    __metadata("design:returntype", void 0)
], EducationalSubdivisionController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('filter')),
    __param(3, (0, common_1.Query)('sort')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", void 0)
], EducationalSubdivisionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('by-stage/:stageId/pwa-list'),
    __param(0, (0, common_1.Param)('stageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EducationalSubdivisionController.prototype, "findActiveByStage", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EducationalSubdivisionController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, educational_subdivision_dto_1.UpdateEducationalSubdivisionDto]),
    __metadata("design:returntype", void 0)
], EducationalSubdivisionController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EducationalSubdivisionController.prototype, "remove", null);
exports.EducationalSubdivisionController = EducationalSubdivisionController = __decorate([
    (0, common_1.Controller)('educational-subdivisions'),
    __metadata("design:paramtypes", [educational_subdivision_service_1.EducationalSubdivisionService])
], EducationalSubdivisionController);
//# sourceMappingURL=educational-subdivision.controller.js.map