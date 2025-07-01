import { ConfigService } from '@nestjs/config';
type OpenAiTtsVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
type OpenAiTtsModel = 'tts-1' | 'tts-1-hd';
type OpenAiTtsResponseFormat = 'mp3' | 'opus' | 'aac' | 'flac' | 'wav' | 'pcm';
export declare class OpenaiService {
    private readonly configService;
    private openai;
    constructor(configService: ConfigService);
    generateStepByStepSolution(extractedMathLatex: string, promptBase: string, country?: string, stage?: string, subdivision?: string): Promise<object>;
    generateAudioNarrationBuffer(textToNarrate: string, voice?: OpenAiTtsVoice, model?: OpenAiTtsModel, format?: OpenAiTtsResponseFormat): Promise<{
        audioBuffer: Buffer;
        fileExtension: string;
    }>;
}
export {};
