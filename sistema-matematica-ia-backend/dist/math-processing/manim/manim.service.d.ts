import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
export declare class ManimService {
    private readonly httpService;
    private readonly configService;
    private readonly manimServiceUrl;
    private readonly logger;
    constructor(httpService: HttpService, configService: ConfigService);
    renderAnimationVideoViaMicroservice(orderId: string, solutionJson: any): Promise<{
        animationVideoPath?: string;
        error?: string;
    }>;
}
