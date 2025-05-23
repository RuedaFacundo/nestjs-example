import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserDto } from './dto/user-dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { ParseDatePipe } from 'src/pipes/parse-date/parse-date.pipe';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/users')
@ApiTags('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  @ApiOperation({
    description: 'Crea un usuario.',
  })
  @ApiBody({
    description:
      'Crea un usuario, mediante un UserDto. Devuelve true si se realiza con exito.',
    type: UserDto,
    examples: {
      ejemplo1: {
        value: {
          id: 1,
          name: 'Facundo',
          email: 'email@gmail.com',
          birthDate: '1992-04-22',
        },
      },
    },
  })
  createUser(
    @Body('birthDate', ParseDatePipe) birthDate: Date,
    @Body() user: UserDto,
  ) {
    user.birthDate = birthDate;
    return this.userService.createUser(user);
  }

  @Get()
  @ApiQuery({
    name: 'start',
    required: false,
    type: 'string',
    description:
      'Si se proporciona, devolvera todos los usuarios que comiencen con esa palabra',
  })
  @ApiOperation({
    description:
      'Devuelve los usuarios que comiencen con esa palabra. Sino se proporcionan, se devolverán todos los usuarios.',
  })
  getUsers(@Query('start') start: string) {
    return this.userService.getUsers(start);
  }

  @Put()
  @ApiOperation({
    description:
      'Actualiza un usuario en el caso de que exista el id, en caso contrario, creará un nuevo usuario. Devuelve true si se realiza con exito.',
  })
  @ApiBody({
    description: 'Edita un usuario usando un UserDto',
    type: UserDto,
    examples: {
      ejemplo1: {
        value: {
          id: 5,
          name: 'Fernando',
          email: 'email@gmail.com',
          birthDate: '1990-02-05',
        },
      },
    },
  })
  updateUser(@Body() user: UserDto) {
    return this.userService.updateUser(user);
  }

  @Delete('/:email')
  @ApiParam({
    name: 'email',
    type: 'string',
    description: 'Email del usuario a borrar',
  })
  @ApiOperation({
    description:
      'Elimina un usuario en el caso de que exista el email. Devuelve true si se realiza con exito.',
  })
  deleteUser(@Param('email') email: string) {
    return this.userService.deleteUser(email);
  }
}
