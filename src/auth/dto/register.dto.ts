import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {

  @IsString()
  @ApiProperty({
    name: 'name',
    type: String,
    required: false
  })
  name: string;

  @IsEmail()
  @ApiProperty({
    name: 'email',
    type: String,
    required: false
  })
  email: string;

  @MinLength(4)
  @MaxLength(12)
  @ApiProperty({
    name: 'password',
    type: String,
    required: false
  })
  password: string;
}

