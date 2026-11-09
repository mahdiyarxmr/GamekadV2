import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class HomepageService {
  constructor(private readonly db: DatabaseService) {}

  getHomepageData() {
    const blocks = [...this.db.homepageBlocks].sort((a, b) => a.sortOrder - b.sortOrder);

    // Spotlight: nearest upcoming open event
    const now = new Date();
    const openEvents = this.db.events
      .filter((e) => e.status === 'open' && new Date(e.startTime) > now)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    const spotlight = openEvents[0] || this.db.events[0] || null;

    // Upcoming events (top 4)
    const upcomingEvents = this.db.events
      .filter((e) => e.status === 'open')
      .slice(0, 4)
      .map((e) => {
        const category = this.db.categories.find((c) => c.id === e.categoryId);
        const remainingSeats = Math.max(0, e.capacity - e.reservedCount);
        return { ...e, category, remainingSeats };
      });

    // Categories with preview
    const categories = this.db.categories;

    // Scenarios (top 3)
    const scenarios = this.db.scenarios.slice(0, 3);

    // Leaderboard top 5
    const mafiaCat = this.db.categories.find((c) => c.slug === 'mafia');
    const topPlayers = this.db.playerStats
      .filter((ps) => ps.categoryId === (mafiaCat?.id || 'cat-mafia'))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((ps, idx) => {
        const u = this.db.users.find((user) => user.id === ps.userId);
        return {
          rank: idx + 1,
          userId: ps.userId,
          displayName: u?.displayName || 'کاربر',
          username: u?.username,
          avatar: u?.avatar,
          score: ps.score,
          wins: ps.wins,
          membership: u?.membership,
        };
      });

    // MVP
    const mvps = this.db.mvpAwards.map((m) => {
      const u = this.db.users.find((user) => user.id === m.userId);
      return {
        ...m,
        userDisplayName: u?.displayName || 'کاربر برگزیده',
        avatar: u?.avatar,
        membership: u?.membership,
      };
    });

    // Recent articles
    const articles = this.db.articles.slice(0, 3);

    // Site settings
    const settingsMap: Record<string, string> = {};
    this.db.siteSettings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    return {
      blocks,
      spotlight,
      upcomingEvents,
      categories,
      scenarios,
      topPlayers,
      mvps,
      articles,
      settings: settingsMap,
    };
  }

  reorderBlocks(blocks: { blockKey: string; isVisible: boolean; sortOrder: number }[]) {
    blocks.forEach((item) => {
      const found = this.db.homepageBlocks.find((b) => b.blockKey === item.blockKey);
      if (found) {
        found.sortOrder = item.sortOrder;
        found.isVisible = item.isVisible;
      }
    });

    this.db.save();
    return this.db.homepageBlocks.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  resetBlocks() {
    const defaults = [
      { id: 'b-1', blockKey: 'hero', title: 'سرصفحه اصلی', isVisible: true, sortOrder: 1 },
      { id: 'b-2', blockKey: 'spotlight', title: 'رویداد ویژه نزدیک', isVisible: true, sortOrder: 2 },
      { id: 'b-3', blockKey: 'events', title: 'میزهای پیش‌رو', isVisible: true, sortOrder: 3 },
      { id: 'b-4', blockKey: 'games', title: 'بازی‌ها (رومیزی و کنسول)', isVisible: true, sortOrder: 4 },
      { id: 'b-5', blockKey: 'guide', title: 'آموزش سناریوها', isVisible: true, sortOrder: 5 },
      { id: 'b-6', blockKey: 'leaderboard', title: 'لیدربورد و رتبه‌بندی', isVisible: true, sortOrder: 6 },
      { id: 'b-7', blockKey: 'mvp', title: 'منتخبان دوره (MVP)', isVisible: true, sortOrder: 7 },
      { id: 'b-8', blockKey: 'articles', title: 'مقالات و آموزش', isVisible: true, sortOrder: 8 },
      { id: 'b-9', blockKey: 'about', title: 'درباره و آدرس باشگاه', isVisible: true, sortOrder: 9 },
    ];
    this.db.homepageBlocks = defaults;
    this.db.save();
    return this.db.homepageBlocks;
  }
}
