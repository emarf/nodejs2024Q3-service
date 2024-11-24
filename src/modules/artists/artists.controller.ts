import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { LoggerService } from 'src/modules/logger/logger.service';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { StatusCodes } from 'http-status-codes';

@Controller('artist')
export class ArtistsController {
  constructor(
    private readonly artistsService: ArtistsService,
    private readonly loggerService: LoggerService,
  ) {}

  @Post()
  create(@Body() createArtistDto: CreateArtistDto) {
    this.loggerService.log(
      `Creating artist ${createArtistDto.name}`,
      ArtistsController.name,
    );
    return this.artistsService.create(createArtistDto);
  }

  @Get()
  findAll() {
    this.loggerService.log('Getting all artists', ArtistsController.name);
    return this.artistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    this.loggerService.log(
      `Getting artist by id ${id}`,
      ArtistsController.name,
    );
    return this.artistsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    this.loggerService.log(
      `Updating artist by id ${id}`,
      ArtistsController.name,
    );
    return this.artistsService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    this.loggerService.log(
      `Deleting artist by id ${id}`,
      ArtistsController.name,
    );
    return this.artistsService.remove(id);
  }
}
