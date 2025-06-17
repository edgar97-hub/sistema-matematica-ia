import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CountryEntity } from '../entities/country.entity';
import { CreateCountryDto, UpdateCountryDto } from '../dto/country.dto';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(CountryEntity)
    private countryRepository: Repository<CountryEntity>,
  ) {}

  async findAll(page: number = 1, limit: number = 10, filter?: string, sort?: string): Promise<{ items: CountryEntity[], total: number }> {
    const where: any = {};
    const order: any = {};

    if (filter) {
      where.name = { $ilike: `%${filter}%` };
    }

    if (sort) {
      const [field, direction] = sort.split(':');
      order[field] = direction.toUpperCase();
    }

    const [items, total] = await this.countryRepository.findAndCount({
      where,
      order,
      take: limit,
      skip: (page - 1) * limit,
    });

    return { items, total };
  }

  async findOne(id: number): Promise<CountryEntity> {
    const country = await this.countryRepository.findOne({ where: { id } });
    if (!country) {
      throw new NotFoundException(`Country with ID "${id}" not found`);
    }
    return country;
  }

  async create(createCountryDto: CreateCountryDto): Promise<CountryEntity> {
    const newCountry = this.countryRepository.create(createCountryDto);
    return this.countryRepository.save(newCountry);
  }

  async update(id: number, updateCountryDto: UpdateCountryDto): Promise<CountryEntity> {
    await this.countryRepository.update(id, updateCountryDto);
    const updatedCountry = await this.countryRepository.findOne({ where: { id } });
    if (!updatedCountry) {
      throw new NotFoundException(`Country with ID "${id}" not found`);
    }
    return updatedCountry;
  }

  async remove(id: number): Promise<void> {
    const result = await this.countryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Country with ID "${id}" not found`);
    }
  }

  async findActiveCountriesForPwa(): Promise<CountryEntity[]> {
    return this.countryRepository.createQueryBuilder('country')
      .leftJoinAndSelect('country.educational_stages', 'stage')
      .where('country.is_active = :isActive', { isActive: true })
      .andWhere('stage.is_active = :isActive', { isActive: true })
      .getMany();
  }

  async isValidCountry(countryName: string): Promise<boolean> {
    const country = await this.countryRepository.findOne({
      where: { name: countryName, is_active: true }
    });
    return !!country;
  }
}