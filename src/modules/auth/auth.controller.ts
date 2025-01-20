import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';
import { Public } from 'src/decorators';
import { SignUpDto } from 'src/modules/auth/dto/signup.dto';
import { LocalAuthGuard } from 'src/modules/auth/guards/local-auth.guard';
import { RefreshGuard } from 'src/modules/auth/guards/refresh-auth.guard';
import { LoggerService } from 'src/modules/logger/logger.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly loggerService: LoggerService,
  ) {}

  @Public()
  @Post('signup')
  signup(@Body() singUpDto: SignUpDto) {
    this.loggerService.log('signup', AuthController.name);
    return this.authService.signup(singUpDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(StatusCodes.OK)
  login(@Request() req) {
    this.loggerService.log('login', AuthController.name);
    return this.authService.login(req.user);
  }

  @Public()
  @UseGuards(RefreshGuard)
  @Post('refresh')
  @HttpCode(StatusCodes.OK)
  refresh(@Request() req) {
    this.loggerService.log('refresh', AuthController.name);
    return this.authService.refresh(req.user);
  }
}
