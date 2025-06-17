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
exports.OpenaiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const openai_1 = require("openai");
let OpenaiService = class OpenaiService {
    configService;
    openai;
    constructor(configService) {
        this.configService = configService;
        this.openai = new openai_1.default({
            apiKey: this.configService.get('OPENAI_API_KEY'),
        });
    }
    async generateStepByStepSolution(mathText, promptBase, country, stage, subdivision) {
        try {
            let prompt = promptBase + `\n\nMath Problem: ${mathText}`;
            if (country) {
                prompt += `\nCountry: ${country}`;
            }
            if (stage) {
                prompt += `\nEducational Stage: ${stage}`;
            }
            if (subdivision) {
                prompt += `\nSubdivision: ${subdivision}`;
            }
            prompt += `\n\nProvide a detailed, step-by-step solution to the math problem. The response should be in a structured JSON format: { steps: [{ description: string, formula?: string, explanation?: string }], finalAnswer: string, summary?: string }`;
            const completion = await this.openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 1024,
                n: 1,
                stop: null,
                temperature: 0.7,
            });
            const content = completion.choices[0].message.content;
            if (!content) {
                throw new Error('OpenAI returned an empty response');
            }
            const solution = JSON.parse(content);
            return solution;
        }
        catch (error) {
            console.error('Error generating solution with OpenAI:', error);
            throw new Error('Failed to generate step-by-step solution with OpenAI');
        }
    }
    async generateAudioNarration(textToNarrate, voice = 'alloy') {
        try {
            const speech = await this.openai.audio.speech.create({
                model: 'tts-1',
                voice: voice,
                input: textToNarrate,
            });
            const buffer = Buffer.from(await speech.arrayBuffer());
            return { audioUrl: 'url', s3Key: 'key' };
        }
        catch (error) {
            console.error('Error generating audio narration with OpenAI:', error);
            throw new Error('Failed to generate audio narration with OpenAI');
        }
    }
};
exports.OpenaiService = OpenaiService;
exports.OpenaiService = OpenaiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], OpenaiService);
//# sourceMappingURL=openai.service.js.map