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
exports.FileStorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const uuid_1 = require("uuid");
const fs_1 = require("fs");
const path_1 = require("path");
let FileStorageService = class FileStorageService {
    configService;
    uploadDir;
    constructor(configService) {
        this.configService = configService;
        this.uploadDir = (0, path_1.join)(__dirname, '..', '..', '..', 'uploads');
        this.ensureDirectoryExists(this.uploadDir);
    }
    async ensureDirectoryExists(directory) {
        try {
            await fs_1.promises.mkdir(directory, { recursive: true });
        }
        catch (error) {
            if (error.code !== 'EEXIST') {
                throw error;
            }
        }
    }
    async uploadFile(file, pathPrefix) {
        const filename = `${(0, uuid_1.v4)()}-${file.originalname}`;
        const filePath = (0, path_1.join)(this.uploadDir, pathPrefix, filename);
        const key = `${pathPrefix}/${filename}`;
        const url = `/uploads/${key}`;
        try {
            await this.ensureDirectoryExists((0, path_1.join)(this.uploadDir, pathPrefix));
            await fs_1.promises.writeFile(filePath, file.buffer);
            return { url, key };
        }
        catch (error) {
            console.error('Error uploading file:', error);
            throw new Error('Failed to upload file');
        }
    }
};
exports.FileStorageService = FileStorageService;
exports.FileStorageService = FileStorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FileStorageService);
//# sourceMappingURL=file-storage.service.js.map