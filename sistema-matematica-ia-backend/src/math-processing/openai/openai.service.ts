import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
// import { FileStorageService } from '../../file-storage/file-storage/file-storage.service';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;

  constructor(
    private readonly configService: ConfigService,
    // private readonly fileStorageService: FileStorageService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async generateStepByStepSolution(
    mathText: string,
    promptBase: string,
    country?: string,
    stage?: string,
    subdivision?: string,
  ): Promise<object> {
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
        model: 'gpt-4o', // Replace with the actual model you want to use
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
    } catch (error) {
      console.error('Error generating solution with OpenAI:', error);
      throw new Error('Failed to generate step-by-step solution with OpenAI');
    }
  }

  async generateAudioNarration(
    textToNarrate: string,
    voice: string = 'alloy',
  ): Promise<{ audioUrl: string; s3Key: string }> {
    try {
      const speech = await this.openai.audio.speech.create({
        model: 'tts-1',
        voice: voice,
        input: textToNarrate,
      });

      const buffer = Buffer.from(await speech.arrayBuffer());
      return { audioUrl: 'url', s3Key: 'key' };

      // const { url, key } = await this.fileStorageService.uploadFile(
      //   {
      //     buffer: buffer,
      //     originalname: 'narration.mp3',
      //   } as any, // TODO: Fix type
      //   'audio/orders',
      // );

      // return { audioUrl: url, s3Key: key };
    } catch (error) {
      console.error('Error generating audio narration with OpenAI:', error);
      throw new Error('Failed to generate audio narration with OpenAI');
    }
  }
}
