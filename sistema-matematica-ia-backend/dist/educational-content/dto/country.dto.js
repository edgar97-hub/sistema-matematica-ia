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
exports.UpdateCountryDto = exports.CreateCountryDto = void 0;
const class_validator_1 = require("class-validator");
class CreateCountryDto {
    name;
    code;
    flag_url;
    is_active;
}
exports.CreateCountryDto = CreateCountryDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(1, 100, { message: 'El nombre del país debe tener entre 1 y 100 caracteres' }),
    __metadata("design:type", String)
], CreateCountryDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(3, 3, { message: 'El código del país debe tener exactamente 3 caracteres' }),
    (0, class_validator_1.Matches)(/^[A-Z]{3}$/, { message: 'El código del país debe ser de 3 letras mayúsculas' }),
    __metadata("design:type", String)
], CreateCountryDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(0, 255, { message: 'La URL de la bandera no debe exceder los 255 caracteres' }),
    __metadata("design:type", String)
], CreateCountryDto.prototype, "flag_url", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateCountryDto.prototype, "is_active", void 0);
class UpdateCountryDto {
    name;
    code;
    flag_url;
    is_active;
}
exports.UpdateCountryDto = UpdateCountryDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(1, 100, { message: 'El nombre del país debe tener entre 1 y 100 caracteres' }),
    __metadata("design:type", String)
], UpdateCountryDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(3, 3, { message: 'El código del país debe tener exactamente 3 caracteres' }),
    (0, class_validator_1.Matches)(/^[A-Z]{3}$/, { message: 'El código del país debe ser de 3 letras mayúsculas' }),
    __metadata("design:type", String)
], UpdateCountryDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(0, 255, { message: 'La URL de la bandera no debe exceder los 255 caracteres' }),
    __metadata("design:type", String)
], UpdateCountryDto.prototype, "flag_url", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateCountryDto.prototype, "is_active", void 0);
//# sourceMappingURL=country.dto.js.map