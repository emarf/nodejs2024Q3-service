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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { StatusCodes } from 'http-status-codes';

@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly loggerService: LoggerService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    this.loggerService.log(
      `Creating user ${createUserDto.login}`,
      UsersController.name,
    );
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    this.loggerService.log('Getting all users', UsersController.name);
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    this.loggerService.log(`Getting user by id ${id}`, UsersController.name);
    return this.usersService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    this.loggerService.log(`Updating user by id ${id}`, UsersController.name);
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    this.loggerService.log(`Deleting user by id ${id}`, UsersController.name);
    return this.usersService.remove(id);
  }
}
