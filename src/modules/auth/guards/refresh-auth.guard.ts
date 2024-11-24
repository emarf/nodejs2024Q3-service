import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshGuard extends AuthGuard('refresh') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(
    err: any,
    user: any,
    info: TokenExpiredError | JsonWebTokenError | null,
  ) {
    if (err || !user) {
      if (info && info.name === 'TokenExpiredError') {
        throw new ForbiddenException('Refresh token expired');
      }
      if (info && info.name === 'JsonWebTokenError') {
        throw new ForbiddenException('Invalid refresh token');
      }
      throw new UnauthorizedException('Unauthorized');
    }

    return user;
  }
}
