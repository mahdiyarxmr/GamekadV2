import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import type { Express, Request, Response } from 'express';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express');

const server: Express = express();
const logger = new Logger('Gamekad');

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

let isInitialized = false;
let initPromise: Promise<Express> | null = null;

export async function bootstrap(): Promise<Express> {
  if (isInitialized) return server;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
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
      isInitialized = true;
      logger.log('گیم‌کاد: اپلیکیشن با موفقیت در حالت Serverless آماده شد.');
      return server;
    } catch (err) {
      logger.error('خطای راه‌اندازی گیم‌کاد:', err);
      initPromise = null;
      throw err;
    }
  })();

  return initPromise;
}

// Serverless handler for Vercel
export default async function handler(req: Request, res: Response) {
  try {
    await bootstrap();
    return server(req, res);
  } catch (err: any) {
    logger.error('Vercel handler error:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        error: 'FUNCTION_INITIALIZATION_ERROR',
        message: err?.message || String(err),
        stack: err?.stack,
      }),
    );
  }
}

// CommonJS export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = handler;
  module.exports.default = handler;
}

// Standalone local execution
if (!process.env.VERCEL && typeof require !== 'undefined' && require.main === module) {
  (async () => {
    await bootstrap();
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
    server.listen(port, () => {
      logger.log(`گیم‌کاد سرور روی پورت ${port} با موفقیت راه‌اندازی شد.`);
    });
  })();
}
