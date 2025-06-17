import { BaseEntity } from '../../common/entities/base.entity';
import { EducationalStageEntity } from './educational-stage.entity';
export declare class EducationalSubdivisionEntity extends BaseEntity {
    name: string;
    description: string;
    display_order: number;
    is_active: boolean;
    educational_stage_id: number;
    educational_stage: EducationalStageEntity;
}
