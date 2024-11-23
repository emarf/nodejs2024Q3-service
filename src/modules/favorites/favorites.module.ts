import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { LoggerService } from 'src/modules/logger/logger.service';

@Module({
  imports: [PrismaModule],
  controllers: [FavoritesController],
  providers: [FavoritesService, LoggerService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
