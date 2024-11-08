import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Album } from 'src/albums/interfaces/album.interface';
import { ArtistsService } from 'src/artists/artists.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AlbumsService {
  constructor(private artistsService: ArtistsService) {}
  private readonly albums: Album[] = [];

  create({ name, year, artistId }: CreateAlbumDto) {
    if (artistId) {
      const artist = this.artistsService.findOne(artistId);

      if (!artist) {
        throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
      }
    }
    const album = {
      id: uuid(),
      name,
      year,
      artistId: null,
    };
    this.albums.push(album);

    return album;
  }

  findAll() {
    return this.albums;
  }

  findOne(id: string) {
    const album = this.albums.find((album) => album.id === id);

    if (!album) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }

    return album;
  }

  update(id: string, { name, year, artistId }: UpdateAlbumDto) {
    if (artistId) {
      const artist = this.artistsService.findOne(artistId);

      if (!artist) {
        throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
      }
    }

    const index = this.albums.findIndex((album) => album.id === id);
    if (index === -1) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }

    const album = this.albums[index];

    const updatedAlbum = {
      ...album,
      name,
      year,
      artistId,
    };
    this.albums[index] = updatedAlbum;
    return updatedAlbum;
  }

  remove(id: string) {
    const index = this.albums.findIndex((album) => album.id === id);
    if (index === -1) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }

    this.albums.splice(index, 1);
  }
}
