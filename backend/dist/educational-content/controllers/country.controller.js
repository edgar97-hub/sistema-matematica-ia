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
exports.CountryController = void 0;
const common_1 = require("@nestjs/common");
const country_service_1 = require("../services/country.service");
const country_dto_1 = require("../dto/country.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const admin_guard_1 = require("../../auth/guards/admin.guard");
const country_entity_1 = require("../entities/country.entity");
let CountryController = class CountryController {
    countryService;
    constructor(countryService) {
        this.countryService = countryService;
    }
    create(createCountryDto) {
        return this.countryService.create(createCountryDto);
    }
    findAll(queryDto) {
        return this.countryService.findAll(queryDto);
    }
    findActiveForPwa() {
        return this.countryService.findActiveCountriesForPwa();
    }
    getCompleteStructure() {
    }
    findOne(id) {
        return this.countryService.findOne(+id);
    }
    update(id, updateCountryDto) {
        return this.countryService.update(+id, updateCountryDto);
    }
    remove(id) {
        return this.countryService.remove(+id);
    }
};
exports.CountryController = CountryController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [country_dto_1.CreateCountryDto]),
    __metadata("design:returntype", void 0)
], CountryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [country_entity_1.FindAllCountriesQueryDto]),
    __metadata("design:returntype", void 0)
], CountryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('pwa-list'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CountryController.prototype, "findActiveForPwa", null);
__decorate([
    (0, common_1.Get)('admin/structure'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CountryController.prototype, "getCompleteStructure", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CountryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, country_dto_1.UpdateCountryDto]),
    __metadata("design:returntype", void 0)
], CountryController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CountryController.prototype, "remove", null);
exports.CountryController = CountryController = __decorate([
    (0, common_1.Controller)('countries'),
    __metadata("design:paramtypes", [country_service_1.CountryService])
], CountryController);
//# sourceMappingURL=country.controller.js.map