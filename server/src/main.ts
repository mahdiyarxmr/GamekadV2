import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import type { Express, Request, Response } from 'express';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express');

const server: Express = express();
const logger = new Logger('GamekadBootstrap');

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

let appInstance: any = null;

export async function bootstrap() {
  if (appInstance) return appInstance;

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

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

  await app.init();

  // In standalone / Fluid compute, listen on process.env.PORT or 3000
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  try {
    await app.listen(port);
    logger.log(`گیم‌کاد سرور روی پورت ${port} با موفقیت راه‌اندازی شد.`);
  } catch (err: any) {
    if (err?.code !== 'EADDRINUSE') {
      logger.warn(`هشدار در listen روی پورت ${port} (ادامه به حالت Serverless): ${err?.message}`);
    }
  }

  appInstance = app;
  return app;
}

// Bootstrap promise cached across serverless invocations
const bootstrapPromise = bootstrap().catch((err) => {
  logger.error('Gamekad bootstrap failed:', err);
});

// Serverless function handler for Vercel
export default async function handler(req: Request, res: Response) {
  await bootstrapPromise;
  return new Promise<void>((resolve, reject) => {
    res.on('finish', () => resolve());
    res.on('close', () => resolve());
    res.on('error', (err) => reject(err));
    server(req, res, (err: any) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// CommonJS export for Node runtime
if (typeof module !== 'undefined' && module.exports) {
  module.exports = handler;
  module.exports.default = handler;
}
