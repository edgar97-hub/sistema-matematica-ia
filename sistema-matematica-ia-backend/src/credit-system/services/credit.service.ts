import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { CreditPackageEntity } from '../entities/credit-package.entity';
import {
  CreditTransactionEntity,
  CreditTransactionAction,
} from '../entities/credit-transaction.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { StripeService } from './stripe.service';
import { CustomLoggerService } from '../../common/services/logger.service';
import Stripe from 'stripe';

@Injectable()
export class CreditService {
  constructor(
    @InjectRepository(CreditPackageEntity)
    private creditPackageRepository: Repository<CreditPackageEntity>,
    @InjectRepository(CreditTransactionEntity)
    private creditTransactionRepository: Repository<CreditTransactionEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private stripeService: StripeService,
    private logger: CustomLoggerService,
    private entityManager: EntityManager,
  ) {}

  async recordTransaction(
    data: Partial<CreditTransactionEntity>,
  ): Promise<CreditTransactionEntity> {
    return this.entityManager.transaction(
      async (transactionalEntityManager) => {
        const user = await transactionalEntityManager.findOne(UserEntity, {
          where: { id: data.target_user_id },
        });
        if (!user) {
          throw new NotFoundException(
            `User with ID "${data.target_user_id}" not found`,
          );
        }

        if (typeof data.amount !== 'number') {
          throw new BadRequestException('Transaction amount must be a number');
        }

        const balanceBefore = user.credit_balance;
        user.credit_balance += data.amount;
        const balanceAfter = user.credit_balance;

        const transaction = transactionalEntityManager.create(
          CreditTransactionEntity,
          {
            ...data,
            balance_before: balanceBefore,
            balance_after: balanceAfter,
          },
        );

        await transactionalEntityManager.save(user);
        await transactionalEntityManager.save(transaction);

        return transaction;
      },
    );
  }

  async purchaseCredits(
    userId: number,
    packageId: number,
  ): Promise<CreditTransactionEntity> {
    try {
      const creditPackage = await this.creditPackageRepository.findOne({
        where: { id: packageId },
      });
      if (!creditPackage) {
        throw new NotFoundException(
          `Credit package with ID "${packageId}" not found`,
        );
      }

      const paymentIntent = await this.stripeService.createPaymentIntent(
        creditPackage.price * 100,
        'usd',
      );

      const transaction = await this.recordTransaction({
        action: CreditTransactionAction.PURCHASE_SUCCESS,
        amount: creditPackage.credit_amount,
        target_user_id: userId,
        credit_package_id: packageId,
        payment_gateway: 'stripe',
        gateway_transaction_id: paymentIntent.id,
        gateway_transaction_status: paymentIntent.status,
        gateway_response_payload: paymentIntent,
      });

      this.logger.log(
        `Credit purchase initiated: ${transaction.id}`,
        'CreditService',
      );
      return transaction;
    } catch (error) {
      this.logger.error(
        `Error purchasing credits: ${error.message}`,
        error.stack,
        'CreditService',
      );
      throw error;
    }
  }

  async confirmCreditPurchase(sessionId: string): Promise<void> {
    try {
      const session = await this.stripeService.retrieveCheckoutSession(sessionId);
      
      if (session.payment_status !== 'paid') {
        this.logger.warn(`Checkout session ${sessionId} is not paid`, 'CreditService');
        return;
      }

      if (!session.client_reference_id || !session.metadata?.packageId) {
        throw new Error('Missing user ID or package ID in session metadata');
      }

      const userId = parseInt(session.client_reference_id);
      const packageId = parseInt(session.metadata.packageId);

      if (isNaN(userId) || isNaN(packageId)) {
        throw new Error('Invalid user ID or package ID in session metadata');
      }

      const creditPackage = await this.creditPackageRepository.findOne({ where: { id: packageId } });
      if (!creditPackage) {
        throw new NotFoundException(`Credit package with ID ${packageId} not found`);
      }

      await this.recordTransaction({
        action: CreditTransactionAction.PURCHASE_SUCCESS,
        amount: creditPackage.credit_amount,
        target_user_id: userId,
        credit_package_id: packageId,
        payment_gateway: 'stripe',
        gateway_transaction_id: sessionId,
        gateway_transaction_status: 'completed',
      });

      this.logger.log(`Credit purchase confirmed for user ${userId}, package ${packageId}`, 'CreditService');
    } catch (error) {
      this.logger.error(`Error confirming credit purchase: ${error.message}`, error.stack, 'CreditService');
      throw error;
    }
  }

