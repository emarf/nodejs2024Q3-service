import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { validatePassword } from 'src/common/utils';
import { SignUpDto } from 'src/modules/auth/dto/signup.dto';
import { User } from 'src/modules/users/interfaces/user.interface';
import { UsersService } from 'src/modules/users/users.service';

export type TokenPayload = {
  userId: string;
  login: string;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(login: string, password: string) {
    const user = await this.usersService.findOneWithLogin(login);

    if (user && (await validatePassword(password, user.password))) {
      return user;
    }

    return null;
  }

  async signup({ login, password }: SignUpDto) {
    const existingUser = await this.usersService.findOneWithLogin(login);

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    return await this.usersService.create({
      login,
      password,
    });
  }

  async login(user: User) {
    const payload: TokenPayload = { userId: user.id, login: user.login };

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.TOKEN_EXPIRE_TIME || '1h',
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME || '24h',
      }),
    };
  }

  async refresh(tokenPayload: TokenPayload) {
    const updatedPayload: TokenPayload = {
      userId: tokenPayload.userId,
      login: tokenPayload.login,
    };

    return {
      accessToken: this.jwtService.sign(updatedPayload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.TOKEN_EXPIRE_TIME || '1h',
      }),
      refreshToken: this.jwtService.sign(updatedPayload, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME || '24h',
      }),
    };
  }
}
