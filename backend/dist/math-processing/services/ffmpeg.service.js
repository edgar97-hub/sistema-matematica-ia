"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FFmpegService = void 0;
const common_1 = require("@nestjs/common");
const child_process_1 = require("child_process");
const fs = require("fs-extra");
const path_1 = require("path");
let FFmpegService = class FFmpegService {
    async concatenateAndCombine(videoPaths, audioPaths, orderId) {
        return new Promise(async (resolve, reject) => {
            const tempDir = (0, path_1.join)(process.cwd(), 'temp', orderId);
            await fs.ensureDir(tempDir);
            const videoListPath = (0, path_1.join)(tempDir, 'videos.txt');
            const audioListPath = (0, path_1.join)(tempDir, 'audios.txt');
            const videoListContent = videoPaths
                .map((p) => `file '${p.replace(/'/g, "'\\''")}'`)
                .join('\n');
            const audioListContent = audioPaths
                .map((p) => `file '${p.replace(/'/g, "'\\''")}'`)
                .join('\n');
            await fs.writeFile(videoListPath, videoListContent);
            await fs.writeFile(audioListPath, audioListContent);
            const outputDir = (0, path_1.join)(process.cwd(), 'uploads', 'final_videos');
            await fs.ensureDir(outputDir);
            const outputFileName = `order_${orderId}_final.mp4`;
            const outputFilePath = (0, path_1.join)(outputDir, outputFileName);
            const publicUrl = `/final_videos/${outputFileName}`;
            const ffmpegArgs = [
                '-y',
                '-f',
                'concat',
                '-safe',
                '0',
                '-i',
                videoListPath,
                '-f',
                'concat',
                '-safe',
                '0',
                '-i',
                audioListPath,
                '-c:v',
                'copy',
                '-c:a',
                'aac',
                '-shortest',
                outputFilePath,
            ];
            console.log(`Ejecutando FFmpeg para orden ${orderId}`, 'FFmpegService');
            const ffmpegProcess = (0, child_process_1.spawn)('ffmpeg', ffmpegArgs);
            let stderr = '';
            ffmpegProcess.stderr.on('data', (data) => {
                stderr += data.toString();
            });
            ffmpegProcess.on('close', async (code) => {
                await fs.remove(tempDir);
                if (code === 0) {
                    console.log(`FFmpeg ensambló exitosamente: ${outputFilePath}`, 'FFmpegService');
                    resolve({
                        finalVideoLocalPath: outputFilePath,
                        finalVideoPublicUrl: publicUrl,
                    });
                }
                else {
                    console.error(`FFmpeg falló con código ${code}`, stderr, 'FFmpegService');
                    reject(new Error(`FFmpeg falló con código de salida ${code}. Stderr: ${stderr}`));
                }
            });
            ffmpegProcess.on('error', (err) => {
                console.error('Error al iniciar el proceso FFmpeg', err.stack, 'FFmpegService');
                reject(err);
            });
        });
    }
};
exports.FFmpegService = FFmpegService;
exports.FFmpegService = FFmpegService = __decorate([
    (0, common_1.Injectable)()
], FFmpegService);
//# sourceMappingURL=ffmpeg.service.js.map