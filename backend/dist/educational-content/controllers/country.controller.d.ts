import { CountryService } from '../services/country.service';
import { CreateCountryDto, UpdateCountryDto } from '../dto/country.dto';
import { FindAllCountriesQueryDto } from '../entities/country.entity';
export declare class CountryController {
    private readonly countryService;
    constructor(countryService: CountryService);
    create(createCountryDto: CreateCountryDto): Promise<import("../entities/country.entity").CountryEntity>;
    findAll(queryDto: FindAllCountriesQueryDto): Promise<{
        data: import("../entities/country.entity").CountryEntity[];
        total: number;
    }>;
    findActiveForPwa(): Promise<import("../entities/country.entity").CountryEntity[]>;
    getCompleteStructure(): void;
    findOne(id: string): Promise<import("../entities/country.entity").CountryEntity>;
    update(id: string, updateCountryDto: UpdateCountryDto): Promise<import("../entities/country.entity").CountryEntity>;
    remove(id: string): Promise<void>;
}
