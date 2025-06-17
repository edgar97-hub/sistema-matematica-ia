import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreditPackageEntity } from '../entities/credit-package.entity';
import { CustomLoggerService } from '../../common/services/logger.service';

@Injectable()
export class CreditPackageService {
  constructor(
    @InjectRepository(CreditPackageEntity)
    private creditPackageRepository: Repository<CreditPackageEntity>,
    private logger: CustomLoggerService,
  ) {}

  async findAll(): Promise<CreditPackageEntity[]> {
    try {
      return await this.creditPackageRepository.find();
    } catch (error) {
      this.logger.error(
        `Error fetching all credit packages: ${error.message}`,
        error.stack,
        'CreditPackageService',
      );
      throw error;
    }
  }

  async findOne(id: number): Promise<CreditPackageEntity> {
    try {
      const creditPackage = await this.creditPackageRepository.findOne({
        where: { id },
      });
      if (!creditPackage) {
        throw new NotFoundException(`Credit package with ID "${id}" not found`);
      }
      return creditPackage;
    } catch (error) {
      this.logger.error(
        `Error fetching credit package with id ${id}: ${error.message}`,
        error.stack,
        'CreditPackageService',
      );
      throw error;
    }
  }

  async create(
    creditPackageData: Partial<CreditPackageEntity>,
  ): Promise<CreditPackageEntity> {
    try {
      function camelToSnake(str) {
        return str.replace(/([A-Z])/g, '_$1').toLowerCase();
      }

      function convertKeys(obj) {
        return Object.keys(obj).reduce((acc, key) => {
          acc[camelToSnake(key)] = obj[key];
          return acc;
        }, {});
      }
      let test = convertKeys(creditPackageData);
      const newCreditPackage = this.creditPackageRepository.create(test);
      const savedCreditPackage =
        await this.creditPackageRepository.save(newCreditPackage);
      this.logger.log(
        `Created new credit package with id ${savedCreditPackage.id}`,
        'CreditPackageService',
      );
      return savedCreditPackage;
    } catch (error) {
      this.logger.error(
        `Error creating credit package: ${error.message}`,
        error.stack,
        'CreditPackageService',
      );
      throw error;
    }
  }

  async update(
    id: number,
    creditPackageData: Partial<CreditPackageEntity>,
  ): Promise<CreditPackageEntity> {
    try {
      function camelToSnake(str) {
        return str.replace(/([A-Z])/g, '_$1').toLowerCase();
      }

      function convertKeys(obj) {
        return Object.keys(obj).reduce((acc, key) => {
          acc[camelToSnake(key)] = obj[key];
          return acc;
        }, {});
      }
      let test = convertKeys(creditPackageData);
      await this.creditPackageRepository.update(id, test);
      const updatedCreditPackage = await this.creditPackageRepository.findOne({
        where: { id },
      });
      if (!updatedCreditPackage) {
        throw new NotFoundException(`Credit package with ID "${id}" not found`);
      }
      this.logger.log(
        `Updated credit package with id ${id}`,
        'CreditPackageService',
      );
      return updatedCreditPackage;
    } catch (error) {
      this.logger.error(
        `Error updating credit package with id ${id}: ${error.message}`,
        error.stack,
        'CreditPackageService',
      );
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.creditPackageRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Credit package with ID "${id}" not found`);
      }
      this.logger.log(
        `Removed credit package with id ${id}`,
        'CreditPackageService',
      );
    } catch (error) {
      this.logger.error(
        `Error removing credit package with id ${id}: ${error.message}`,
        error.stack,
        'CreditPackageService',
      );
      throw error;
    }
  }
}
