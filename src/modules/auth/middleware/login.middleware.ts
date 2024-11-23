import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoginValidationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const { login, password } = req.body;

    if (!login || !password) {
      throw new BadRequestException('Both login and password are required');
    }

    next();
  }
}
