import { Repository } from 'typeorm';
import { CreditPackageEntity } from '../entities/credit-package.entity';
import { CustomLoggerService } from '../../common/services/logger.service';
export declare class CreditPackageService {
    private creditPackageRepository;
    private logger;
    constructor(creditPackageRepository: Repository<CreditPackageEntity>, logger: CustomLoggerService);
    findAll(): Promise<CreditPackageEntity[]>;
    findOne(id: number): Promise<CreditPackageEntity>;
    create(creditPackageData: Partial<CreditPackageEntity>): Promise<CreditPackageEntity>;
    update(id: number, creditPackageData: Partial<CreditPackageEntity>): Promise<CreditPackageEntity>;
    remove(id: number): Promise<void>;
}
