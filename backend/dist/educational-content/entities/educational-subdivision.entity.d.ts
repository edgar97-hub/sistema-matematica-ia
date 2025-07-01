import { BaseEntity } from '../../common/entities/base.entity';
import { EducationalStageEntity } from './educational-stage.entity';
export declare class EducationalSubdivisionEntity extends BaseEntity {
    name: string;
    description: string;
    isActive: boolean;
    educationalStageId: number;
    educationalStage: EducationalStageEntity;
}
