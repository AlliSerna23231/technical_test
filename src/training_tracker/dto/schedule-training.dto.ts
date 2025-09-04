import { IsUUID, IsString } from 'class-validator';

export class ScheduleTrainingDto {
  @IsUUID()
  trainingPlanId: string;

  @IsString()
  scheduledDate: string;
}
