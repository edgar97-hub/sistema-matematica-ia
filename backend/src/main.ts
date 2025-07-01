import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { CORS } from './constants';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(
    '/api/credit-transactions/stripe-webhook', 
    bodyParser.raw({ type: 'application/json' }), 
  );
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  app.use(morgan('dev'));
  app.enableCors(CORS);
  app.setGlobalPrefix('api');
  console.log('running on port ', process.env.PORT);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
