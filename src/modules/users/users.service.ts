import {
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/modules/users/interfaces/user.interface';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  private sanitizeUser(user: User) {
    const { password, createdAt, updatedAt, ...rest } = user;

    return {
      ...rest,
      createdAt: new Date(createdAt).getTime(),
      updatedAt: new Date(updatedAt).getTime(),
    };
  }

  async create(createUserDto: CreateUserDto) {
    const expandedUserDto = {
      ...createUserDto,
    };

    try {
      const user = await this.prismaService.user.create({
        data: expandedUserDto,
      });

      return this.sanitizeUser(user);
    } catch {
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findAll() {
    try {
      return await this.prismaService.user.findMany();
    } catch {
      throw new InternalServerErrorException('Failed to get all users');
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return this.sanitizeUser(user);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to get user');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.password !== updateUserDto.oldPassword) {
        throw new ForbiddenException('Old password is incorrect');
      }

      const updatedUser = await this.prismaService.user.update({
        where: { id },
        data: {
          password: updateUserDto.newPassword,
          version: user.version + 1,
        },
      });

      return this.sanitizeUser(updatedUser);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async remove(id: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.prismaService.user.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
