import { ConfigService } from '@nestjs/config';
export declare class OpenaiService {
    private readonly configService;
    private openai;
    constructor(configService: ConfigService);
    generateStepByStepSolution(mathText: string, promptBase: string, country?: string, stage?: string, subdivision?: string): Promise<object>;
    generateAudioNarration(textToNarrate: string, voice?: string): Promise<{
        audioUrl: string;
        s3Key: string;
    }>;
}