  async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session): Promise<void> {
    try {
      await this.confirmCreditPurchase(session.id);
    } catch (error) {
      this.logger.error(`Error handling completed checkout session: ${error.message}`, error.stack, 'CreditService');
      throw error;
    }
  }

  async useCredits(
    userId: number,
    amount: number,
    description: string,
  ): Promise<CreditTransactionEntity> {
    try {
      return await this.recordTransaction({
        action: CreditTransactionAction.USAGE_RESOLUTION,
        amount: -amount,
        target_user_id: userId,
        reason: description,
      });
    } catch (error) {
      this.logger.error(
        `Error using credits: ${error.message}`,
        error.stack,
        'CreditService',
      );
      throw error;
    }
  }

  async getCreditBalance(userId: number): Promise<number> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with ID "${userId}" not found`);
      }
      return user.credit_balance;
    } catch (error) {
      this.logger.error(
        `Error getting credit balance: ${error.message}`,
        error.stack,
        'CreditService',
      );
      throw error;
    }
  }

  async getCreditTransactions(
    userId: number,
  ): Promise<CreditTransactionEntity[]> {
    try {
      return this.creditTransactionRepository.find({
        where: { target_user_id: userId },
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      this.logger.error(
        `Error getting credit transactions: ${error.message}`,
        error.stack,
        'CreditService',
      );
      throw error;
    }
  }

  async addWelcomeCredits(
    userId: number,
    amount: number,
  ): Promise<CreditTransactionEntity> {
    try {
      return await this.recordTransaction({
        action: CreditTransactionAction.WELCOME_BONUS,
        amount: amount,
        target_user_id: userId,
        reason: 'Welcome bonus credits',
      });
    } catch (error) {
      this.logger.error(
        `Error adding welcome credits: ${error.message}`,
        error.stack,
        'CreditService',
      );
      throw error;
    }
  }

  async adminAdjustCredits(
    userId: number,
    amount: number,
    reason: string,
  ): Promise<CreditTransactionEntity> {
    try {
      return await this.recordTransaction({
        action: CreditTransactionAction.ADMIN_ADJUSTMENT,
        amount: amount,
        target_user_id: userId,
        reason: reason,
      });
    } catch (error) {
      this.logger.error(
        `Error adjusting credits by admin: ${error.message}`,
        error.stack,
        'CreditService',
      );
      throw error;
    }
  }

  async getUserCreditHistory(
    targetUserId: string,
    page: number,
    limit: number,
  ): Promise<{ data: CreditTransactionEntity[]; total: number }> {
    try {
      const [data, total] = await this.creditTransactionRepository.findAndCount(
        {
          where: { target_user_id: parseInt(targetUserId) },
          order: { createdAt: 'DESC' },
          skip: (page - 1) * limit,
          take: limit,
        },
      );
      return { data, total };
    } catch (error) {
      this.logger.error(
        `Error getting user credit history: ${error.message}`,
        error.stack,
        'CreditService',
      );
      throw error;
    }
  }

  /**
   * Retrieves all credit transactions with optional filtering and pagination.
   * @param page The page number for pagination (default: 1)
   * @param limit The number of items per page (default: 10)
   * @param filters Optional filters for the query
   * @returns An object containing the paginated data and total count of transactions
   */
  async getAllCreditTransactions(
    page: number,
    limit: number,
    filters?: {
      startDate?: Date;
      endDate?: Date;
      action?: CreditTransactionAction;
    },
  ): Promise<{ data: CreditTransactionEntity[]; total: number }> {
    try {
      const query = this.creditTransactionRepository.createQueryBuilder('transaction');

      if (filters?.startDate) {
        query.andWhere('transaction.createdAt >= :startDate', { startDate: filters.startDate });
      }
      if (filters?.endDate) {
        query.andWhere('transaction.createdAt <= :endDate', { endDate: filters.endDate });
      }
      if (filters?.action) {
        query.andWhere('transaction.action = :action', { action: filters.action });
      }

      query.orderBy('transaction.createdAt', 'DESC')
           .skip((page - 1) * limit)
           .take(limit);

      const [data, total] = await query.getManyAndCount();
      return { data, total };
    } catch (error) {
      this.logger.error(
        `Error getting all credit transactions: ${error.message}`,
        error.stack,
        'CreditService',
      );
      throw error;
    }
  }

  async deductCreditsForOrder(
    userId: number,
    orderId: string,
    amount: number,
  ): Promise<CreditTransactionEntity> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with ID "${userId}" not found`);
      }

      if (user.credit_balance < amount) {
        throw new BadRequestException('Insufficient credits for this order');
      }

      const transaction = await this.recordTransaction({
        action: CreditTransactionAction.USAGE_RESOLUTION,
        amount: -amount,
        target_user_id: userId,
        reason: `Credit deduction for order ${orderId}`,
      });

      this.logger.log(
        `Credits deducted for order: User ${userId}, Order ${orderId}, Amount ${amount}`,
        'CreditService',
      );

      return transaction;
    } catch (error) {
      this.logger.error(
        `Error deducting credits for order: ${error.message}`,
        error.stack,
        'CreditService',
      );
      throw error;
    }
  }
}
