import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { sanitizeSensitiveData } from 'src/common/utils';
import { LoggerService } from 'src/modules/logger/logger.service';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggerService: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, body } = req;
    const sanitizedBody = sanitizeSensitiveData(body);

    const start = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - start;

      this.loggerService.log(
        `
        Request: ${method} ${originalUrl} ${statusCode}
        Body: ${JSON.stringify(sanitizedBody)}
        Duration: ${duration}ms
        `,
        HttpLoggerMiddleware.name,
      );
    });

    next();
  }
}
