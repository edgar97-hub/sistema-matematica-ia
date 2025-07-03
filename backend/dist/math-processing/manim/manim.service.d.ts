import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { FileStorageService } from 'src/file-storage/file-storage/file-storage.service';
interface FullVoiceoverPayload {
    orderId: string;
    solutionJson: object;
}
export declare class ManimService {
    private readonly httpService;
    private readonly configService;
    private readonly fileStorageService;
    private readonly manimServiceUrl;
    private readonly openaiApiKey;
    private readonly logger;
    constructor(httpService: HttpService, configService: ConfigService, fileStorageService: FileStorageService);
    renderFullVoiceoverVideo(payload: FullVoiceoverPayload): Promise<{
        localPath?: string;
        error?: string;
    }>;
}
export {};
