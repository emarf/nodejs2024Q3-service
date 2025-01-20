import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { config } from 'dotenv';
import { readFile } from 'node:fs/promises';
import * as yaml from 'yaml';
import { AppModule } from './app.module';
import { LoggerService } from 'src/modules/logger/logger.service';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const loggerService = app.get(LoggerService);
  app.useLogger(loggerService);

  const yamlFile = await readFile('./doc/api.yaml', 'utf8');
  const document = yaml.parse(yamlFile);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter(loggerService));

  process.on('uncaughtException', (err) => {
    loggerService.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    loggerService.error(`Unhandled Rejection: ${reason} at ${promise}`);
  });

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
