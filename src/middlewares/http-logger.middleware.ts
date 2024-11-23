import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { sanitizeSensitiveData } from 'src/common/utils';
import { LoggerService } from 'src/modules/logger/logger.service';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggerService: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, url, body, query } = req;
    const sanitizedBody = sanitizeSensitiveData(body);

    const start = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - start;

      this.loggerService.log(
        `Request: ${method} ${url} - Query: ${JSON.stringify(
          query,
        )} - Body: ${JSON.stringify(
          sanitizedBody,
        )} - Status: ${statusCode} - Duration: ${duration}ms`,
      );
    });

    next();
  }
}
