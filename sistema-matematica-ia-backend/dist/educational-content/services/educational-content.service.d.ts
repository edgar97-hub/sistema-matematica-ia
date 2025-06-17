import { Repository } from 'typeorm';
import { CountryEntity } from '../entities/country.entity';
import { EducationalStageEntity } from '../entities/educational-stage.entity';
import { EducationalSubdivisionEntity } from '../entities/educational-subdivision.entity';
export declare class EducationalContentService {
    private countryRepository;
    private stageRepository;
    private subdivisionRepository;
    constructor(countryRepository: Repository<CountryEntity>, stageRepository: Repository<EducationalStageEntity>, subdivisionRepository: Repository<EducationalSubdivisionEntity>);
    createCountry(countryData: Partial<CountryEntity>): Promise<CountryEntity>;
    getAllCountries(): Promise<CountryEntity[]>;
    getCountryById(id: number): Promise<CountryEntity>;
    updateCountry(id: number, countryData: Partial<CountryEntity>): Promise<CountryEntity>;
    deleteCountry(id: number): Promise<void>;
    createEducationalStage(stageData: Partial<EducationalStageEntity>): Promise<EducationalStageEntity>;
    getAllEducationalStages(countryId: number): Promise<EducationalStageEntity[]>;
    getEducationalStageById(id: number): Promise<EducationalStageEntity>;
    updateEducationalStage(id: number, stageData: Partial<EducationalStageEntity>): Promise<EducationalStageEntity>;
    deleteEducationalStage(id: number): Promise<void>;
    createEducationalSubdivision(subdivisionData: Partial<EducationalSubdivisionEntity>): Promise<EducationalSubdivisionEntity>;
    getAllEducationalSubdivisions(stageId: number): Promise<EducationalSubdivisionEntity[]>;
    getEducationalSubdivisionById(id: number): Promise<EducationalSubdivisionEntity>;
    updateEducationalSubdivision(id: number, subdivisionData: Partial<EducationalSubdivisionEntity>): Promise<EducationalSubdivisionEntity>;
    deleteEducationalSubdivision(id: number): Promise<void>;
    getCompleteStructure(): Promise<CountryEntity[]>;
}
