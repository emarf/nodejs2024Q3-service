import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ name, year, artistId }: CreateAlbumDto) {
    try {
      if (artistId) {
        const artist = await this.prismaService.artist.findUnique({
          where: { id: artistId },
        });

        if (!artist) {
          throw new NotFoundException('Artist not found');
        }
      }

      return await this.prismaService.album.create({
        data: {
          name,
          year,
          artistId,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to create album');
    }
  }

  async findAll() {
    try {
      // return await this.databaseService.getAll<Album>(DB_Field.ALBUMS);
      return await this.prismaService.album.findMany();
    } catch {
      throw new InternalServerErrorException('Failed to get all artists');
    }
  }

  async findOne(id: string) {
    try {
      const album = await this.prismaService.album.findUnique({
        where: { id },
      });

      if (!album) {
        throw new NotFoundException('Album not found');
      }

      return album;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to get album');
    }
  }

  async update(id: string, { name, year, artistId }: UpdateAlbumDto) {
    try {
      const album = await this.prismaService.album.findUnique({
        where: { id },
      });

      if (!album) {
        throw new NotFoundException('Album not found');
      }

      if (artistId) {
        const artist = await this.prismaService.artist.findUnique({
          where: { id: artistId },
        });

        if (!artist) {
          throw new NotFoundException('Artist not found');
        }
      }

      return this.prismaService.album.update({
        where: { id },
        data: {
          name,
          year,
          artistId,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to update album');
    }
  }

  async remove(id: string) {
    try {
      const album = await this.prismaService.album.findUnique({
        where: { id },
      });

      if (!album) {
        throw new NotFoundException('Album not found');
      }

      await this.prismaService.album.delete({ where: { id } });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to delete album');
    }
  }
}
