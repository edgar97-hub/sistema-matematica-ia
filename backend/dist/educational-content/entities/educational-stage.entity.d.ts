import { BaseEntity } from '../../common/entities/base.entity';
import { CountryEntity } from './country.entity';
import { EducationalSubdivisionEntity } from './educational-subdivision.entity';
export declare class EducationalStageEntity extends BaseEntity {
    name: string;
    description: string;
    isActive: boolean;
    countryId: number;
    country: CountryEntity;
    educational_subdivisions: EducationalSubdivisionEntity[];
}
