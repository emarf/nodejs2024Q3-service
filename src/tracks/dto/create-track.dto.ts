import { IsNumber, IsString } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  name: string;
  artistId: string | null;
  albumId: string | null;
  @IsNumber()
  duration: number;
}
