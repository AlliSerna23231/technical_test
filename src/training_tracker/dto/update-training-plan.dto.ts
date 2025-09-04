import { IsString, IsOptional, IsUUID } from 'class-validator';
import {CreateTrainingPlanDto} from './training-create.dto'

export class UpdateTrainingPlanDto  extends CreateTrainingPlanDto{
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  comment?: string;
}
