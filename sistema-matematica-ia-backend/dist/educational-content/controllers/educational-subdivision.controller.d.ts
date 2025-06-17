import { EducationalSubdivisionService } from '../services/educational-subdivision.service';
import { CreateEducationalSubdivisionDto, UpdateEducationalSubdivisionDto } from '../dto/educational-subdivision.dto';
export declare class EducationalSubdivisionController {
    private readonly educationalSubdivisionService;
    constructor(educationalSubdivisionService: EducationalSubdivisionService);
    create(createEducationalSubdivisionDto: CreateEducationalSubdivisionDto): Promise<import("../entities/educational-subdivision.entity").EducationalSubdivisionEntity>;
    findAll(page?: number, limit?: number, filter?: string, sort?: string): Promise<{
        items: import("../entities/educational-subdivision.entity").EducationalSubdivisionEntity[];
        total: number;
    }>;
    findActiveByStage(stageId: string): Promise<import("../entities/educational-subdivision.entity").EducationalSubdivisionEntity[]>;
    findOne(id: string): Promise<import("../entities/educational-subdivision.entity").EducationalSubdivisionEntity>;
    update(id: string, updateEducationalSubdivisionDto: UpdateEducationalSubdivisionDto): Promise<import("../entities/educational-subdivision.entity").EducationalSubdivisionEntity>;
    remove(id: string): Promise<void>;
}
