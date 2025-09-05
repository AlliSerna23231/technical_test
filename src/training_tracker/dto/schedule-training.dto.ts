import { IsUUID, IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ScheduleTrainingDto {

  @IsDateString()
  @ApiProperty({
    type: String,
    name: 'scheduledDate',
    description: 'Fecha programada para el entrenamiento (formato ISO 8601)',
  })
  scheduledDate: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    name: 'scheduledTime',
    description: 'Hora programada para el entrenamiento (opcional)',
    required: false,
  })
  scheduledTime?: string;
}
