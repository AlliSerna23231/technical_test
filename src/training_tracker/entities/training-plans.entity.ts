import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Exercise } from './exercise.entity';
import { ScheduledTraining } from './scheduled-training.entity';
import { BaseColumns } from '../../common/interfaces/base-columns.entity';

@Entity('training_plans')
export class TrainingPlan extends BaseColumns {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  comment: string;

  @ManyToOne(() => User, user => user.trainingPlans, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Exercise, exercise => exercise.trainingPlan, { cascade: true })
  exercises: Exercise[];

  @OneToMany(() => ScheduledTraining, scheduled => scheduled.trainingPlan)
  scheduledTrainings: ScheduledTraining[];
}
