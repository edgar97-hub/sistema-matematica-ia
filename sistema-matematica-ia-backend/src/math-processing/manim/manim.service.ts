import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class ManimService {
  private readonly manimServiceUrl: string;
  private readonly logger = new Logger(ManimService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.manimServiceUrl =
      this.configService.get<string>('MANIM_MICROSERVICE_URL') ||
      'http://localhost:8000';
  }

  async renderAnimationVideoViaMicroservice(
    orderId: string,
    solutionJson: any,
  ): Promise<{ animationVideoPath?: string; error?: string }> {
    this.logger.log(
      `ManimService: Sending data for order ${orderId} to microservice (SIMULATED).`,
    );
    console.log('Solution JSON (simulated sent):', solutionJson);

    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Simulate a successful response
    const animationVideoPath = `uploads/temp_animations/${orderId}_manim_animation.mp4`;
    this.logger.log(
      `ManimService: Successfully simulated video generation for order ${orderId}. Video path: ${animationVideoPath}`,
    );
    return { animationVideoPath: animationVideoPath };

    // Simulate an error response
    // return { error: 'Simulated Manim failure' };
  }
}
