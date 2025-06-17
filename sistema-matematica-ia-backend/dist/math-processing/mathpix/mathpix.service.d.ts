import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
export declare class MathpixService {
    private readonly httpService;
    private readonly configService;
    private readonly appId;
    private readonly appKey;
    private readonly apiUrl;
    constructor(httpService: HttpService, configService: ConfigService);
    extractTextFromImageUrl(imageUrl: string): Promise<string | {
        error?: string;
        text?: string;
        latex_styled?: string;
        [key: string]: any;
    }>;
}
