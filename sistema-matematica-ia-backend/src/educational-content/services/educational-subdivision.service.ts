import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EducationalSubdivisionEntity } from '../entities/educational-subdivision.entity';
import { CreateEducationalSubdivisionDto, UpdateEducationalSubdivisionDto } from '../dto/educational-subdivision.dto';

@Injectable()
export class EducationalSubdivisionService {
  constructor(
    @InjectRepository(EducationalSubdivisionEntity)
    private educationalSubdivisionRepository: Repository<EducationalSubdivisionEntity>,
  ) {}

  async findAll(page: number = 1, limit: number = 10, filter?: string, sort?: string): Promise<{ items: EducationalSubdivisionEntity[], total: number }> {
    const where: any = {};
    const order: any = {};

    if (filter) {
      where.name = { $ilike: `%${filter}%` };
    }

    if (sort) {
      const [field, direction] = sort.split(':');
      order[field] = direction.toUpperCase();
    }

    const [items, total] = await this.educationalSubdivisionRepository.findAndCount({
      where,
      order,
      take: limit,
      skip: (page - 1) * limit,
    });

    return { items, total };
  }

  async findOne(id: number): Promise<EducationalSubdivisionEntity> {
    const subdivision = await this.educationalSubdivisionRepository.findOne({ where: { id } });
    if (!subdivision) {
      throw new NotFoundException(`Educational Subdivision with ID "${id}" not found`);
    }
    return subdivision;
  }

  async create(createEducationalSubdivisionDto: CreateEducationalSubdivisionDto): Promise<EducationalSubdivisionEntity> {
    const newSubdivision = this.educationalSubdivisionRepository.create(createEducationalSubdivisionDto);
    return this.educationalSubdivisionRepository.save(newSubdivision);
  }

  async update(id: number, updateEducationalSubdivisionDto: UpdateEducationalSubdivisionDto): Promise<EducationalSubdivisionEntity> {
    await this.educationalSubdivisionRepository.update(id, updateEducationalSubdivisionDto);
    const updatedSubdivision = await this.educationalSubdivisionRepository.findOne({ where: { id } });
    if (!updatedSubdivision) {
      throw new NotFoundException(`Educational Subdivision with ID "${id}" not found`);
    }
    return updatedSubdivision;
  }

  async remove(id: number): Promise<void> {
    const result = await this.educationalSubdivisionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Educational Subdivision with ID "${id}" not found`);
    }
  }

  async findActiveSubdivisionsByStage(stageId: number): Promise<EducationalSubdivisionEntity[]> {
    return this.educationalSubdivisionRepository.find({
      where: {
        educational_stage_id: stageId,
        is_active: true
      },
      order: {
        display_order: 'ASC'
      }
    });
  }
}