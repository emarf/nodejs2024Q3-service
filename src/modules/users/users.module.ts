import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { LoggerService } from 'src/modules/logger/logger.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, LoggerService],
  exports: [UsersService],
})
export class UsersModule {}
