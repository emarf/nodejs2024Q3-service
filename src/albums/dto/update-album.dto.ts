import { PartialType } from '@nestjs/mapped-types';
import { CreateAlbumDto } from './create-album.dto';
import { IsNumber, IsString } from 'class-validator';

export class UpdateAlbumDto extends PartialType(CreateAlbumDto) {
  @IsString()
  name: string;
  @IsNumber()
  year: number;
  @IsString()
  artistId: string | null;
}
