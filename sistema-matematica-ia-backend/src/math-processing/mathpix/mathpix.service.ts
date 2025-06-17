import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { map, catchError } from 'rxjs/operators';
import { of, throwError } from 'rxjs';

@Injectable()
export class MathpixService {
  private readonly appId: string;
  private readonly appKey: string;
  private readonly apiUrl: string = 'https://api.mathpix.com/v3/text';

  constructor(
    @Inject(HttpService)
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.appId = this.configService.get<string>('MATHPIX_APP_ID') || '';
    this.appKey = this.configService.get<string>('MATHPIX_APP_KEY') || '';
  }

  async extractTextFromImageUrl(
    imageUrl: string,
  ): Promise<string | { error?: string; text?: string; latex_styled?: string; [key: string]: any }> {
    const headers = {
      'content-type': 'application/json',
      'app_id': this.appId,
      'app_key': this.appKey,
    };

    const data = {
      src: imageUrl,
      formats: ['text', 'latex_styled'],
    };

    try {
      const response = await this.httpService.post(this.apiUrl, data, { headers })
        .pipe(
          map((res: AxiosResponse) => {
            if (res.data.error) {
              return { error: res.data.error };
            }
            return res.data;
          }),
          catchError(err => {
            console.error('Mathpix API error:', err);
            return throwError('Failed to extract text from image using Mathpix API');
          })
        ).toPromise();
      return response;
    } catch (error) {
      console.error('Error in MathpixService:', error);
      return { error: error.message };
    }
  }
}
