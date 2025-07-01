import { BaseEntity } from '../../common/entities/base.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { OrderPipelineStatus } from '../enums/order-pipeline-status.enum';
import { CreditTransactionEntity } from 'src/credit-system/entities/credit-transaction.entity';
export declare class OrderEntity extends BaseEntity {
    creditTransactionId: number;
    creditTransaction: CreditTransactionEntity;
    userId: number;
    user: UserEntity;
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
