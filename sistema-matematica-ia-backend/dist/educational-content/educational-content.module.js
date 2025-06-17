"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EducationalContentModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const country_entity_1 = require("./entities/country.entity");
const educational_stage_entity_1 = require("./entities/educational-stage.entity");
const educational_subdivision_entity_1 = require("./entities/educational-subdivision.entity");
const country_service_1 = require("./services/country.service");
const educational_stage_service_1 = require("./services/educational-stage.service");
const educational_subdivision_service_1 = require("./services/educational-subdivision.service");
const educational_content_service_1 = require("./services/educational-content.service");
const country_controller_1 = require("./controllers/country.controller");
const educational_stage_controller_1 = require("./controllers/educational-stage.controller");
const educational_subdivision_controller_1 = require("./controllers/educational-subdivision.controller");
let EducationalContentModule = class EducationalContentModule {
};
exports.EducationalContentModule = EducationalContentModule;
exports.EducationalContentModule = EducationalContentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                country_entity_1.CountryEntity,
                educational_stage_entity_1.EducationalStageEntity,
                educational_subdivision_entity_1.EducationalSubdivisionEntity,
            ]),
        ],
        controllers: [
            country_controller_1.CountryController,
            educational_stage_controller_1.EducationalStageController,
            educational_subdivision_controller_1.EducationalSubdivisionController,
        ],
        providers: [
            country_service_1.CountryService,
            educational_stage_service_1.EducationalStageService,
            educational_subdivision_service_1.EducationalSubdivisionService,
            educational_content_service_1.EducationalContentService,
        ],
        exports: [
            country_service_1.CountryService,
            educational_stage_service_1.EducationalStageService,
            educational_subdivision_service_1.EducationalSubdivisionService,
            educational_content_service_1.EducationalContentService,
        ],
    })
], EducationalContentModule);
//# sourceMappingURL=educational-content.module.js.map