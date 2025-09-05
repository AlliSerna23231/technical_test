import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateTrainingPlanDto } from './training-create.dto';
import { Type } from "class-transformer";
import { UpdateExerciseDto } from './update-exercise.dto';


export class UpdateTrainingPlanDto extends CreateTrainingPlanDto {

  @ApiPropertyOptional({
    name: 'name',
    type: String,
    required: false
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    name: 'comment',
    type: String,
    required: false
  })
  @IsOptional()
  @IsString()
  comment?: string;

    @ApiProperty({
      type: [UpdateExerciseDto],
      description: 'Lista de ejercicios que forman parte del plan',
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateExerciseDto)
    exercises: UpdateExerciseDto[];
}