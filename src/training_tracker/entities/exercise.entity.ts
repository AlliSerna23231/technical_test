import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseColumns } from '../../common/interfaces/base-columns.entity';
import { TrainingPlan } from './training-plans.entity';

@Entity('exercises')
export class Exercise extends BaseColumns {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'numeric' })
  repetitions: number;

  @Column({ type: 'numeric' })
  sets: number;

  @Column({ type: 'numeric' })
  weight: number;

  @ManyToOne(() => TrainingPlan, trainingPlan => trainingPlan.exercises, { onDelete: 'CASCADE' })
  trainingPlan: TrainingPlan;
} 