import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  EntityManager,
  FindManyOptions,
  FindOptionsWhere,
  Between,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm';
import { CreditPackageEntity } from '../entities/credit-package.entity';
import {
  CreditTransactionEntity,
  CreditTransactionAction,
} from '../entities/credit-transaction.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { StripeService } from './stripe.service';
import { CustomLoggerService } from '../../common/services/logger.service';
import { GetAllCreditTransactionsDto } from '../controllers/credit-transaction.controller';
import Stripe from 'stripe';
import { AdminUserEntity } from 'src/admin-users/entities/admin-user.entity';

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
          where: { id: data.targetUserId },
        });
        if (!user) {
          throw new NotFoundException(
            `User with ID "${data.targetUserId}" not found`,
          );
        }

        if (typeof data.amount !== 'number') {
          throw new BadRequestException('Transaction amount must be a number');
        }

        // const balanceBefore = user.creditBalance;
        // user.creditBalance += data.amount;
        // const balanceAfter = user.creditBalance;

        const transaction = transactionalEntityManager.create(
          CreditTransactionEntity,
          {
            ...data,
            // balanceBefore: balanceBefore,
            // balanceAfter: balanceAfter,
          },
        );

        // await transactionalEntityManager.save(user);
        await transactionalEntityManager.save(transaction);

        return transaction;
      },
    );
  }

  // async purchaseCredits(
  //   userId: number,
  //   packageId: number,
  // ): Promise<CreditTransactionEntity> {
  //   try {
  //     const creditPackage = await this.creditPackageRepository.findOne({
  //       where: { id: packageId },
  //     });
  //     if (!creditPackage) {
  //       throw new NotFoundException(
  //         `Credit package with ID "${packageId}" not found`,
  //       );
  //     }

  //     const paymentIntent = await this.stripeService.createPaymentIntent(
  //       creditPackage.price * 100,
  //       'usd',
  //     );

  //     const transaction = await this.recordTransaction({
  //       action: CreditTransactionAction.PURCHASE_SUCCESS,
  //       amount: creditPackage.creditAmount,
  //       targetUserId: userId,
  //       creditPackageId: packageId,
  //       paymentGateway: 'stripe',
  //       gatewayTransactionId: paymentIntent.id,
  //       gatewayTransactionStatus: paymentIntent.status,
  //       gatewayResponsePayload: paymentIntent,
  //     });

  //     this.logger.log(
  //       `Credit purchase initiated: ${transaction.id}`,
  //       'CreditService',
  //     );
  //     return transaction;
  //   } catch (error) {
  //     this.logger.error(
  //       `Error purchasing credits: ${error.message}`,
  //       error.stack,
  //       'CreditService',
  //     );
  //     throw error;
  //   }
  //   // res.json({ received: true });
  // }

  // async confirmCreditPurchase(sessionId: string): Promise<void> {
  //   try {
  //     const session =
  //       await this.stripeService.retrieveCheckoutSession(sessionId);

  //     if (session.payment_status !== 'paid') {
  //       this.logger.warn(
  //         `Checkout session ${sessionId} is not paid`,
  //         'CreditService',
  //       );
  //       return;
  //     }

  //     if (!session.client_reference_id || !session.metadata?.packageId) {
  //       throw new Error('Missing user ID or package ID in session metadata');
  //     }

  //     const userId = parseInt(session.client_reference_id);
  //     const packageId = parseInt(session.metadata.packageId);

  //     if (isNaN(userId) || isNaN(packageId)) {
  //       throw new Error('Invalid user ID or package ID in session metadata');
  //     }

  //     const creditPackage = await this.creditPackageRepository.findOne({
  //       where: { id: packageId },
  //     });
  //     if (!creditPackage) {
  //       throw new NotFoundException(
  //         `Credit package with ID ${packageId} not found`,
  //       );
  //     }

  //     await this.recordTransaction({
  //       action: CreditTransactionAction.PURCHASE_SUCCESS,
  //       amount: creditPackage.creditAmount,
  //       targetUserId: userId,
  //       creditPackageId: packageId,
  //       paymentGateway: 'stripe',
  //       gatewayTransactionId: sessionId,
  //       gatewayTransactionStatus: 'completed',
  //     });

  //     this.logger.log(
  //       `Credit purchase confirmed for user ${userId}, package ${packageId}`,
  //       'CreditService',
  //     );
  //   } catch (error) {
  //     this.logger.error(
  //       `Error confirming credit purchase: ${error.message}`,
  //       error.stack,
  //       'CreditService',
  //     );
  //     throw error;
  //   }
  // }

  async handleSuccessfulCheckoutSession(
    session: Stripe.Checkout.Session,
  ): Promise<void> {
    this.logger.log(
      `Handling successful checkout session: ${session.id}, Payment Status: ${session.payment_status}`,
      'CreditService',
    );

    if (session.payment_status !== 'paid') {
      this.logger.warn(
        `Checkout session ${session.id} not successfully paid. Status: ${session.payment_status}`,
        'CreditService',
      );
      return; // No procesar si no está pagado
    }

    const gatewayTransactionId = session.id; // O session.payment_intent si es más adecuado como ID único de pago

    // 1. VERIFICAR IDEMPOTENCIA: ¿Ya procesamos esta transacción de Stripe?
    const existingTransaction = await this.creditTransactionRepository.findOne({
      where: {
        gatewayTransactionId: gatewayTransactionId,
        action: CreditTransactionAction.PURCHASE_SUCCESS,
      },
    });

    if (existingTransaction) {
      this.logger.log(
        `Stripe event for session ${gatewayTransactionId} already processed. Skipping.`,
        'CreditService',
      );
      return; // Ya fue procesado, no hacer nada más
    }

    // Extraer metadatos
    const userIdString = session.metadata?.userId;
    const packageIdString = session.metadata?.packageId;
    const creditsFromString = session.metadata?.creditsAmount;

    if (!userIdString || !packageIdString || !creditsFromString) {
      this.logger.error(
        `Missing metadata (userId, packageId, or creditsAmount) in Stripe session: ${session.id}`,
        JSON.stringify(session.metadata),
        'CreditService',
      );
      // Podrías crear un log de transacción fallida aquí o lanzar un error para monitoreo
      throw new BadRequestException('Stripe session metadata incomplete.');
    }

    const userId = userIdString; // Asumiendo que tu UserEntity.id es string (UUID)
    // Si es number, necesitas: const userId = parseInt(userIdString, 10);
    const packageId = packageIdString; // Asumiendo que CreditPackageEntity.id es string (UUID)
    // Si es number: const packageId = parseInt(packageIdString, 10);
    const creditsToAdd = parseInt(creditsFromString, 10);

    if (isNaN(creditsToAdd)) {
      this.logger.error(
        `Invalid creditsAmount in metadata: ${creditsFromString} for session ${session.id}`,
        '',
        'CreditService',
      );
      throw new BadRequestException(
        'Invalid creditsAmount in Stripe session metadata.',
      );
    }

    // Iniciar transacción de base de datos
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      const userRepo = transactionalEntityManager.getRepository(UserEntity);
      const packageRepo =
        transactionalEntityManager.getRepository(CreditPackageEntity);
      const transactionRepo = transactionalEntityManager.getRepository(
        CreditTransactionEntity,
      );

      const user = await userRepo.findOne({ where: { id: parseInt(userId) } });
      if (!user) {
        throw new NotFoundException(
          `User with ID "${userId}" not found for credit purchase.`,
        );
      }

      const creditPackage = await packageRepo.findOne({
        where: { id: parseInt(packageId) },
      });
      if (!creditPackage) {
        throw new NotFoundException(
          `Credit package with ID "${packageId}" not found.`,
        );
      }

      // Validar que los créditos del paquete coincidan con los metadatos (seguridad adicional)
      if (creditPackage.creditAmount !== creditsToAdd) {
        this.logger.warn(
          `Credits mismatch for package ${packageId} in session ${session.id}. Expected ${creditPackage.creditAmount}, got ${creditsToAdd}. Using package's amount.`,
          'CreditService',
        );
        // Usar creditPackage.creditAmount como la fuente de verdad
      }

      const balanceBefore = user.creditBalance; // O user.creditBalance si renombraste
      user.creditBalance += creditPackage.creditAmount; // Actualiza el saldo del usuario
      const balanceAfter = user.creditBalance;

      await userRepo.save(user); // Guarda el usuario actualizado

      // Crear y guardar la transacción de crédito
      const transactionData: Partial<CreditTransactionEntity> = {
        targetUserId: user.id,
        action: CreditTransactionAction.PURCHASE_SUCCESS,
        amount: creditPackage.creditAmount,
        balanceBefore,
        balanceAfter,
        paymentGateway: 'stripe',
        gatewayTransactionId: gatewayTransactionId,
        gatewayTransactionStatus: session.payment_status, // 'paid'
        gatewayResponsePayload: session, // Guardar el objeto session completo para referencia
        creditPackageId: creditPackage.id,
        reason: `Compra del paquete: ${creditPackage.name}`,
      };
      const newTransaction = transactionRepo.create(transactionData);
      await transactionRepo.save(newTransaction);

      this.logger.log(
        `Credits added and transaction recorded for user ${userId} from Stripe session ${session.id}`,
        'CreditService',
      );
    });
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
        targetUserId: userId,
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
      return user.creditBalance;
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
        where: { targetUserId: userId },
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
        targetUserId: userId,
        reason: 'Créditos de bonificación de bienvenida',
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
    adminUserId: number, // Pasa el objeto admin autenticado
    targetUserId: number, // o number
    amount: number,
    reason: string,
  ): Promise<CreditTransactionEntity> {
    return this.entityManager.transaction(async (tem) => {
      const userRepo = tem.getRepository(UserEntity);
      const user = await userRepo.findOneBy({ id: targetUserId });
      if (!user)
        throw new NotFoundException(`User with ID ${targetUserId} not found.`);

      const balanceBefore = user.creditBalance;
      user.creditBalance += amount; // 'amount' puede ser positivo o negativo
      const balanceAfter = user.creditBalance;

      await userRepo.save(user);

      return this.internalRecordTransaction(
        {
          // Un método interno que no inicia su propia transacción
          targetUserId: user.id,
          adminUserId: adminUserId, // ID del admin que realiza la acción
          action: CreditTransactionAction.ADMIN_ADJUSTMENT,
          amount: amount,
          balanceBefore,
          balanceAfter,
          reason,
        },
        tem,
      );
    });
  }

  // Método interno para ser llamado dentro de una transacción existente
  async internalRecordTransaction(
    data: Partial<CreditTransactionEntity>,
    manager: EntityManager,
  ): Promise<CreditTransactionEntity> {
    const transactionRepo = manager.getRepository(CreditTransactionEntity);
    const transaction = transactionRepo.create(data);
    return transactionRepo.save(transaction);
  }

  async getUserCreditHistory(
    targetUserId: string,
    page: number,
    limit: number,
  ): Promise<{ data: CreditTransactionEntity[]; total: number }> {
    try {
      const [data, total] = await this.creditTransactionRepository.findAndCount(
        {
          where: { targetUserId: parseInt(targetUserId) },
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
  // async getAllCreditTransactions(
  //   page: number,
  //   limit: number,
  //   filters?: {
  //     startDate?: Date;
  //     endDate?: Date;
  //     action?: CreditTransactionAction;
  //   },
  // ): Promise<{ data: CreditTransactionEntity[]; total: number }> {
  //   try {
  //     const query =
  //       this.creditTransactionRepository.createQueryBuilder('transaction');

  //     if (filters?.startDate) {
  //       query.andWhere('transaction.createdAt >= :startDate', {
  //         startDate: filters.startDate,
  //       });
  //     }
  //     if (filters?.endDate) {
  //       query.andWhere('transaction.createdAt <= :endDate', {
  //         endDate: filters.endDate,
  //       });
  //     }
  //     if (filters?.action) {
  //       query.andWhere('transaction.action = :action', {
  //         action: filters.action,
  //       });
  //     }

  //     query
  //       .orderBy('transaction.createdAt', 'DESC')
  //       .skip((page - 1) * limit)
  //       .take(limit);

  //     const [data, total] = await query.getManyAndCount();
  //     return { data, total };
  //   } catch (error) {
  //     this.logger.error(
  //       `Error getting all credit transactions: ${error.message}`,
  //       error.stack,
  //       'CreditService',
  //     );
  //     throw error;
  //   }
  // }
  async findTransactionByGatewayIdAndUser(
    gatewayTransactionId: string,
    targetUserId: number,
  ): Promise<CreditTransactionEntity | null> {
    this.logger.log(
      `Finding transaction by gatewayId: ${gatewayTransactionId} for user: ${targetUserId}`,
      'CreditService',
    );
    return this.creditTransactionRepository.findOne({
      where: {
        gatewayTransactionId,
        targetUserId: targetUserId, // Asegurar que la transacción pertenezca al usuario
        action: CreditTransactionAction.PURCHASE_SUCCESS, // Solo nos interesan las compras exitosas
      },
    });
  }
  async getAllCreditTransactions(
    queryDto: GetAllCreditTransactionsDto,
  ): Promise<{
    data: CreditTransactionEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      page = 1, // Usar defaults del DTO
      limit = 10,
      startDate,
      endDate,
      action,
      targetUserId, // Añadido para filtro
    } = queryDto;

    const skip = (page - 1) * limit;

    // Construir objeto 'where' para TypeORM dinámicamente
    const where: FindOptionsWhere<CreditTransactionEntity> = {};

    if (targetUserId) {
      // Asumiendo que targetUserId en la entidad es del mismo tipo que el enviado
      // Si targetUserId en la entidad es number y en DTO string, necesitarías parseInt
      where.targetUserId = parseInt(targetUserId);
    }
    if (action) {
      where.action = action;
    }
    if (startDate && endDate) {
      where.createdAt = Between(
        new Date(startDate),
        new Date(endDate + 'T23:59:59.999Z'),
      ); // Incluir todo el día de endDate
    } else if (startDate) {
      where.createdAt = MoreThanOrEqual(new Date(startDate));
    } else if (endDate) {
      where.createdAt = LessThanOrEqual(new Date(endDate + 'T23:59:59.999Z'));
    }

    this.logger.log(
      `Querying credit transactions with where: ${JSON.stringify(where)}, skip: ${skip}, take: ${limit}`,
      'CreditService',
    );

    try {
      const [data, total] = await this.creditTransactionRepository.findAndCount(
        {
          where,
          relations: ['targetUser', 'adminUser', 'creditPackage'], // Cargar relaciones para mostrar nombres
          order: { createdAt: 'DESC' }, // Orden por defecto, o podrías tomarlo del DTO
          skip: skip,
          take: limit,
        },
      );

      // Mapear para asegurar que solo se devuelven los campos necesarios y con formato
      // Esto es opcional, pero bueno para controlar la respuesta.
      const formattedData = data.map((tx) => ({
        ...tx,
        targetUser: tx.targetUser
          ? {
              id: tx.targetUser.id,
              name: tx.targetUser.name,
              email: tx.targetUser.email,
            }
          : undefined,
        adminUser: tx.adminUser
          ? { id: tx.adminUser.id, name: tx.adminUser.name }
          : undefined,
        creditPackage: tx.creditPackage
          ? { id: tx.creditPackage.id, name: tx.creditPackage.name }
          : undefined,
      }));

      return {
        data: formattedData as any, // Castear si es necesario después del mapeo
        total,
        page: Number(page), // Asegurar que sea número
        limit: Number(limit), // Asegurar que sea número
      };
    } catch (error) {
      this.logger.error(
        `Error fetching all credit transactions: ${error.message}`,
        error.stack,
        'CreditService',
      );
      throw error; // Relanzar para que el ExceptionHandler global lo tome
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

      if (user.creditBalance < amount) {
        throw new BadRequestException('Insufficient credits for this order');
      }

      const transaction = await this.recordTransaction({
        action: CreditTransactionAction.USAGE_RESOLUTION,
        amount: -amount,
        targetUserId: userId,
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
