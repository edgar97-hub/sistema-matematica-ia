import { Module } from '@nestjs/common';
import { FileStorageService } from './file-storage/file-storage.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule, // Importar ConfigModule si FileStorageService lo necesita
  ],
  providers: [FileStorageService],
  exports: [FileStorageService],
})
export class FileStorageModule {}
