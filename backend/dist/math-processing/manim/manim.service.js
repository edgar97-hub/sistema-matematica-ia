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
const rxjs_1 = require("rxjs");
const file_storage_service_1 = require("../../file-storage/file-storage/file-storage.service");
const path_1 = require("path");
let ManimService = ManimService_1 = class ManimService {
    httpService;
    configService;
    fileStorageService;
    manimServiceUrl;
    openaiApiKey;
    logger = new common_1.Logger(ManimService_1.name);
    constructor(httpService, configService, fileStorageService) {
        this.httpService = httpService;
        this.configService = configService;
        this.fileStorageService = fileStorageService;
        this.manimServiceUrl =
            this.configService.get('MANIM_MICROSERVICE_URL') ||
                'http://localhost:3002';
        this.openaiApiKey = this.configService.get('OPENAI_API_KEY') || '';
    }
    async renderSegment(payload) {
        try {
            const renderResponse = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.manimServiceUrl}/render-segment`, payload));
            const renderResult = renderResponse.data;
            if (renderResult.status !== 'success' || !renderResult.video_path) {
                throw new Error(renderResult.message ||
                    'El microservicio Manim devolvió un error durante el renderizado.');
            }
            const pathInContainer = renderResult.video_path;
            const relativePath = (0, path_1.relative)('/app/manim_processing', pathInContainer);
            const pathParts = pathInContainer.split('/');
            const filename = pathParts.pop();
            const downloadUrl = `${this.manimServiceUrl}/videos/${relativePath}`;
            console.log(`Descargando video de animación desde: ${downloadUrl}`, 'ManimService');
            const videoResponse = await (0, rxjs_1.firstValueFrom)(this.httpService.get(downloadUrl, { responseType: 'arraybuffer' }));
            const videoBuffer = Buffer.from(videoResponse.data);
            const saveResult = await this.fileStorageService.uploadBuffer(videoBuffer, `temp/${payload.segmentId}`, filename);
            console.log(`Video de animación guardado localmente en: ${saveResult.filePath}`, 'ManimService');
            return { localPath: saveResult.filePath };
        }
        catch (error) {
            return { error: error.message };
        }
    }
    async renderFullVoiceoverVideo(payload) {
        const loggerContext = 'ManimService_RenderFull';
        this.logger.log(`Solicitando video completo para orden ${payload.orderId}`, loggerContext);
        const renderEndpoint = `${this.manimServiceUrl}/render-full-video`;
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(renderEndpoint, { ...payload, openaiApiKey: this.openaiApiKey }, {
                timeout: 600000,
            }));
            const renderResult = response.data;
            if (renderResult.status !== 'success' || !renderResult.video_path) {
                const errorMessage = renderResult.message || `El microservicio Manim devolvió un error.`;
                this.logger.error(errorMessage, renderResult.stderr, loggerContext);
                throw new Error(errorMessage);
            }
            const pathInContainer = renderResult.video_path;
            this.logger.log(`Microservicio generó el video en (ruta del contenedor): ${pathInContainer}`, loggerContext);
            const processingDirPrefix = '/app/manim_processing/';
            if (!pathInContainer.startsWith(processingDirPrefix)) {
                throw new Error('Ruta de video inesperada del microservicio Manim.');
            }
            const relativePathForDownload = pathInContainer.substring(processingDirPrefix.length);
            const downloadUrl = `${this.manimServiceUrl}/videos/${relativePathForDownload}`;
            this.logger.log(`Descargando video final desde: ${downloadUrl}`, loggerContext);
            const videoResponse = await (0, rxjs_1.firstValueFrom)(this.httpService.get(downloadUrl, { responseType: 'arraybuffer' }));
            const videoBuffer = Buffer.from(videoResponse.data);
            const finalFileName = `order_${payload.orderId}_final.mp4`;
            const saveResult = await this.fileStorageService.uploadBuffer(videoBuffer, 'final_videos', finalFileName);
            this.logger.log(`Video final guardado localmente en: ${saveResult.filePath}`, loggerContext);
            return { localPath: saveResult.filePath };
        }
        catch (error) {
            const errorMessage = error.response?.data?.detail ||
                error.response?.data?.message ||
                error.message;
            this.logger.error(`Error en la comunicación con el microservicio Manim: ${errorMessage}`, error.stack, loggerContext);
            return { error: `Fallo en el microservicio Manim: ${errorMessage}` };
        }
    }
};
exports.ManimService = ManimService;
exports.ManimService = ManimService = ManimService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService,
        file_storage_service_1.FileStorageService])
], ManimService);
//# sourceMappingURL=manim.service.js.map