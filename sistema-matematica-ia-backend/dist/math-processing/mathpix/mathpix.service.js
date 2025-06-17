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
exports.MathpixService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
const operators_1 = require("rxjs/operators");
const rxjs_1 = require("rxjs");
let MathpixService = class MathpixService {
    httpService;
    configService;
    appId;
    appKey;
    apiUrl = 'https://api.mathpix.com/v3/text';
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.appId = this.configService.get('MATHPIX_APP_ID') || '';
        this.appKey = this.configService.get('MATHPIX_APP_KEY') || '';
    }
    async extractTextFromImageUrl(imageUrl) {
        const headers = {
            'content-type': 'application/json',
            'app_id': this.appId,
            'app_key': this.appKey,
        };
        const data = {
            src: imageUrl,
            formats: ['text', 'latex_styled'],
        };
        try {
            const response = await this.httpService.post(this.apiUrl, data, { headers })
                .pipe((0, operators_1.map)((res) => {
                if (res.data.error) {
                    return { error: res.data.error };
                }
                return res.data;
            }), (0, operators_1.catchError)(err => {
                console.error('Mathpix API error:', err);
                return (0, rxjs_1.throwError)('Failed to extract text from image using Mathpix API');
            })).toPromise();
            return response;
        }
        catch (error) {
            console.error('Error in MathpixService:', error);
            return { error: error.message };
        }
    }
};
exports.MathpixService = MathpixService;
exports.MathpixService = MathpixService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(axios_1.HttpService)),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], MathpixService);
//# sourceMappingURL=mathpix.service.js.map