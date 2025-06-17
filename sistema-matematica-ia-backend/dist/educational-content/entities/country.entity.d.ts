import { BaseEntity } from '../../common/entities/base.entity';
import { EducationalStageEntity } from './educational-stage.entity';
export declare class CountryEntity extends BaseEntity {
    name: string;
    code: string;
    flag_url: string;
    is_active: boolean;
    display_order: number;
    educational_stages: EducationalStageEntity[];
}
