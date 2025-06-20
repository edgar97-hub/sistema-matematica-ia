export declare enum OrderPipelineStatus {
    PENDING = "PENDING",
    PROCESSING_OCR = "PROCESSING_OCR",
    OCR_FAILED = "OCR_FAILED",
    AI_SOLUTION_PENDING = "AI_SOLUTION_PENDING",
    AI_SOLUTION_GENERATED = "AI_SOLUTION_GENERATED",
    AI_SOLUTION_FAILED = "AI_SOLUTION_FAILED",
    AUDIO_NARRATION_PENDING = "AUDIO_NARRATION_PENDING",
    AUDIO_NARRATION_GENERATED = "AUDIO_NARRATION_GENERATED",
    AUDIO_NARRATION_FAILED = "AUDIO_NARRATION_FAILED",
    VIDEO_GENERATION_PENDING = "VIDEO_GENERATION_PENDING",
    VIDEO_GENERATION_COMPLETED = "VIDEO_GENERATION_COMPLETED",
    VIDEO_GENERATION_FAILED = "VIDEO_GENERATION_FAILED",
    COMPLETED = "COMPLETED",
    FAILED_GENERAL = "FAILED_GENERAL"
}
