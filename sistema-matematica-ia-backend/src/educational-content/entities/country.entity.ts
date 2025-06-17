import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { EducationalStageEntity } from './educational-stage.entity';

@Entity('countries')
export class CountryEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 3, unique: true })
  code: string; // ISO 3166-1 alpha-3 code (e.g., 'PER', 'USA', 'MEX')

  @Column({ type: 'varchar', length: 255, nullable: true })
  flag_url: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'int', default: 0 })
  display_order: number;

  // Relationships
  @OneToMany(() => EducationalStageEntity, (stage) => stage.country)
  educational_stages: EducationalStageEntity[];
}
