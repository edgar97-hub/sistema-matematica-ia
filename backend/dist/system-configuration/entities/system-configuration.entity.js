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
exports.SystemConfigurationEntity = void 0;
const typeorm_1 = require("typeorm");
let SystemConfigurationEntity = class SystemConfigurationEntity {
    id;
    openAiPromptBase;
    welcomeCreditEnabled;
    welcomeCreditAmount;
};
exports.SystemConfigurationEntity = SystemConfigurationEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ default: 'main' }),
    __metadata("design:type", String)
], SystemConfigurationEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'openai_prompt_base', type: 'text', nullable: true }),
    __metadata("design:type", String)
], SystemConfigurationEntity.prototype, "openAiPromptBase", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'welcome_credit_enabled', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], SystemConfigurationEntity.prototype, "welcomeCreditEnabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'welcome_credit_amount', type: 'int', default: 1 }),
    __metadata("design:type", Number)
], SystemConfigurationEntity.prototype, "welcomeCreditAmount", void 0);
exports.SystemConfigurationEntity = SystemConfigurationEntity = __decorate([
    (0, typeorm_1.Entity)('system_configuration')
], SystemConfigurationEntity);
//# sourceMappingURL=system-configuration.entity.js.map