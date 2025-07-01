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
exports.SimpleTexService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const crypto = require("crypto");
const FormDataNode = require("form-data");
let SimpleTexService = class SimpleTexService {
    configService;
    httpService;
    apiUrl;
    appId;
    appSecret;
    constructor(configService, httpService) {
        this.configService = configService;
        this.httpService = httpService;
        this.apiUrl =
            this.configService.get('SIMPLETEX_API_URL') ||
                'https://server.simpletex.net/api/latex_ocr';
        this.appId = this.configService.get('SIMPLETEX_APP_ID') || '';
        this.appSecret =
            this.configService.get('SIMPLETEX_APP_SECRET') || '';
        console.log('this.appId || !this.appSecret || !this.apiUrl', this.appId, this.appSecret, this.apiUrl);
        if (!this.appId || !this.appSecret || !this.apiUrl) {
            const errorMsg = 'SimpleTex API URL, App ID o App Secret no están configurados.';
            console.error(errorMsg, '', 'SimpleTexService');
            throw new common_1.InternalServerErrorException(errorMsg);
        }
    }
    generateRandomString(length) {
        const chars = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    generateSignature(dataParams, headerParams, appSecret) {
        const allParams = { ...dataParams, ...headerParams };
        const sortedKeys = Object.keys(allParams).sort();
        let preSignString = sortedKeys
            .map((key) => `${key}=${allParams[key]}`)
            .join('&');
        preSignString += `&secret=${appSecret}`;
        console.debug(`SimpleTex Pre-Sign String: ${preSignString}`, 'SimpleTexService');
        const md5Hash = crypto
            .createHash('md5')
            .update(preSignString, 'utf-8')
            .digest('hex');
        console.debug(`SimpleTex Generated MD5 Sign: ${md5Hash}`, 'SimpleTexService');
        return md5Hash;
    }
    async extractMathFromImageBuffer(imageBuffer, originalFilename = 'image.png') {
        if (!this.appId || !this.appSecret) {
            throw new common_1.InternalServerErrorException('SimpleTex OCR no está configurado (credenciales).');
        }
        console.log(`Enviando imagen (${originalFilename}) a SimpleTex OCR...`, 'SimpleTexService');
        const dataParams = {};
        const commonHeaderParams = {
            timestamp: Math.floor(Date.now() / 1000).toString(),
            'random-str': this.generateRandomString(16),
            'app-id': this.appId,
        };
        const sign = this.generateSignature(dataParams, commonHeaderParams, this.appSecret);
        const headers = {
            ...commonHeaderParams,
            sign: sign,
        };
        const formData = new FormDataNode();
        formData.append('file', imageBuffer, { filename: originalFilename });
        Object.keys(dataParams).forEach((key) => {
            formData.append(key, dataParams[key].toString());
        });
        try {
            console.debug(`SimpleTex Request Headers: ${JSON.stringify(headers)}`, 'SimpleTexService');
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(this.apiUrl, formData, {
                headers: {
                    ...headers,
                    ...formData.getHeaders(),
                },
            }));
            console.log(`Respuesta de SimpleTex recibida. Request ID: ${response.data?.request_id}, Status: ${response.data?.status}`, 'SimpleTexService');
            if (!response.data.status) {
                const errorMessage = response.data.err_msg ||
                    JSON.stringify(response.data.res) ||
                    'Error desconocido de SimpleTex API';
                console.error(`Error de SimpleTex API (status false): ${errorMessage}`, JSON.stringify(response.data), 'SimpleTexService');
                throw new common_1.HttpException(`Error de OCR (SimpleTex): ${errorMessage}`, common_1.HttpStatus.BAD_REQUEST);
            }
            if (response.data.res?.latex === '[EMPTY]' ||
                response.data.res?.latex === '[DOCIMG]') {
                console.warn(`SimpleTex devolvió: ${response.data.res.latex} para la imagen.`, 'SimpleTexService');
                throw new common_1.HttpException(`OCR (SimpleTex) devolvió: ${response.data.res.latex}. La imagen podría estar vacía o no ser una fórmula.`, common_1.HttpStatus.EXPECTATION_FAILED);
            }
            return response.data;
        }
        catch (error) {
            console.error(`Fallo en la solicitud a SimpleTex API: ${error.response?.data ? JSON.stringify(error.response.data) : error.message}`, error.stack, 'SimpleTexService');
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.InternalServerErrorException(`Fallo en la comunicación con el servicio de OCR (SimpleTex).`);
        }
    }
};
exports.SimpleTexService = SimpleTexService;
exports.SimpleTexService = SimpleTexService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        axios_1.HttpService])
], SimpleTexService);
//# sourceMappingURL=simpletex.service.js.map