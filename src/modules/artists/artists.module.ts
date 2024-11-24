import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';
import { LoggerService } from 'src/modules/logger/logger.service';

@Module({
  imports: [PrismaModule],
  controllers: [ArtistsController],
  providers: [ArtistsService, LoggerService],
  exports: [ArtistsService],
})
export class ArtistsModule {}
