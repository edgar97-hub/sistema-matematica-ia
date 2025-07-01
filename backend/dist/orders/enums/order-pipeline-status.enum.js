"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderPipelineStatus = void 0;
var OrderPipelineStatus;
(function (OrderPipelineStatus) {
    OrderPipelineStatus["PENDING"] = "PENDING";
    OrderPipelineStatus["OCR_PENDING"] = "OCR_PENDING";
    OrderPipelineStatus["PROCESSING_OCR"] = "PROCESSING_OCR";
    OrderPipelineStatus["OCR_SUCCESSFUL_CREDIT_PENDING"] = "OCR_SUCCESSFUL_CREDIT_PENDING";
    OrderPipelineStatus["OCR_FAILED"] = "OCR_FAILED";
    OrderPipelineStatus["CREDIT_DEDUCTION_FAILED"] = "CREDIT_DEDUCTION_FAILED";
    OrderPipelineStatus["AI_SOLUTION_PENDING"] = "AI_SOLUTION_PENDING";
    OrderPipelineStatus["AI_SOLUTION_FAILED"] = "AI_SOLUTION_FAILED";
    OrderPipelineStatus["GENERATING_AUDIO_PENDING"] = "GENERATING_AUDIO_PENDING";
    OrderPipelineStatus["AUDIO_FAILED"] = "AUDIO_FAILED";
    OrderPipelineStatus["RENDERING_ANIMATION_PENDING"] = "RENDERING_ANIMATION_PENDING";
    OrderPipelineStatus["ANIMATION_FAILED"] = "ANIMATION_FAILED";
    OrderPipelineStatus["ASSEMBLING_FINAL_PENDING"] = "ASSEMBLING_FINAL_PENDING";
    OrderPipelineStatus["ASSEMBLY_FAILED"] = "ASSEMBLY_FAILED";
    OrderPipelineStatus["COMPLETED"] = "COMPLETED";
    OrderPipelineStatus["FAILED_GENERAL"] = "FAILED_GENERAL";
    OrderPipelineStatus["GENERATING_VIDEO_PENDING"] = "GENERATING_VIDEO_PENDING";
})(OrderPipelineStatus || (exports.OrderPipelineStatus = OrderPipelineStatus = {}));
//# sourceMappingURL=order-pipeline-status.enum.js.map