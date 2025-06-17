import { BaseEntity } from '../../common/entities/base.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { OrderPipelineStatus } from '../enums/order-pipeline-status.enum';
export declare class OrderEntity extends BaseEntity {
    user: UserEntity;
    userId: string;
    countrySelected: string;
    educationalStageSelected: string;
    subdivisionGradeSelected: string;
    topic: string;
    originalImageUrl: string;
    mathpixExtraction: string;
    openAiSolution: any;
    audioNarrationUrl: string;
    finalVideoUrl: string;
    status: OrderPipelineStatus;
    errorMessage: string;
    creditsConsumed: number;
    completedAt: Date;
}
