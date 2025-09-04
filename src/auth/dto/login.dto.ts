import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
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
