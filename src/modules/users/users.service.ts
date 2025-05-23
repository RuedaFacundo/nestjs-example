import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { UserDto } from './dto/user-dto';

@Injectable()
export class UsersService {
  private _users: UserDto[];

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUser(user: UserDto) {
    const existingUser = await this.userModel.findOne({ email: user.email });

    if (existingUser) {
      throw new ConflictException(
        `El usuario con email ${user.email} ya existe`,
      );
    }

    const createdUser = new this.userModel({
      ...user,
      birthdate: user.birthDate,
    });

    await createdUser.save();

    return 'Usuario creado correctamente';
  }

  async getUsers(start?: string): Promise<User[]> {
    if (!start) {
      return this.userModel.find().exec();
    }

    return this.userModel
      .find({
        name: { $regex: `^${start}`, $options: 'i' },
      })
      .exec();
  }

  async updateUser(userDto: UserDto): Promise<string> {
    const updated = await this.userModel.updateOne(
      { email: userDto.email },
      {
        name: userDto.name,
        email: userDto.email,
        birthdate: userDto.birthDate,
      },
    );

    if (updated.matchedCount === 0) {
      await this.createUser(userDto);
    }

    return 'Usuario actualizado correctamente';
  }

  async deleteUser(email: string): Promise<string> {
    const deleted = await this.userModel.deleteOne({ email: email });
    return deleted.deletedCount > 0
      ? 'Usuario eliminado correctamente'
      : 'No se pudo eliminar el usuario';
  }
}
