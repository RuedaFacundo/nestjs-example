import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UserDto {
  @ApiProperty({
    name: 'id',
    type: Number,
    description: 'Identificador del usuario',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    name: 'name',
    type: String,
    description: 'Nombre del usuario',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    name: 'email',
    type: String,
    description: 'Email del usuario',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    name: 'birthDate',
    type: Date,
    description: 'Fecha de nacimiento del usuario',
    required: true,
  })
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  birthDate: Date;
}
