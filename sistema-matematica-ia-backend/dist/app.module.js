"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const admin_users_module_1 = require("./admin-users/admin-users.module");
const educational_content_module_1 = require("./educational-content/educational-content.module");
const credit_package_entity_1 = require("./credit-system/entities/credit-package.entity");
const credit_transaction_entity_1 = require("./credit-system/entities/credit-transaction.entity");
const credit_service_1 = require("./credit-system/services/credit.service");
const credit_package_service_1 = require("./credit-system/services/credit-package.service");
const stripe_service_1 = require("./credit-system/services/stripe.service");
const credit_controller_1 = require("./credit-system/controllers/credit.controller");
const credit_package_controller_1 = require("./credit-system/controllers/credit-package.controller");
const logger_service_1 = require("./common/services/logger.service");
const system_configuration_module_1 = require("./system-configuration/system-configuration.module");
const file_storage_module_1 = require("./file-storage/file-storage.module");
const orders_service_1 = require("./orders/orders.service");
const orders_controller_1 = require("./orders/orders.controller");
const math_processing_module_1 = require("./math-processing/math-processing.module");
const orders_module_1 = require("./orders/orders.module");
const order_entity_1 = require("./orders/entities/order.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'mysql',
                    host: configService.get('DB_HOST'),
                    port: configService.get('DB_PORT')
                        ? parseInt(configService.get('DB_PORT'), 10)
                        : 3306,
                    username: configService.get('DB_USERNAME'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_DATABASE'),
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    synchronize: true,
                }),
                inject: [config_1.ConfigService],
            }),
            typeorm_1.TypeOrmModule.forFeature([
                credit_package_entity_1.CreditPackageEntity,
                credit_transaction_entity_1.CreditTransactionEntity,
                order_entity_1.OrderEntity,
            ]),
            orders_module_1.OrdersModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            admin_users_module_1.AdminUsersModule,
            educational_content_module_1.EducationalContentModule,
            system_configuration_module_1.SystemConfigurationModule,
            file_storage_module_1.FileStorageModule,
            math_processing_module_1.MathProcessingModule,
        ],
        controllers: [
            app_controller_1.AppController,
            credit_controller_1.CreditController,
            credit_package_controller_1.CreditPackageController,
            orders_controller_1.OrdersController,
        ],
        providers: [
            app_service_1.AppService,
            credit_service_1.CreditService,
            credit_package_service_1.CreditPackageService,
            stripe_service_1.StripeService,
            logger_service_1.CustomLoggerService,
            orders_service_1.OrdersService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map