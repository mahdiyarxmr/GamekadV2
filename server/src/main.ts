import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import type { Express, Request, Response } from 'express';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express');

const server: Express = express();
let isAppInitialized = false;

// URL Normalizer: Handles both /api/v1/... and stripped proxy paths (/v1/... or /...)
server.use((req, res, next) => {
  if (req.url === '/docs' || req.url.startsWith('/docs/')) {
    req.url = '/api' + req.url;
  } else if (!req.url.startsWith('/api')) {
    if (req.url.startsWith('/v1')) {
      req.url = '/api' + req.url;
    } else {
      req.url = '/api/v1' + (req.url.startsWith('/') ? req.url : '/' + req.url);
    }
  }
  next();
});

export async function createNestServer(expressInstance: Express) {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressInstance));

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Gamekad / Rokad API')
    .setDescription('پلتفرم باشگاه بازی و رویدادهای حضوری گیم‌کاد / رکاد مشهد')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.init();
  return app;
}

// Handler for Vercel Serverless Functions
export default async function handler(req: Request, res: Response) {
  if (!isAppInitialized) {
    await createNestServer(server);
    isAppInitialized = true;
  }
  return server(req, res);
}

// CommonJS compatibility for Vercel Node runtime
if (typeof module !== 'undefined' && module.exports) {
  module.exports = handler;
  module.exports.default = handler;
}

// Standalone execution (Local dev / Docker / Dedicated server) - only when run directly
if (typeof require !== 'undefined' && require.main === module) {
  async function bootstrap() {
    const logger = new Logger('GamekadBootstrap');
    const app = await NestFactory.create(AppModule);

    app.enableCors({
      origin: '*',
      credentials: true,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: false,
      }),
    );

    const config = new DocumentBuilder()
      .setTitle('Gamekad / Rokad API')
      .setDescription('پلتفرم باشگاه بازی و رویدادهای حضوری گیم‌کاد / رکاد مشهد')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const port = process.env.PORT || 3000;
    await app.listen(port);
    logger.log(`گیم‌کاد سرور روی پورت ${port} با موفقیت راه‌اندازی شد.`);
    logger.log(`مستندات سوآگر در دسترس است: http://localhost:${port}/api/docs`);
  }
  bootstrap();
}
