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
exports.CreditPackageController = void 0;
const common_1 = require("@nestjs/common");
const credit_package_service_1 = require("../services/credit-package.service");
const create_credit_package_dto_1 = require("../dto/create-credit-package.dto");
const update_credit_package_dto_1 = require("../dto/update-credit-package.dto");
const admin_guard_1 = require("../../auth/guards/admin.guard");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let CreditPackageController = class CreditPackageController {
    creditPackageService;
    constructor(creditPackageService) {
        this.creditPackageService = creditPackageService;
    }
    create(createCreditPackageDto) {
        console.log('createCreditPackageDto', createCreditPackageDto);
        return this.creditPackageService.create(createCreditPackageDto);
    }
    findAll() {
        return this.creditPackageService.findAll();
    }
    findOne(id) {
        return this.creditPackageService.findOne(+id);
    }
    update(id, updateCreditPackageDto) {
        return this.creditPackageService.update(+id, updateCreditPackageDto);
    }
    remove(id) {
        return this.creditPackageService.remove(+id);
    }
};
exports.CreditPackageController = CreditPackageController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_credit_package_dto_1.CreateCreditPackageDto]),
    __metadata("design:returntype", void 0)
], CreditPackageController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CreditPackageController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CreditPackageController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_credit_package_dto_1.UpdateCreditPackageDto]),
    __metadata("design:returntype", void 0)
], CreditPackageController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CreditPackageController.prototype, "remove", null);
exports.CreditPackageController = CreditPackageController = __decorate([
    (0, common_1.Controller)('credit-packages'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __metadata("design:paramtypes", [credit_package_service_1.CreditPackageService])
], CreditPackageController);
//# sourceMappingURL=credit-package.controller.js.map