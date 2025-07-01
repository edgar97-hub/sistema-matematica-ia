"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemConfigurationModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const system_configuration_entity_1 = require("./entities/system-configuration.entity");
const system_configuration_service_1 = require("./services/system-configuration.service");
const system_configuration_controller_1 = require("./controllers/system-configuration.controller");
let SystemConfigurationModule = class SystemConfigurationModule {
};
exports.SystemConfigurationModule = SystemConfigurationModule;
exports.SystemConfigurationModule = SystemConfigurationModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([system_configuration_entity_1.SystemConfigurationEntity])],
        providers: [system_configuration_service_1.SystemConfigurationService],
        controllers: [system_configuration_controller_1.SystemConfigurationController],
        exports: [system_configuration_service_1.SystemConfigurationService],
    })
], SystemConfigurationModule);
//# sourceMappingURL=system-configuration.module.js.map