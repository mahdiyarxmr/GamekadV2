import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { getInitialSeedData } from './initial-data';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);
  private dbFilePath = this.resolveDbFilePath();

  private resolveDbFilePath(): string {
    const candidates = [
      path.resolve(process.cwd(), 'data', 'gamekad-db.json'),
      path.resolve(process.cwd(), 'server', 'data', 'gamekad-db.json'),
      path.resolve(__dirname, '../../data/gamekad-db.json'),
      path.resolve(__dirname, '../../../data/gamekad-db.json'),
    ];
    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }
    // Default to server/data or data
    return path.resolve(process.cwd(), 'server', 'data', 'gamekad-db.json');
  }

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

  private initDatabase() {
    try {
      const dir = path.dirname(this.dbFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (fs.existsSync(this.dbFilePath)) {
        const raw = fs.readFileSync(this.dbFilePath, 'utf-8');
        const parsed = JSON.parse(raw);
        this.loadFromObject(parsed);
        this.logger.log(`گیم‌کاد: داده‌ها با موفقیت از مخزن دیتابیس (${this.dbFilePath}) بارگذاری شد.`);
      } else {
        const initial = getInitialSeedData();
        this.loadFromObject(initial);
        this.save();
        this.logger.log('گیم‌کاد: مخزن اولیه با دیتای سید رکاد ایجاد شد.');
      }
    } catch (err) {
      this.logger.error('خطا در بارگذاری پایگاه داده:', err);
      const initial = getInitialSeedData();
      this.loadFromObject(initial);
    }
  }

  private loadFromObject(obj: any) {
    this.users = obj.users || [];
    this.categories = obj.categories || [];
    this.scenarios = obj.scenarios || [];
    this.roles = obj.roles || [];
    this.electronicGames = obj.electronicGames || [];
    this.events = obj.events || [];
    this.reservations = obj.reservations || [];
    this.medals = obj.medals || [];
    this.userMedals = obj.userMedals || [];
    this.playerStats = obj.playerStats || [];
    this.mvpAwards = obj.mvpAwards || [];
    this.articles = obj.articles || [];
    this.homepageBlocks = obj.homepageBlocks || [];
    this.siteSettings = obj.siteSettings || [];
    this.godGameSessions = obj.godGameSessions || [];
    this.godGameSeats = obj.godGameSeats || [];
    this.godGameLogs = obj.godGameLogs || [];
    this.walletTxs = obj.walletTxs || [];
    this.auditLogs = obj.auditLogs || [];
  }

  public save() {
    try {
      const dir = path.dirname(this.dbFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
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
      fs.writeFileSync(this.dbFilePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      this.logger.warn('امکان نوشتن بر روی دیسک وجود ندارد (محیط سرورلس)، داده‌ها در حافظه موقت نگهداری می‌شوند.');
    }
  }

  public resetToDefaults() {
    const initial = getInitialSeedData();
    this.loadFromObject(initial);
    this.save();
    return true;
  }
}
