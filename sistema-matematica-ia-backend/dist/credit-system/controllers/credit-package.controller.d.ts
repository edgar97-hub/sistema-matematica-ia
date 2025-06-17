import { CreditPackageService } from '../services/credit-package.service';
import { CreateCreditPackageDto } from '../dto/create-credit-package.dto';
import { UpdateCreditPackageDto } from '../dto/update-credit-package.dto';
export declare class CreditPackageController {
    private readonly creditPackageService;
    constructor(creditPackageService: CreditPackageService);
    create(createCreditPackageDto: CreateCreditPackageDto): Promise<import("../entities/credit-package.entity").CreditPackageEntity>;
    findAll(): Promise<import("../entities/credit-package.entity").CreditPackageEntity[]>;
    findOne(id: string): Promise<import("../entities/credit-package.entity").CreditPackageEntity>;
    update(id: string, updateCreditPackageDto: UpdateCreditPackageDto): Promise<import("../entities/credit-package.entity").CreditPackageEntity>;
    remove(id: string): Promise<void>;
}
