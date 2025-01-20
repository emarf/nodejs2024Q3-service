import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { validate } from 'class-validator';
import { Strategy } from 'passport-local';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'login', passwordField: 'password' });
  }

  async validate(login: string, password: string) {
    const loginDto = new LoginDto();
    loginDto.login = login;
    loginDto.password = password;

    const errors = await validate(loginDto);

    if (errors.length > 0) {
      throw new BadRequestException(
        errors.map((err) => Object.values(err.constraints)).flat(),
      );
    }

    const user = await this.authService.validateUser(login, password);

    if (!user) {
      throw new ForbiddenException('No user found');
    }

    return user;
  }
}
