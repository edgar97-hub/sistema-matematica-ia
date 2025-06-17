import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { AdminUserEntity } from '../../admin-users/entities/admin-user.entity';
import { CreditPackageEntity } from './credit-package.entity';

export enum CreditTransactionAction {
  PURCHASE_SUCCESS = 'purchase_success',
  USAGE_RESOLUTION = 'usage_resolution',
  WELCOME_BONUS = 'welcome_bonus',
  ADMIN_ADJUSTMENT = 'admin_adjustment'
}

@Entity('credit_transactions')
export class CreditTransactionEntity extends BaseEntity {
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'target_user_id' })
  targetUser: UserEntity;

  @Column({ type: 'int' })
  target_user_id: number;

  @ManyToOne(() => AdminUserEntity, { nullable: true })
  @JoinColumn({ name: 'admin_user_id' })
  adminUser: AdminUserEntity;

  @Column({ type: 'int', nullable: true })
  admin_user_id: number;

  @Column({ type: 'enum', enum: CreditTransactionAction })
  action: CreditTransactionAction;

  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'int' })
  balance_before: number;

  @Column({ type: 'int' })
  balance_after: number;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  payment_gateway: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  gateway_transaction_id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  gateway_transaction_status: string;

  @Column({ type: 'json', nullable: true })
  gateway_response_payload: any;

  @ManyToOne(() => CreditPackageEntity, { nullable: true })
  @JoinColumn({ name: 'credit_package_id' })
  creditPackage: CreditPackageEntity;

  @Column({ type: 'int', nullable: true })
  credit_package_id: number;
}