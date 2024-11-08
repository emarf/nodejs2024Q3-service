import { IsBoolean, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateArtistDto } from './create-artist.dto';

export class UpdateArtistDto extends PartialType(CreateArtistDto) {
  @IsString()
  name: string;
  @IsBoolean()
  grammy: boolean;
}
