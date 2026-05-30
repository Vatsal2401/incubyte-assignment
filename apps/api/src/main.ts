import 'reflect-metadata';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // All API routes live under /api; the built SPA is served at the root.
  app.setGlobalPrefix('api');

  // Validate and sanitize all incoming payloads at the boundary.
  // whitelist + forbidNonWhitelisted guard against mass assignment.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors();

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
}

void bootstrap();
