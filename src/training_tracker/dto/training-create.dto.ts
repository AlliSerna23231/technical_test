import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { ExerciseDto } from './exercise.dto';
import { ApiProperty } from "@nestjs/swagger";

export class CreateTrainingPlanDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    name: 'name',
    type: String,
    required: false
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    name: 'description',
    type: String,
    required: false
  })
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExerciseDto)
  @ApiProperty({
    name: 'exercises',
    type: ExerciseDto,
    required: false
  })
  exercises: ExerciseDto[];
}