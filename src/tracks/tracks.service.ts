import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from 'src/tracks/interfaces/track.interface';
import { ArtistsService } from 'src/artists/artists.service';
import { AlbumsService } from 'src/albums/albums.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TracksService {
  constructor(
    @Inject(forwardRef(() => ArtistsService))
    private artistsService: ArtistsService,
    @Inject(forwardRef(() => AlbumsService))
    private albumsService: AlbumsService,
  ) {}

  private tracks: Track[] = [];
  create({ name, artistId, albumId, duration }: CreateTrackDto) {
    if (artistId) {
      const artist = this.artistsService.findOne(artistId);
      if (!artist) {
        throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
      }
    }

    if (albumId) {
      const album = this.albumsService.findOne(albumId);
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

    this.tracks.push(track);
    return track;
  }

  findAll() {
    return this.tracks;
  }

  findOne(id: string) {
    const track = this.tracks.find((track) => track.id === id);

    if (!track) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }

    return track;
  }

  update(id: string, { name, artistId, albumId, duration }: UpdateTrackDto) {
    if (artistId) {
      const artist = this.artistsService.findOne(artistId);
      if (!artist) {
        throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
      }
    }

    if (albumId) {
      const album = this.albumsService.findOne(albumId);
      if (!album) {
        throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
      }
    }

    const index = this.tracks.findIndex((track) => track.id === id);

    if (index === -1) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }

    const track = this.tracks[index];
    this.tracks[index] = {
      ...track,
      name,
      artistId,
      albumId,
      duration,
    };

    return this.tracks[index];
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

  remove(id: string) {
    const index = this.tracks.findIndex((track) => track.id === id);
    if (index === -1) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }

    this.tracks.splice(index, 1);
  }
}
