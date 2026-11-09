import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { getInitialSeedData } from './initial-data';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);
  private dbFilePath = this.resolveDbFilePath();

  public users: any[] = [];
  public categories: any[] = [];
  public scenarios: any[] = [];
  public roles: any[] = [];
  public electronicGames: any[] = [];
  public events: any[] = [];
  public reservations: any[] = [];
  public medals: any[] = [];
  public userMedals: any[] = [];
  public playerStats: any[] = [];
  public mvpAwards: any[] = [];
  public articles: any[] = [];
  public homepageBlocks: any[] = [];
  public siteSettings: any[] = [];
  public godGameSessions: any[] = [];
  public godGameSeats: any[] = [];
  public godGameLogs: any[] = [];
  public walletTxs: any[] = [];
  public auditLogs: any[] = [];

  onModuleInit() {
    this.initDatabase();
  }

  private resolveDbFilePath(): string {
    const candidates = [
      path.resolve(process.cwd(), 'data', 'gamekad-db.json'),
      path.resolve(process.cwd(), 'server', 'data', 'gamekad-db.json'),
      path.resolve(__dirname, '../../data/gamekad-db.json'),
      path.resolve(__dirname, '../../../data/gamekad-db.json'),
      path.resolve(__dirname, '../../../../server/data/gamekad-db.json'),
    ];
    for (const candidate of candidates) {
      try {
        if (fs.existsSync(candidate)) {
          return candidate;
        }
      } catch (e) {
        // ignore filesystem permission checks
      }
    }
    return path.resolve(process.cwd(), 'server', 'data', 'gamekad-db.json');
  }

  private initDatabase() {
    try {
      // 1. Always load in-memory seed data first (guarantees all 33 roles, 5 scenarios, events & users)
      const initial = getInitialSeedData();
      this.loadFromObject(initial);

      // 2. Try loading persisted modifications from JSON file if accessible
      if (fs.existsSync(this.dbFilePath)) {
        const raw = fs.readFileSync(this.dbFilePath, 'utf-8');
        const parsed = JSON.parse(raw);
        this.loadFromObject(parsed);
        this.logger.log(`گیم‌کاد: داده‌ها با موفقیت از فایل مخزن (${this.dbFilePath}) بارگذاری شدند.`);
      } else {
        this.logger.log('گیم‌کاد: مخزن با داده‌های اولیه در حافظه سیستم راه‌اندازی شد.');
      }
    } catch (err) {
      this.logger.warn('خطا در بارگذاری فایل دیسک دیتابیس، استفاده از داده‌های پیش‌فرض در حافظه:', err);
      try {
        const initial = getInitialSeedData();
        this.loadFromObject(initial);
      } catch (innerErr) {
        this.logger.error('خطای بحرانی در بذر اولیه:', innerErr);
      }
    }
  }

  private loadFromObject(obj: any) {
    if (!obj) return;
    this.users = obj.users || this.users || [];
    this.categories = obj.categories || this.categories || [];
    this.scenarios = obj.scenarios || this.scenarios || [];
    this.roles = obj.roles || this.roles || [];
    this.electronicGames = obj.electronicGames || this.electronicGames || [];
    this.events = obj.events || this.events || [];
    this.reservations = obj.reservations || this.reservations || [];
    this.medals = obj.medals || this.medals || [];
    this.userMedals = obj.userMedals || this.userMedals || [];
    this.playerStats = obj.playerStats || this.playerStats || [];
    this.mvpAwards = obj.mvpAwards || this.mvpAwards || [];
    this.articles = obj.articles || this.articles || [];
    this.homepageBlocks = obj.homepageBlocks || this.homepageBlocks || [];
    this.siteSettings = obj.siteSettings || this.siteSettings || [];
    this.godGameSessions = obj.godGameSessions || this.godGameSessions || [];
    this.godGameSeats = obj.godGameSeats || this.godGameSeats || [];
    this.godGameLogs = obj.godGameLogs || this.godGameLogs || [];
    this.walletTxs = obj.walletTxs || this.walletTxs || [];
    this.auditLogs = obj.auditLogs || this.auditLogs || [];
  }

  public save() {
    try {
      const data = {
        users: this.users,
        categories: this.categories,
        scenarios: this.scenarios,
        roles: this.roles,
        electronicGames: this.electronicGames,
        events: this.events,
        reservations: this.reservations,
        medals: this.medals,
        userMedals: this.userMedals,
        playerStats: this.playerStats,
        mvpAwards: this.mvpAwards,
        articles: this.articles,
        homepageBlocks: this.homepageBlocks,
        siteSettings: this.siteSettings,
        godGameSessions: this.godGameSessions,
        godGameSeats: this.godGameSeats,
        godGameLogs: this.godGameLogs,
        walletTxs: this.walletTxs,
        auditLogs: this.auditLogs,
      };

      const targetPath = process.env.VERCEL
        ? path.join('/tmp', 'gamekad-db.json')
        : this.dbFilePath;

      const dir = path.dirname(targetPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(targetPath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      // In serverless environments, read-only disk warnings are caught gracefully
      this.logger.warn('امکان نوشتن بر روی دیسک دائم وجود ندارد؛ تغییرات در حافظه موقت نگهداری شدند.');
    }
  }

  public resetToDefaults() {
    const initial = getInitialSeedData();
    this.loadFromObject(initial);
    this.save();
    return true;
  }
}
