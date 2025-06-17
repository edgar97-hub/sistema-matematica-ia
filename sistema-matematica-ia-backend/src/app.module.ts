import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AdminUsersModule } from './admin-users/admin-users.module';
import { EducationalContentModule } from './educational-content/educational-content.module';
import { CreditPackageEntity } from './credit-system/entities/credit-package.entity';
import { CreditTransactionEntity } from './credit-system/entities/credit-transaction.entity';
import { CreditService } from './credit-system/services/credit.service';
import { CreditPackageService } from './credit-system/services/credit-package.service';
import { StripeService } from './credit-system/services/stripe.service';
import { CreditController } from './credit-system/controllers/credit.controller';
import { CreditPackageController } from './credit-system/controllers/credit-package.controller';
import { CustomLoggerService } from './common/services/logger.service';
import { SystemConfigurationModule } from './system-configuration/system-configuration.module';
import { FileStorageModule } from './file-storage/file-storage.module';
import { OrdersService } from './orders/orders.service';
import { OrdersController } from './orders/orders.controller';
import { MathProcessingModule } from './math-processing/math-processing.module';
import { OrdersModule } from './orders/orders.module';
import { OrderEntity } from './orders/entities/order.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT')
          ? parseInt(configService.get('DB_PORT') as string, 10)
          : 3306,
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      CreditPackageEntity,
      CreditTransactionEntity,
      OrderEntity,
    ]),
    OrdersModule,
    UsersModule,
    AuthModule,
    AdminUsersModule,
    EducationalContentModule,
    SystemConfigurationModule,
    FileStorageModule,
    MathProcessingModule,
  ],
  controllers: [
    AppController,
    CreditController,
    CreditPackageController,
    OrdersController,
  ],
  providers: [
    AppService,
    CreditService,
    CreditPackageService,
    StripeService,
    CustomLoggerService,
    OrdersService,
  ],
})
export class AppModule {}
