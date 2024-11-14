import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistsService {
  constructor(private prismaService: PrismaService) {}

  async create(createArtistDto: CreateArtistDto) {
    try {
      const artist = await this.prismaService.artist.create({
        data: createArtistDto,
      });

      return artist;
    } catch {
      throw new InternalServerErrorException('Failed to create artist');
    }
  }

  async findAll() {
    try {
      return await this.prismaService.artist.findMany();
    } catch {
      throw new InternalServerErrorException('Failed to get all artists');
    }
  }

  async findOne(id: string) {
    try {
      const artist = await this.prismaService.artist.findUnique({
        where: { id },
      });

      if (!artist) {
        throw new NotFoundException('Artist not found');
      }

      return artist;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to get artist');
    }
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    try {
      const artist = await this.prismaService.artist.findUnique({
        where: { id },
      });

      if (!artist) {
        throw new NotFoundException('Artist not found');
      }

      const updatedArtist = {
        ...artist,
        ...updateArtistDto,
      };

      await this.prismaService.artist.update({
        where: { id },
        data: updatedArtist,
      });

      return updatedArtist;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to update artist');
    }
  }

  async remove(id: string) {
    try {
      const artist = await this.prismaService.artist.findUnique({
        where: { id },
      });

      if (!artist) {
        throw new NotFoundException('Artist not found');
      }

      await this.prismaService.artist.delete({ where: { id } });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to delete artist');
    }
  }
}
