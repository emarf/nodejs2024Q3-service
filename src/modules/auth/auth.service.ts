import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { validatePassword } from 'src/common/utils';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { RefreshDto } from 'src/modules/auth/dto/refresh.dto';
import { SignUpDto } from 'src/modules/auth/dto/signup.dto';
import { UsersService } from 'src/modules/users/users.service';

type JWTPayload = {
  userId: string;
  login: string;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async verifyUser(login: string, password: string) {
    try {
      const user = await this.usersService.findByLogin(login);
      const isPasswordValid = await validatePassword(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException();
      }
    } catch (error) {
      throw new UnauthorizedException('Credentials are invalid');
    }
  }

  async signup({ login, password }: SignUpDto) {
    const existingUser = await this.usersService.findByLogin(login);

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    return await this.usersService.create({
      login,
      password,
    });
  }

  async login({ login, password }: LoginDto) {
    const user = await this.usersService.findByLogin(login);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await validatePassword(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JWTPayload = { userId: user.id, login: user.login };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME || '24h',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh({ refreshToken }: RefreshDto) {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    console.log('refreshToken', refreshToken);
    let payload: JWTPayload;
    try {
      payload = this.jwtService.verify(refreshToken, {
        // secret: process.env.JWT_SECRET_REFRESH_KEY,
      });
    } catch (err) {
      throw new ForbiddenException('Invalid or expired refresh token');
    }

    const user = await this.usersService.findOne(payload.userId);

    if (!user) {
      throw new ForbiddenException(
        'User associated with the refresh token does not exist',
      );
    }

    const updatedPayload: JWTPayload = {
      userId: user.id,
      login: user.login,
    };

    const accessToken = this.jwtService.sign(updatedPayload);
    const newRefreshToken = this.jwtService.sign(updatedPayload, {
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME || '24h',
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}
