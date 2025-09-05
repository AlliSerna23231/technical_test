import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TrainingTrackerService } from './training_tracker.service';
import { TrainingStatus } from './enum/training-status.enum';

@Injectable()
export class TrainingCronService {
  constructor(private readonly trainingService: TrainingTrackerService) {}

  // Corre cada minuto
  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    console.log('Verificando entrenamientos pendientes...');
    const trainings = await this.trainingService.getPendingTrainings();

    for (const training of trainings) {
      const currentTime = new Date();
      const scheduledDate = new Date(`${training.scheduledDate}T${training.scheduledTime}`);
      
      if (currentTime >= scheduledDate) {
        await this.trainingService.updateTrainingStatus(training.id, TrainingStatus.ACTIVE);
        console.log(`Entrenamiento ${training.id} activado.`);
      }
    }
  }
}
