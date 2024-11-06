import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/users/interfaces/user.interface';
import { v4 as uuid } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  private sanitizeUser(user: User) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  create(createUserDto: CreateUserDto) {
    const user = {
      id: uuid(),
      ...createUserDto,
      version: 1,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };

    this.users.push(user);
    return this.sanitizeUser(user);
  }

  findAll() {
    return this.users.map((user) => this.sanitizeUser(user));
  }

  findOne(id: string) {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return this.sanitizeUser(user);
  }


  update(id: string, updateUserDto: UpdateUserDto) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const user = this.users[index];
    if (user.password !== updateUserDto.oldPassword) {
      throw new HttpException('Old password is incorrect', HttpStatus.FORBIDDEN);
    }

    const updatedUser = {
      ...user,
      password: updateUserDto.newPassword,
      version: user.version + 1,
      updatedAt: new Date().getTime(),
    };

    this.users[index] = updatedUser;
    return this.sanitizeUser(updatedUser);
  }

  remove(id: string) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    this.users.splice(index, 1);
  }
}
