import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    try {
      const artists = await this.prismaService.favoriteArtists.findMany({
        include: { artist: true },
      });
      const albums = await this.prismaService.favoriteAlbums.findMany({
        include: { album: true },
      });
      const tracks = await this.prismaService.favoriteTracks.findMany({
        include: { track: true },
      });

      return {
        artists: artists.map(({ artist }) => artist),
        albums: albums.map(({ album }) => album),
        tracks: tracks.map(({ track }) => track),
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to get favorites');
    }
  }

  async addTrack(trackId: string) {
    try {
      const track = await this.prismaService.track.findUnique({
        where: { id: trackId },
      });

      if (!track) {
        throw new UnprocessableEntityException('Track does not exist');
      }

      await this.prismaService.favoriteTracks.create({
        data: { trackId },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to add track');
    }
  }

  async addAlbum(albumId: string) {
    try {
      const album = await this.prismaService.album.findUnique({
        where: { id: albumId },
      });

      if (!album) {
        throw new UnprocessableEntityException('Album does not exist');
      }

      await this.prismaService.favoriteAlbums.create({
        data: { albumId },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to add album');
    }
  }

  async addArtist(artistId: string) {
    try {
      const artist = await this.prismaService.artist.findUnique({
        where: { id: artistId },
      });

      if (!artist) {
        throw new UnprocessableEntityException('Artist does not exist');
      }

      await this.prismaService.favoriteArtists.create({
        data: { artistId },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to add artist');
    }
  }

  async removeTrackFromFavorites(trackId: string) {
    try {
      const existingTrackId = await this.prismaService.favoriteTracks.findFirst(
        { where: { trackId } },
      );

      if (!existingTrackId) {
        throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
      }

      await this.prismaService.favoriteTracks.delete({
        where: { trackId },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to remove track');
    }
  }

  async removeAlbumFromFavorites(albumId: string) {
    try {
      const existingAlbumId = await this.prismaService.favoriteAlbums.findFirst(
        { where: { albumId } },
      );

      if (!existingAlbumId) {
        throw new NotFoundException('Album not found');
      }

      await this.prismaService.favoriteAlbums.delete({
        where: { albumId },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to remove album');
    }
  }

  async removeArtistFromFavorites(artistId: string) {
    try {
      const existingArtistId =
        await this.prismaService.favoriteArtists.findFirst({
          where: { artistId },
        });

      if (!existingArtistId) {
        throw new NotFoundException('Artist not found');
      }

      await this.prismaService.favoriteArtists.delete({
        where: { artistId },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to remove artist');
    }
  }
}
