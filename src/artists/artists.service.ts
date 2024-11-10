import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { AlbumsService } from 'src/albums/albums.service';
import { Artist } from 'src/artists/interfaces/artists.interface';
import { TracksService } from 'src/tracks/tracks.service';
import { v4 as uuid } from 'uuid';
import { FavoritesService } from './../favorites/favorites.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ArtistsService {
  constructor(
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
    private readonly databaseService: DatabaseService,
  ) {}

  async create(createArtistDto: CreateArtistDto) {
    const artist = {
      id: uuid(),
      ...createArtistDto,
    };

    try {
      await this.databaseService.create<Artist>('artists', artist);
      return artist;
    } catch {
      throw new HttpException(
        'Failed to create artist',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      return await this.databaseService.getAll<Artist>('artists');
    } catch {
      throw new HttpException(
        'Failed to get all artists',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      const artist = await this.databaseService.getOne<Artist>('artists', id);
      if (!artist) {
        throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
      }

      return artist;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Failed to get artist',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    try {
      const artist = await this.databaseService.getOne<Artist>('artists', id);

      if (!artist) {
        throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
      }

      const updatedArtist = {
        ...artist,
        ...updateArtistDto,
      };

      await this.databaseService.update<Artist>('artists', id, updatedArtist);
      return updatedArtist;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Failed to update artist',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      const artist = await this.databaseService.getOne<Artist>('artists', id);

      if (!artist) {
        throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
      }

      await this.tracksService.removeArtistFromTracks(id);
      await this.albumsService.removeArtistFromAlbum(id);
      await this.favoritesService.removeArtist(id);

      await this.databaseService.delete('artists', id);
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        'Failed to delete artist',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
