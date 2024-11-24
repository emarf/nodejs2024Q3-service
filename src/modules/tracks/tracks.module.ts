import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import { LoggerService } from 'src/modules/logger/logger.service';

@Module({
  imports: [PrismaModule],
  controllers: [TracksController],
  providers: [TracksService, LoggerService],
  exports: [TracksService],
})
export class TracksModule {}
