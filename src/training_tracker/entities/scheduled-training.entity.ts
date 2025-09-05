import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseColumns } from '../../common/interfaces/base-columns.entity';
import {TrainingPlan} from './training-plans.entity'
import { TrainingStatus } from '../enum/training-status.enum';


@Entity('scheduled_trainings')
export class ScheduledTraining extends BaseColumns {

  @Column({ type: 'timestamp', nullable: true })
  scheduledDate: Date;

  @Column({ type: 'time', nullable: true })
  scheduledTime: string;

  @Column({
    type: 'enum',
    enum: TrainingStatus,
    default: TrainingStatus.PENDING,
  })
  status: TrainingStatus;

  @ManyToOne(() => TrainingPlan, trainingPlan => trainingPlan.scheduledTrainings)
  trainingPlan: TrainingPlan;
}
