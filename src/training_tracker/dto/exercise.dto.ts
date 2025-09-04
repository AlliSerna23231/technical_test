import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ExerciseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'name',
    type: String,
    required: false
  })
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    name: 'repetitions',
    type: Number,
    required: false
  })
  repetitions: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    name: 'sets',
    type: Number,
    required: false
  })
  sets: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    name: 'weight',
    type: Number,
    required: false
  })
  weight?: number;
}