import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { LoggerService } from 'src/modules/logger/logger.service';
import { StatusCodes } from 'http-status-codes';

@Controller('favs')
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
    private readonly loggerService: LoggerService,
  ) {}

  @Get()
  findAll() {
    this.loggerService.log('Getting all favorites', FavoritesController.name);
    return this.favoritesService.findAll();
  }

  @Post('track/:id')
  addTrack(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    this.loggerService.log(
      `Adding track ${id} to favorites`,
      FavoritesController.name,
    );
    return this.favoritesService.addTrack(id);
  }

  @Post('album/:id')
  addAlbum(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    this.loggerService.log(
      `Adding album ${id} to favorites`,
      FavoritesController.name,
    );
    return this.favoritesService.addAlbum(id);
  }

  @Post('artist/:id')
  addArtist(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    this.loggerService.log(
      `Adding artist ${id} to favorites`,
      FavoritesController.name,
    );
    return this.favoritesService.addArtist(id);
  }

  @Delete('track/:id')
  @HttpCode(StatusCodes.NO_CONTENT)
  removeTrack(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    this.loggerService.log(
      `Removing track ${id} from favorites`,
      FavoritesController.name,
    );
    return this.favoritesService.removeTrackFromFavorites(id);
  }

  @Delete('album/:id')
  @HttpCode(StatusCodes.NO_CONTENT)
  removeAlbum(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    this.loggerService.log(
      `Removing album ${id} from favorites`,
      FavoritesController.name,
    );
    return this.favoritesService.removeAlbumFromFavorites(id);
  }

  @Delete('artist/:id')
  @HttpCode(StatusCodes.NO_CONTENT)
  removeArtist(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    this.loggerService.log(
      `Removing artist ${id} from favorites`,
      FavoritesController.name,
    );
    return this.favoritesService.removeArtistFromFavorites(id);
  }
}
