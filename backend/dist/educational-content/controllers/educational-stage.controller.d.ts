import { EducationalStageService } from '../services/educational-stage.service';
import { CreateEducationalStageDto, UpdateEducationalStageDto } from '../dto/educational-stage.dto';
export declare class EducationalStageController {
    private readonly educationalStageService;
    constructor(educationalStageService: EducationalStageService);
    findAll(page?: number, limit?: number, filter?: string, sort?: string): Promise<{
        data: import("../entities/educational-stage.entity").EducationalStageEntity[];
        total: number;
    }>;
    findActiveByCountry(countryId: string): Promise<import("../entities/educational-stage.entity").EducationalStageEntity[]>;
    findActiveStagesByCountryName(countryName: string): Promise<import("../entities/educational-stage.entity").EducationalStageEntity[]>;
    findOne(id: string): Promise<import("../entities/educational-stage.entity").EducationalStageEntity>;
    create(createEducationalStageDto: CreateEducationalStageDto): Promise<import("../entities/educational-stage.entity").EducationalStageEntity>;
    update(id: string, updateEducationalStageDto: UpdateEducationalStageDto): Promise<import("../entities/educational-stage.entity").EducationalStageEntity>;
    remove(id: string): Promise<void>;
}
