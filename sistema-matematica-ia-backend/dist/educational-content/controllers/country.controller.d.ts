import { CountryService } from '../services/country.service';
import { CreateCountryDto, UpdateCountryDto } from '../dto/country.dto';
import { EducationalContentService } from '../services/educational-content.service';
export declare class CountryController {
    private readonly countryService;
    private readonly educationalContentService;
    constructor(countryService: CountryService, educationalContentService: EducationalContentService);
    create(createCountryDto: CreateCountryDto): Promise<import("../entities/country.entity").CountryEntity>;
    findAll(page?: number, limit?: number, filter?: string, sort?: string): Promise<{
        items: import("../entities/country.entity").CountryEntity[];
        total: number;
    }>;
    findActiveForPwa(): Promise<import("../entities/country.entity").CountryEntity[]>;
    getCompleteStructure(): Promise<import("../entities/country.entity").CountryEntity[]>;
    findOne(id: string): Promise<import("../entities/country.entity").CountryEntity>;
    update(id: string, updateCountryDto: UpdateCountryDto): Promise<import("../entities/country.entity").CountryEntity>;
    remove(id: string): Promise<void>;
}
