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
var ManimService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManimService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
let ManimService = ManimService_1 = class ManimService {
    httpService;
    configService;
    manimServiceUrl;
    logger = new common_1.Logger(ManimService_1.name);
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.manimServiceUrl =
            this.configService.get('MANIM_MICROSERVICE_URL') ||
                'http://localhost:8000';
    }
    async renderAnimationVideoViaMicroservice(orderId, solutionJson) {
        this.logger.log(`ManimService: Sending data for order ${orderId} to microservice (SIMULATED).`);
        console.log('Solution JSON (simulated sent):', solutionJson);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const animationVideoPath = `uploads/temp_animations/${orderId}_manim_animation.mp4`;
        this.logger.log(`ManimService: Successfully simulated video generation for order ${orderId}. Video path: ${animationVideoPath}`);
        return { animationVideoPath: animationVideoPath };
    }
};
exports.ManimService = ManimService;
exports.ManimService = ManimService = ManimService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], ManimService);
//# sourceMappingURL=manim.service.js.map