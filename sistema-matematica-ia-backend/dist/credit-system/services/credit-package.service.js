"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditPackageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const credit_package_entity_1 = require("../entities/credit-package.entity");
const logger_service_1 = require("../../common/services/logger.service");
let CreditPackageService = class CreditPackageService {
    creditPackageRepository;
    logger;
    constructor(creditPackageRepository, logger) {
        this.creditPackageRepository = creditPackageRepository;
        this.logger = logger;
    }
    async findAll() {
        try {
            return await this.creditPackageRepository.find();
        }
        catch (error) {
            this.logger.error(`Error fetching all credit packages: ${error.message}`, error.stack, 'CreditPackageService');
            throw error;
        }
    }
    async findOne(id) {
        try {
            const creditPackage = await this.creditPackageRepository.findOne({
                where: { id },
            });
            if (!creditPackage) {
                throw new common_1.NotFoundException(`Credit package with ID "${id}" not found`);
            }
            return creditPackage;
        }
        catch (error) {
            this.logger.error(`Error fetching credit package with id ${id}: ${error.message}`, error.stack, 'CreditPackageService');
            throw error;
        }
    }
    async create(creditPackageData) {
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
            const savedCreditPackage = await this.creditPackageRepository.save(newCreditPackage);
            this.logger.log(`Created new credit package with id ${savedCreditPackage.id}`, 'CreditPackageService');
            return savedCreditPackage;
        }
        catch (error) {
            this.logger.error(`Error creating credit package: ${error.message}`, error.stack, 'CreditPackageService');
            throw error;
        }
    }
    async update(id, creditPackageData) {
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
                throw new common_1.NotFoundException(`Credit package with ID "${id}" not found`);
            }
            this.logger.log(`Updated credit package with id ${id}`, 'CreditPackageService');
            return updatedCreditPackage;
        }
        catch (error) {
            this.logger.error(`Error updating credit package with id ${id}: ${error.message}`, error.stack, 'CreditPackageService');
            throw error;
        }
    }
    async remove(id) {
        try {
            const result = await this.creditPackageRepository.delete(id);
            if (result.affected === 0) {
                throw new common_1.NotFoundException(`Credit package with ID "${id}" not found`);
            }
            this.logger.log(`Removed credit package with id ${id}`, 'CreditPackageService');
        }
        catch (error) {
            this.logger.error(`Error removing credit package with id ${id}: ${error.message}`, error.stack, 'CreditPackageService');
            throw error;
        }
    }
};
exports.CreditPackageService = CreditPackageService;
exports.CreditPackageService = CreditPackageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(credit_package_entity_1.CreditPackageEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        logger_service_1.CustomLoggerService])
], CreditPackageService);
//# sourceMappingURL=credit-package.service.js.map