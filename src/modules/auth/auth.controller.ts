import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { SignUpDto } from 'src/modules/auth/dto/signup.dto';
import { AuthService } from './auth.service';
import { Public } from 'src/decorators';
import { RefreshDto } from 'src/modules/auth/dto/refresh.dto';

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
  @UsePipes(new ValidationPipe())
  @Post('login')
  @HttpCode(200)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  // @UsePipes(new ValidationPipe())
  @Post('refresh')
  @HttpCode(200)
  refresh(@Body() refreshDto: RefreshDto) {
    return this.authService.refresh(refreshDto);
  }
}
