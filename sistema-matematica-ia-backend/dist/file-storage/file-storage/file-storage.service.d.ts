import { ConfigService } from '@nestjs/config';
export declare class FileStorageService {
    private readonly configService;
    private readonly uploadDir;
    constructor(configService: ConfigService);
    private ensureDirectoryExists;
    uploadFile(file: any, pathPrefix: string): Promise<{
        url: string;
        key: string;
    }>;
}
