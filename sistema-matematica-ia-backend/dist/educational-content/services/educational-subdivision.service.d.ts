import { Repository } from 'typeorm';
import { EducationalSubdivisionEntity } from '../entities/educational-subdivision.entity';
import { CreateEducationalSubdivisionDto, UpdateEducationalSubdivisionDto } from '../dto/educational-subdivision.dto';
export declare class EducationalSubdivisionService {
    private educationalSubdivisionRepository;
    constructor(educationalSubdivisionRepository: Repository<EducationalSubdivisionEntity>);
    findAll(page?: number, limit?: number, filter?: string, sort?: string): Promise<{
        items: EducationalSubdivisionEntity[];
        total: number;
    }>;
    findOne(id: number): Promise<EducationalSubdivisionEntity>;
    create(createEducationalSubdivisionDto: CreateEducationalSubdivisionDto): Promise<EducationalSubdivisionEntity>;
    update(id: number, updateEducationalSubdivisionDto: UpdateEducationalSubdivisionDto): Promise<EducationalSubdivisionEntity>;
    remove(id: number): Promise<void>;
    findActiveSubdivisionsByStage(stageId: number): Promise<EducationalSubdivisionEntity[]>;
}
