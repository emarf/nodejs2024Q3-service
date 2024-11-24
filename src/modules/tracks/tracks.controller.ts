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
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { TracksService } from './tracks.service';
import { StatusCodes } from 'http-status-codes';

@Controller('track')
export class TracksController {
  constructor(
    private readonly tracksService: TracksService,
    private readonly loggerService: LoggerService,
  ) {}

  @Post()
  create(@Body() createTrackDto: CreateTrackDto) {
    this.loggerService.log(
      `Creating track ${createTrackDto.name}`,
      TracksController.name,
    );
    return this.tracksService.create(createTrackDto);
  }

  @Get()
  findAll() {
    this.loggerService.log('Getting all tracks', TracksController.name);
    return this.tracksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.tracksService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    this.loggerService.log(`Updating track by id ${id}`, TracksController.name);
    return this.tracksService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    this.loggerService.log(`Deleting track by id ${id}`, TracksController.name);
    return this.tracksService.remove(id);
  }
}
