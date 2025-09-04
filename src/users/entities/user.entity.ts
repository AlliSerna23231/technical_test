import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TrainingPlan } from '../../training_tracker/entities/training-plans.entity';
import { BaseColumns } from '../../common/interfaces/base-columns.entity';

@Entity('users')
export class User extends BaseColumns{
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  name: string;

  @OneToMany(() => TrainingPlan, trainingPlan => trainingPlan.user)
  trainingPlans: TrainingPlan[];
}
