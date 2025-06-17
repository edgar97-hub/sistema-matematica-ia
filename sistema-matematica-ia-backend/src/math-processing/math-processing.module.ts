import { Module } from '@nestjs/common';
import { MathpixService } from './mathpix/mathpix.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { OpenaiService } from './openai/openai.service';
import { FileStorageModule } from '../file-storage/file-storage.module';
import { ManimService } from './manim/manim.service';

@Module({
  imports: [HttpModule, ConfigModule, FileStorageModule],
  providers: [MathpixService, OpenaiService, ManimService],
  exports: [MathpixService, OpenaiService, ManimService],
})
export class MathProcessingModule {}
