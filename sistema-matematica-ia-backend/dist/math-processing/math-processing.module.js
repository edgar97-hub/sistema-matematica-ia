"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MathProcessingModule = void 0;
const common_1 = require("@nestjs/common");
const mathpix_service_1 = require("./mathpix/mathpix.service");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const openai_service_1 = require("./openai/openai.service");
const file_storage_module_1 = require("../file-storage/file-storage.module");
const manim_service_1 = require("./manim/manim.service");
let MathProcessingModule = class MathProcessingModule {
};
exports.MathProcessingModule = MathProcessingModule;
exports.MathProcessingModule = MathProcessingModule = __decorate([
    (0, common_1.Module)({
        imports: [axios_1.HttpModule, config_1.ConfigModule, file_storage_module_1.FileStorageModule],
        providers: [mathpix_service_1.MathpixService, openai_service_1.OpenaiService, manim_service_1.ManimService],
        exports: [mathpix_service_1.MathpixService, openai_service_1.OpenaiService, manim_service_1.ManimService],
    })
], MathProcessingModule);
//# sourceMappingURL=math-processing.module.js.map