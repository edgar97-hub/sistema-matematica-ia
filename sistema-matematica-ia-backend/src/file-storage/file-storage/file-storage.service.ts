import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class FileStorageService {
  private readonly uploadDir: string;

  constructor(private readonly configService: ConfigService) {
    this.uploadDir = join(__dirname, '..', '..', '..', 'uploads');
    this.ensureDirectoryExists(this.uploadDir);
  }

  private async ensureDirectoryExists(directory: string): Promise<void> {
    try {
      await fs.mkdir(directory, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }
  }

  async uploadFile(
    file: any,
    pathPrefix: string,
  ): Promise<{ url: string; key: string }> {
    const filename = `${uuid()}-${file.originalname}`;
    const filePath = join(this.uploadDir, pathPrefix, filename);
    const key = `${pathPrefix}/${filename}`;
    const url = `/uploads/${key}`;

    try {
      await this.ensureDirectoryExists(join(this.uploadDir, pathPrefix));
      await fs.writeFile(filePath, file.buffer);

      return { url, key };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  }
}
