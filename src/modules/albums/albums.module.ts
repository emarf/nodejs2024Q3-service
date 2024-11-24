import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { LoggerService } from 'src/modules/logger/logger.service';

@Module({
  imports: [PrismaModule],
  controllers: [AlbumsController],
  providers: [AlbumsService, LoggerService],
  exports: [AlbumsService],
})
export class AlbumsModule {}
