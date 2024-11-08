import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from 'src/artists/interfaces/artists.interface';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ArtistsService {
  private readonly artists: Artist[] = [];

  create(createArtistDto: CreateArtistDto) {
    const artist = {
      id: uuid(),
      ...createArtistDto,
    };

    this.artists.push(artist);
    return artist;
  }

  findAll() {
    return this.artists;
  }

  findOne(id: string) {
    const artist = this.artists.find((artist) => artist.id === id);

    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }

    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const index = this.artists.findIndex((user) => user.id === id);

    if (index === -1) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }

    const artist = this.artists[index];

    const updatedArtist = {
      ...artist,
      ...updateArtistDto,
    };

    this.artists[index] = updatedArtist;
    return updatedArtist;
  }

  remove(id: string) {
    const index = this.artists.findIndex((artist) => artist.id === id);

    if (index === -1) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }

    this.artists.splice(index, 1);
  }
}
