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
import { StatusCodes } from 'http-status-codes';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { LoggerService } from 'src/modules/logger/logger.service';

@Controller('album')
export class AlbumsController {
  constructor(
    private readonly albumsService: AlbumsService,
    private readonly loggerService: LoggerService,
  ) {}

  @Post()
  create(@Body() createAlbumDto: CreateAlbumDto) {
    this.loggerService.log(
      `Creating album ${createAlbumDto.name}`,
      AlbumsController.name,
    );
    return this.albumsService.create(createAlbumDto);
  }

  @Get()
  findAll() {
    this.loggerService.log('Getting all albums', AlbumsController.name);
    return this.albumsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    this.loggerService.log(`Getting album by id ${id}`, AlbumsController.name);
    return this.albumsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    this.loggerService.log(`Updating album by id ${id}`, AlbumsController.name);
    return this.albumsService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    this.loggerService.log(`Deleting album by id ${id}`, AlbumsController.name);
    return this.albumsService.remove(id);
  }
}
