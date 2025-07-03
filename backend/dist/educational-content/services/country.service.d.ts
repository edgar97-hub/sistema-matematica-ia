import { Repository } from 'typeorm';
import { CountryEntity, FindAllCountriesQueryDto } from '../entities/country.entity';
import { CreateCountryDto, UpdateCountryDto } from '../dto/country.dto';
export declare class CountryService {
    private countryRepository;
    constructor(countryRepository: Repository<CountryEntity>);
    findAll(queryDto: FindAllCountriesQueryDto): Promise<{
        data: CountryEntity[];
        total: number;
    }>;
    findActiveCountriesForPwa(): Promise<CountryEntity[]>;
    findOne(id: number): Promise<CountryEntity>;
    create(createCountryDto: CreateCountryDto): Promise<CountryEntity>;
    update(id: number, updateCountryDto: UpdateCountryDto): Promise<CountryEntity>;
    remove(id: number): Promise<void>;
    isValidCountry(countryName: string): Promise<boolean>;
}
