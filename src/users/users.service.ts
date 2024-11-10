import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { User } from 'src/users/interfaces/user.interface';
import { v4 as uuid } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  private sanitizeUser(user: User) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async create(createUserDto: CreateUserDto) {
    const user = {
      id: uuid(),
      ...createUserDto,
      version: 1,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };

    try {
      await this.databaseService.create<User>('users', user);
      return this.sanitizeUser(user);
    } catch {
      throw new HttpException(
        'Failed to create user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      return await this.databaseService.getAll<User>('users');
    } catch (error) {
      throw new HttpException(
        'Failed to get all users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.databaseService.getOne<User>('users', id);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return this.sanitizeUser(user);
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        'Failed to get user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.databaseService.getOne<User>('users', id);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (user.password !== updateUserDto.oldPassword) {
        throw new HttpException(
          'Old password is incorrect',
          HttpStatus.FORBIDDEN,
        );
      }

      const updatedUser = {
        ...user,
        password: updateUserDto.newPassword,
        version: user.version + 1,
        updatedAt: new Date().getTime(),
      };

      await this.databaseService.update<User>('users', id, updatedUser);
      return this.sanitizeUser(updatedUser);
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        'Failed to update user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      const user = await this.databaseService.getOne<User>('users', id);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      await this.databaseService.delete('users', id);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Failed to delete user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
