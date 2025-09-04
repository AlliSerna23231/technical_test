import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingTrackerService } from './training_tracker.service';
import { TrainingTrackerController } from './training_tracker.controller';
import { TrainingPlan } from './entities/training-plans.entity';
import { Exercise } from './entities/exercise.entity';
import { ScheduledTraining } from './entities/scheduled-training.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrainingPlan, Exercise, ScheduledTraining]), 
  ],
  controllers: [TrainingTrackerController],
  providers: [TrainingTrackerService],
})
export class TrainingTrackerModule {}
