import { Repository } from 'typeorm';
import { EducationalStageEntity } from '../entities/educational-stage.entity';
import { CreateEducationalStageDto, UpdateEducationalStageDto } from '../dto/educational-stage.dto';
export declare class EducationalStageService {
    private educationalStageRepository;
    constructor(educationalStageRepository: Repository<EducationalStageEntity>);
    findAll(page?: number, limit?: number, filter?: string, sort?: string): Promise<{
        items: EducationalStageEntity[];
        total: number;
    }>;
    findOne(id: number): Promise<EducationalStageEntity>;
    create(createEducationalStageDto: CreateEducationalStageDto): Promise<EducationalStageEntity>;
    update(id: number, updateEducationalStageDto: UpdateEducationalStageDto): Promise<EducationalStageEntity>;
    remove(id: number): Promise<void>;
    findActiveStagesByCountry(countryId: number): Promise<EducationalStageEntity[]>;
}
