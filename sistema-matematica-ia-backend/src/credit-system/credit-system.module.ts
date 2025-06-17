import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditPackageEntity } from './entities/credit-package.entity';
import { CreditTransactionEntity } from './entities/credit-transaction.entity';
import { CreditService } from './services/credit.service';
import { CreditPackageService } from './services/credit-package.service';
import { StripeService } from './services/stripe.service';
import { CreditController } from './controllers/credit.controller';
import { CreditPackageController } from './controllers/credit-package.controller';
import { UsersModule } from '../users/users.module';
import { UserEntity } from 'src/users/entities/user.entity';
import { CustomLoggerService } from 'src/common/services/logger.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CreditPackageEntity,
      CreditTransactionEntity,
      UserEntity,
    ]),
    // UsersModule,
  ],
  providers: [
    CreditService,
    CreditPackageService,
    StripeService,
    CustomLoggerService,
  ],
  controllers: [CreditController, CreditPackageController],
  exports: [CreditService, CreditPackageService, StripeService],
})
export class CreditSystemModule {}
