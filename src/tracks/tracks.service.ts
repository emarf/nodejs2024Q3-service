import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { FavoritesService } from 'src/favorites/favorites.service';
import { Track } from 'src/tracks/interfaces/track.interface';
import { v4 as uuid } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Injectable()
export class TracksService {
  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
    private databaseService: DatabaseService,
  ) {}

  private tracks: Track[] = [];

  async create({ name, artistId, albumId, duration }: CreateTrackDto) {
    try {
      if (artistId) {
        const artist = await this.databaseService.getOne('artists', artistId);

        if (!artist) {
          throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
        }
      }

      if (albumId) {
        const album = await this.databaseService.getOne('albums', albumId);

        if (!album) {
          throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
        }
      }

      const track = {
        id: uuid(),
        name,
        artistId,
        albumId,
        duration,
      };

      return await this.databaseService.create('tracks', track);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Failed to create track',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      return await this.databaseService.getAll('tracks');
    } catch {
      throw new HttpException(
        'Failed to get tracks',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      const track = await this.databaseService.getOne('tracks', id);

      if (!track) {
        throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
      }

      return track;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Failed to get track',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    { name, artistId, albumId, duration }: UpdateTrackDto,
  ) {
    try {
      const track = await this.databaseService.getOne('tracks', id);

      if (!track) {
        throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
      }

      if (artistId) {
        const artist = await this.databaseService.getOne('artists', artistId);

        if (!artist) {
          throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
        }
      }

      if (albumId) {
        const album = await this.databaseService.getOne('albums', albumId);

        if (!album) {
          throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
        }
      }

      return await this.databaseService.update('tracks', id, {
        name,
        artistId,
        albumId,
        duration,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Failed to update track',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  clearAlbumIds(albumId: string) {
    this.tracks = this.tracks.map((track) => {
      if (track.albumId === albumId) {
        return { ...track, albumId: null };
      }
      return track;
    });
  }

  clearArtistIds(artistId: string) {
    this.tracks = this.tracks.map((track) => {
      if (track.artistId === artistId) {
        return { ...track, artistId: null };
      }
      return track;
    });
  }

  async remove(id: string) {
    try {
      const track = await this.databaseService.getOne('tracks', id);

      if (!track) {
        throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
      }

      await this.favoritesService.removeTrack(id);
      await this.databaseService.delete('tracks', id);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Failed to delete track',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeArtistFromTracks(artistId: string) {
    const tracks = await this.databaseService.getAll<Track>('tracks');

    for (const track of tracks) {
      if (track.artistId === artistId) {
        await this.databaseService.update('tracks', track.id, {
          artistId: null,
        });
      }
    }
  }

  async removeAlbumFromTracks(albumId: string) {
    const tracks = await this.databaseService.getAll<Track>('tracks');

    for (const track of tracks) {
      if (track.albumId === albumId) {
        await this.databaseService.update('tracks', track.id, {
          albumId: null,
        });
      }
    }
  }
}
