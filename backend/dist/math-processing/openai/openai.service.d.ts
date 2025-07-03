import { ConfigService } from '@nestjs/config';
export declare class OpenaiService {
    private readonly configService;
    private openai;
    constructor(configService: ConfigService);
    generateStepByStepSolution(extractedMathLatex: string, promptBase: string, country?: string, stage?: string, subdivision?: string): Promise<object>;
}
