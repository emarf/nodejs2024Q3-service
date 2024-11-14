import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Injectable()
export class TracksService {
  constructor(private prismaService: PrismaService) {}

  async create({ name, artistId, albumId, duration }: CreateTrackDto) {
    try {
      if (artistId) {
        const artist = await this.prismaService.artist.findUnique({
          where: { id: artistId },
        });

        if (!artist) {
          throw new NotFoundException('Artist not found');
        }
      }

      if (albumId) {
        const album = await this.prismaService.album.findUnique({
          where: { id: albumId },
        });

        if (!album) {
          throw new NotFoundException('Album not found');
        }
      }

      const track = {
        name,
        artistId,
        albumId,
        duration,
      };

      return await this.prismaService.track.create({
        data: track,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to create track');
    }
  }

  async findAll() {
    try {
      return await this.prismaService.track.findMany();
    } catch {
      throw new InternalServerErrorException('Failed to get tracks');
    }
  }

  async findOne(id: string) {
    try {
      const track = await this.prismaService.track.findUnique({
        where: { id },
      });

      if (!track) {
        throw new NotFoundException('Track not found');
      }

      return track;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to get track');
    }
  }

  async update(
    id: string,
    { name, artistId, albumId, duration }: UpdateTrackDto,
  ) {
    try {
      const track = await this.prismaService.track.findUnique({
        where: { id },
      });

      if (!track) {
        throw new NotFoundException('Track not found');
      }

      if (artistId) {
        const artist = await this.prismaService.artist.findUnique({
          where: { id: artistId },
        });

        if (!artist) {
          throw new NotFoundException('Artist not found');
        }
      }

      if (albumId) {
        const album = await this.prismaService.album.findUnique({
          where: { id: albumId },
        });

        if (!album) {
          throw new NotFoundException('Album not found');
        }
      }

      return await this.prismaService.track.update({
        where: { id },
        data: {
          name,
          artistId,
          albumId,
          duration,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to update track');
    }
  }

  async remove(id: string) {
    try {
      const track = await this.prismaService.track.findUnique({
        where: { id },
      });

      if (!track) {
        throw new NotFoundException('Track not found');
      }

      await this.prismaService.track.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to delete track');
    }
  }
}
