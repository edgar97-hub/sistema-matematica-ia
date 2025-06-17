import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { EducationalStageEntity } from './educational-stage.entity';

@Entity('educational_subdivisions')
export class EducationalSubdivisionEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int' })
  display_order: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  // Foreign Keys
  @Column({ type: 'int' })
  educational_stage_id: number;

  // Relationships
  @ManyToOne(() => EducationalStageEntity, stage => stage.educational_subdivisions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'educational_stage_id' })
  educational_stage: EducationalStageEntity;
}