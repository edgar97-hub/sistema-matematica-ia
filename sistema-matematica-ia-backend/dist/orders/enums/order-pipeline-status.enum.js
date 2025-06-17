"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderPipelineStatus = void 0;
var OrderPipelineStatus;
(function (OrderPipelineStatus) {
    OrderPipelineStatus["PENDING"] = "PENDING";
    OrderPipelineStatus["PROCESSING_OCR"] = "PROCESSING_OCR";
    OrderPipelineStatus["OCR_FAILED"] = "OCR_FAILED";
    OrderPipelineStatus["AI_SOLUTION_PENDING"] = "AI_SOLUTION_PENDING";
    OrderPipelineStatus["AI_SOLUTION_GENERATED"] = "AI_SOLUTION_GENERATED";
    OrderPipelineStatus["AI_SOLUTION_FAILED"] = "AI_SOLUTION_FAILED";
    OrderPipelineStatus["AUDIO_NARRATION_PENDING"] = "AUDIO_NARRATION_PENDING";
    OrderPipelineStatus["AUDIO_NARRATION_GENERATED"] = "AUDIO_NARRATION_GENERATED";
    OrderPipelineStatus["AUDIO_NARRATION_FAILED"] = "AUDIO_NARRATION_FAILED";
    OrderPipelineStatus["VIDEO_GENERATION_PENDING"] = "VIDEO_GENERATION_PENDING";
    OrderPipelineStatus["VIDEO_GENERATION_COMPLETED"] = "VIDEO_GENERATION_COMPLETED";
    OrderPipelineStatus["VIDEO_GENERATION_FAILED"] = "VIDEO_GENERATION_FAILED";
    OrderPipelineStatus["COMPLETED"] = "COMPLETED";
    OrderPipelineStatus["FAILED_GENERAL"] = "FAILED_GENERAL";
})(OrderPipelineStatus || (exports.OrderPipelineStatus = OrderPipelineStatus = {}));
//# sourceMappingURL=order-pipeline-status.enum.js.map