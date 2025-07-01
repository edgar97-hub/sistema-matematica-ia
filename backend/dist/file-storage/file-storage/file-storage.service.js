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
const fs = require("fs");
const path_1 = require("path");
const util_1 = require("util");
const readFileAsync = (0, util_1.promisify)(fs.readFile);
const statAsync = (0, util_1.promisify)(fs.stat);
let FileStorageService = class FileStorageService {
    configService;
    uploadsBaseDir;
    constructor(configService) {
        this.configService = configService;
        this.uploadsBaseDir = (0, path_1.join)(process.cwd(), 'uploads');
        console.log(`Uploads base directory: ${this.uploadsBaseDir}`, 'FileStorageService');
    }
    async uploadFile(file, pathPrefix) {
        const originalName = file.originalname;
        const extension = (0, path_1.parse)(originalName).ext;
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const filename = `${uniqueSuffix}${extension}`;
        const directoryPath = (0, path_1.join)(this.uploadsBaseDir, pathPrefix);
        const filePath = (0, path_1.join)(directoryPath, filename);
        const relativeUrlPath = `/${pathPrefix}/${filename}`;
        try {
            await fs.promises.mkdir(directoryPath, { recursive: true });
            await fs.promises.writeFile(filePath, file.buffer);
            console.log(`Archivo guardado localmente: ${filePath}`, 'FileStorageService');
            return {
                url: relativeUrlPath,
                filePath: filePath,
                originalName,
                size: file.size,
            };
        }
        catch (error) {
            console.error(`Error al guardar archivo localmente ${filePath}: ${error.message}`, error.stack, 'FileStorageService');
            throw new common_1.InternalServerErrorException('No se pudo guardar el archivo.');
        }
    }
    async uploadBuffer(buffer, pathPrefix, filenameWithExtension) {
        const directoryPath = (0, path_1.join)(this.uploadsBaseDir, pathPrefix);
        const filePath = (0, path_1.join)(directoryPath, filenameWithExtension);
        const relativeUrlPath = `/${pathPrefix}/${filenameWithExtension}`;
        try {
            await fs.promises.mkdir(directoryPath, { recursive: true });
            await fs.promises.writeFile(filePath, buffer);
            console.log(`Buffer guardado localmente: ${filePath}`, 'FileStorageService_UploadBuffer');
            return {
                url: relativeUrlPath,
                filePath: filePath,
                size: buffer.length,
            };
        }
        catch (error) {
            console.error(`Error al guardar buffer localmente ${filePath}: ${error.message}`, error.stack, 'FileStorageService_UploadBuffer');
            throw new common_1.InternalServerErrorException('No se pudo guardar el archivo de audio generado.');
        }
    }
    async readFileToBuffer(relativePathFromUploads) {
        const absolutePath = (0, path_1.join)(this.uploadsBaseDir, relativePathFromUploads);
        console.log(`Intentando leer archivo para buffer: ${absolutePath}`, 'FileStorageService');
        try {
            await statAsync(absolutePath);
            const buffer = await readFileAsync(absolutePath);
            return buffer;
        }
        catch (error) {
            console.error(`Error al leer archivo local ${absolutePath}: ${error.message}`, error.stack, 'FileStorageService');
            if (error.code === 'ENOENT') {
                throw new common_1.NotFoundException(`Archivo no encontrado en la ruta: ${relativePathFromUploads}`);
            }
            throw new common_1.InternalServerErrorException('No se pudo leer el archivo de imagen para OCR.');
        }
    }
};
exports.FileStorageService = FileStorageService;
exports.FileStorageService = FileStorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FileStorageService);
//# sourceMappingURL=file-storage.service.js.map