import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CountryEntity } from '../entities/country.entity';
import { EducationalStageEntity } from '../entities/educational-stage.entity';
import { EducationalSubdivisionEntity } from '../entities/educational-subdivision.entity';

@Injectable()
export class EducationalContentService {
  constructor(
    @InjectRepository(CountryEntity)
    private countryRepository: Repository<CountryEntity>,
    @InjectRepository(EducationalStageEntity)
    private stageRepository: Repository<EducationalStageEntity>,
    @InjectRepository(EducationalSubdivisionEntity)
    private subdivisionRepository: Repository<EducationalSubdivisionEntity>
  ) {}

  // Country CRUD operations
  async createCountry(countryData: Partial<CountryEntity>): Promise<CountryEntity> {
    const country = this.countryRepository.create(countryData);
    return this.countryRepository.save(country);
  }

  async getAllCountries(): Promise<CountryEntity[]> {
    return this.countryRepository.find({ order: { display_order: 'ASC' } });
  }

  async getCountryById(id: number): Promise<CountryEntity> {
    const country = await this.countryRepository.findOne({ where: { id } });
    if (!country) {
      throw new NotFoundException(`Country with ID "${id}" not found`);
    }
    return country;
  }

  async updateCountry(id: number, countryData: Partial<CountryEntity>): Promise<CountryEntity> {
    await this.countryRepository.update(id, countryData);
    return this.getCountryById(id);
  }

  async deleteCountry(id: number): Promise<void> {
    const result = await this.countryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Country with ID "${id}" not found`);
    }
  }

  // Educational Stage CRUD operations
  async createEducationalStage(stageData: Partial<EducationalStageEntity>): Promise<EducationalStageEntity> {
    const stage = this.stageRepository.create(stageData);
    return this.stageRepository.save(stage);
  }

  async getAllEducationalStages(countryId: number): Promise<EducationalStageEntity[]> {
    return this.stageRepository.find({ 
      where: { country_id: countryId },
      order: { display_order: 'ASC' }
    });
  }

  async getEducationalStageById(id: number): Promise<EducationalStageEntity> {
    const stage = await this.stageRepository.findOne({ where: { id } });
    if (!stage) {
      throw new NotFoundException(`Educational Stage with ID "${id}" not found`);
    }
    return stage;
  }

  async updateEducationalStage(id: number, stageData: Partial<EducationalStageEntity>): Promise<EducationalStageEntity> {
    await this.stageRepository.update(id, stageData);
    return this.getEducationalStageById(id);
  }

  async deleteEducationalStage(id: number): Promise<void> {
    const result = await this.stageRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Educational Stage with ID "${id}" not found`);
    }
  }

  // Educational Subdivision CRUD operations
  async createEducationalSubdivision(subdivisionData: Partial<EducationalSubdivisionEntity>): Promise<EducationalSubdivisionEntity> {
    const subdivision = this.subdivisionRepository.create(subdivisionData);
    return this.subdivisionRepository.save(subdivision);
  }

  async getAllEducationalSubdivisions(stageId: number): Promise<EducationalSubdivisionEntity[]> {
    return this.subdivisionRepository.find({ 
      where: { educational_stage_id: stageId },
      order: { display_order: 'ASC' }
    });
  }

  async getEducationalSubdivisionById(id: number): Promise<EducationalSubdivisionEntity> {
    const subdivision = await this.subdivisionRepository.findOne({ where: { id } });
    if (!subdivision) {
      throw new NotFoundException(`Educational Subdivision with ID "${id}" not found`);
    }
    return subdivision;
  }

  async updateEducationalSubdivision(id: number, subdivisionData: Partial<EducationalSubdivisionEntity>): Promise<EducationalSubdivisionEntity> {
    await this.subdivisionRepository.update(id, subdivisionData);
    return this.getEducationalSubdivisionById(id);
  }

  async deleteEducationalSubdivision(id: number): Promise<void> {
    const result = await this.subdivisionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Educational Subdivision with ID "${id}" not found`);
    }
  }

  // Method to get the complete hierarchical structure
  async getCompleteStructure(): Promise<CountryEntity[]> {
    return this.countryRepository.find({
      relations: ['educational_stages', 'educational_stages.educational_subdivisions'],
      order: {
        display_order: 'ASC',
        educational_stages: {
          display_order: 'ASC',
          educational_subdivisions: {
            display_order: 'ASC'
          }
        }
      }
    });
  }
}