import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Album } from 'src/albums/interfaces/album.interface';
import { DatabaseService } from 'src/database/database.service';
import { FavoritesService } from 'src/favorites/favorites.service';
import { TracksService } from 'src/tracks/tracks.service';
import { v4 as uuid } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumsService {
  constructor(
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
    private readonly databaseService: DatabaseService,
  ) {}

  async create({ name, year, artistId }: CreateAlbumDto) {
    try {
      if (artistId) {
        const artist = await this.databaseService.getOne('artists', artistId);

        if (!artist) {
          throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
        }
      }

      const album = {
        id: uuid(),
        name,
        year,
        artistId,
      };

      return await this.databaseService.create<Album>('albums', album);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Failed to create album',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      return await this.databaseService.getAll<Album>('albums');
    } catch {
      throw new HttpException(
        'Failed to get all artists',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      const album = await this.databaseService.getOne<Album>('albums', id);

      if (!album) {
        throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
      }

      return album;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Failed to get album',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, { name, year, artistId }: UpdateAlbumDto) {
    try {
      const album = await this.databaseService.getOne<Album>('albums', id);

      if (!album) {
        throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
      }

      if (artistId) {
        const artist = await this.databaseService.getOne('artists', artistId);

        if (!artist) {
          throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
        }
      }

      return await this.databaseService.update<Album>('albums', id, {
        name,
        year,
        artistId,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Failed to update album',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      const album = await this.databaseService.getOne<Album>('albums', id);

      if (!album) {
        throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
      }

      await this.tracksService.removeAlbumFromTracks(id);
      await this.favoritesService.removeAlbum(id);
      await this.databaseService.delete('albums', id);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Failed to delete album',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeArtistFromAlbum(artistId: string) {
    const albums = await this.databaseService.getAll<Album>('albums');

    for (const album of albums) {
      if (album.artistId === artistId) {
        await this.databaseService.update<Album>('albums', album.id, {
          artistId: null,
        });
      }
    }
  }
}
