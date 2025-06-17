import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    type: 'timestamp', // <--- CAMBIO AQUÍ: Usar 'timestamp' para MySQL
    default: () => 'CURRENT_TIMESTAMP(6)',
    name: 'created_at', // Asegurar snake_case si es necesario
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp', // <--- CAMBIO AQUÍ: Usar 'timestamp' para MySQL
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    name: 'updated_at', // Asegurar snake_case si es necesario
  })
  updatedAt: Date;
}
