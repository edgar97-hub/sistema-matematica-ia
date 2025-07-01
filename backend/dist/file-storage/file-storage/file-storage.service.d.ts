import { ConfigService } from '@nestjs/config';
export declare class FileStorageService {
    private readonly configService;
    private readonly uploadsBaseDir;
    constructor(configService: ConfigService);
    uploadFile(file: Express.Multer.File, pathPrefix: string): Promise<{
        url: string;
        filePath: string;
        originalName: string;
        size: number;
    }>;
    uploadBuffer(buffer: Buffer, pathPrefix: string, filenameWithExtension: string): Promise<{
        url: string;
        filePath: string;
        size: number;
    }>;
    readFileToBuffer(relativePathFromUploads: string): Promise<Buffer>;
}
