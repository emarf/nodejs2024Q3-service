import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';
import { Public } from 'src/decorators';
import { SignUpDto } from 'src/modules/auth/dto/signup.dto';
import { LocalAuthGuard } from 'src/modules/auth/guards/local-auth.guard';
import { RefreshGuard } from 'src/modules/auth/guards/refresh-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UsePipes(new ValidationPipe())
  @Post('signup')
  signup(@Body() singUpDto: SignUpDto) {
    return this.authService.signup(singUpDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(StatusCodes.OK)
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Public()
  @UseGuards(RefreshGuard)
  @Post('refresh')
  @HttpCode(StatusCodes.OK)
  refresh(@Request() req) {
    return this.authService.refresh(req.user);
  }
}
