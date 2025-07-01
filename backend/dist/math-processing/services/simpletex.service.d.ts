import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
export interface SimpleTexLatexResponse {
    latex: string;
    conf?: number;
}
export interface SimpleTexApiResult {
    latex?: string;
    conf?: number;
    [key: string]: any;
}
export interface SimpleTexFullResponse {
    status: boolean;
    res: SimpleTexApiResult | null;
    request_id: string;
    err_msg?: string;
}
export declare class SimpleTexService {
    private readonly configService;
    private readonly httpService;
    private readonly apiUrl;
    private readonly appId;
    private readonly appSecret;
    constructor(configService: ConfigService, httpService: HttpService);
    private generateRandomString;
    private generateSignature;
    extractMathFromImageBuffer(imageBuffer: Buffer, originalFilename?: string): Promise<SimpleTexFullResponse>;
}
