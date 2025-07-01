export declare class FFmpegService {
    concatenateAndCombine(videoPaths: string[], audioPaths: string[], orderId: string): Promise<{
        finalVideoLocalPath: string;
        finalVideoPublicUrl: string;
    }>;
}
