import { BaseEntity } from '../../common/entities/base.entity';
import { CountryEntity } from './country.entity';
import { EducationalSubdivisionEntity } from './educational-subdivision.entity';
export declare class EducationalStageEntity extends BaseEntity {
    name: string;
    description: string;
    min_age: number;
    max_age: number;
    display_order: number;
    is_active: boolean;
    country_id: number;
    country: CountryEntity;
    educational_subdivisions: EducationalSubdivisionEntity[];
}
