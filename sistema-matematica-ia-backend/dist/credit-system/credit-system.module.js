"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditSystemModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const credit_package_entity_1 = require("./entities/credit-package.entity");
const credit_transaction_entity_1 = require("./entities/credit-transaction.entity");
const credit_service_1 = require("./services/credit.service");
const credit_package_service_1 = require("./services/credit-package.service");
const stripe_service_1 = require("./services/stripe.service");
const credit_controller_1 = require("./controllers/credit.controller");
const credit_package_controller_1 = require("./controllers/credit-package.controller");
const user_entity_1 = require("../users/entities/user.entity");
const logger_service_1 = require("../common/services/logger.service");
let CreditSystemModule = class CreditSystemModule {
};
exports.CreditSystemModule = CreditSystemModule;
exports.CreditSystemModule = CreditSystemModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                credit_package_entity_1.CreditPackageEntity,
                credit_transaction_entity_1.CreditTransactionEntity,
                user_entity_1.UserEntity,
            ]),
        ],
        providers: [
            credit_service_1.CreditService,
            credit_package_service_1.CreditPackageService,
            stripe_service_1.StripeService,
            logger_service_1.CustomLoggerService,
        ],
        controllers: [credit_controller_1.CreditController, credit_package_controller_1.CreditPackageController],
        exports: [credit_service_1.CreditService, credit_package_service_1.CreditPackageService, stripe_service_1.StripeService],
    })
], CreditSystemModule);
//# sourceMappingURL=credit-system.module.js.map