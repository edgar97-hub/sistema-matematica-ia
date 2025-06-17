import { Repository } from 'typeorm';
import { CountryEntity } from '../entities/country.entity';
import { CreateCountryDto, UpdateCountryDto } from '../dto/country.dto';
export declare class CountryService {
    private countryRepository;
    constructor(countryRepository: Repository<CountryEntity>);
    findAll(page?: number, limit?: number, filter?: string, sort?: string): Promise<{
        items: CountryEntity[];
        total: number;
    }>;
    findOne(id: number): Promise<CountryEntity>;
    create(createCountryDto: CreateCountryDto): Promise<CountryEntity>;
    update(id: number, updateCountryDto: UpdateCountryDto): Promise<CountryEntity>;
    remove(id: number): Promise<void>;
    findActiveCountriesForPwa(): Promise<CountryEntity[]>;
    isValidCountry(countryName: string): Promise<boolean>;
}
