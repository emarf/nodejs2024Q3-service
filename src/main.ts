import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { config } from 'dotenv';
import { readFile } from 'node:fs/promises';
import * as yaml from 'yaml';
import { AppModule } from './app.module';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const yamlFile = await readFile('./doc/api.yaml', 'utf8');
  const document = yaml.parse(yamlFile);

  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
