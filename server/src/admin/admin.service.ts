import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AdminService {
  constructor(private readonly db: DatabaseService) {}

  getDashboardStats() {
    const totalPlayers = this.db.users.filter((u) => u.role !== 'admin').length;
    const upcomingSessions = this.db.events.filter((e) => e.status === 'open').length;
    const paidReservations = this.db.reservations.filter((r) =>
      ['paid', 'partially_paid'].includes(r.paymentStatus),
    ).length;
    const tutorialsCount = this.db.articles.length;

    // Total online revenue collected
    const totalRevenue = this.db.reservations.reduce((sum, r) => sum + (r.paidOnline || 0), 0);

    // Recent 5 activity logs
    const recentLogs = this.db.auditLogs.slice(0, 5);

    return {
      totalPlayers,
      upcomingSessions,
      paidReservations,
      tutorialsCount,
      totalRevenue,
      recentLogs,
    };
  }

  getUsers(query?: { search?: string }) {
    let list = [...this.db.users];
    if (query?.search) {
      const s = query.search.toLowerCase().trim();
      list = list.filter(
        (u) =>
          u.username.toLowerCase().includes(s) ||
          u.displayName.toLowerCase().includes(s) ||
          u.email.toLowerCase().includes(s),
      );
    }

    return list.map((u) => {
      const { passwordHash: _, ...safe } = u;
      return safe;
    });
  }

  updateUser(adminUser: any, id: string, data: any) {
    const user = this.db.users.find((u) => u.id === id);
    if (!user) throw new NotFoundException('کاربر یافت نشد.');

    // Audit logs for sensitive changes
    if (data.membership && data.membership !== user.membership) {
      this.db.auditLogs.unshift({
        id: `al-${Date.now()}`,
        actorId: adminUser.id,
        action: 'CHANGE_MEMBERSHIP',
        targetType: 'USER',
        targetId: user.id,
        details: `تغییر عضویت کاربر ${user.username} از ${user.membership} به ${data.membership}`,
        createdAt: new Date().toISOString(),
      });
      user.membership = data.membership;
    }

    if (data.godGameAllowed !== undefined && data.godGameAllowed !== user.godGameAllowed) {
      this.db.auditLogs.unshift({
        id: `al-${Date.now()}`,
        actorId: adminUser.id,
        action: 'TOGGLE_GOD_GAME',
        targetType: 'USER',
        targetId: user.id,
        details: `تغییر دسترسی خدای بازی کاربر ${user.username} به ${data.godGameAllowed}`,
        createdAt: new Date().toISOString(),
      });
      user.godGameAllowed = data.godGameAllowed;
    }

    if (data.isSuspended !== undefined && data.isSuspended !== user.isSuspended) {
      this.db.auditLogs.unshift({
        id: `al-${Date.now()}`,
        actorId: adminUser.id,
        action: 'TOGGLE_SUSPEND',
        targetType: 'USER',
        targetId: user.id,
        details: `تغییر وضعیت تعلیق حساب ${user.username} به ${data.isSuspended}`,
        createdAt: new Date().toISOString(),
      });
      user.isSuspended = data.isSuspended;
    }

    if (data.role && data.role !== user.role) {
      user.role = data.role;
    }
    if (data.gender) user.gender = data.gender;
    if (data.displayName) user.displayName = data.displayName;

    user.updatedAt = new Date().toISOString();
    this.db.save();

    const { passwordHash: _, ...safe } = user;
    return safe;
  }

  createUser(adminUser: any, body: any) {
    const existing = this.db.users.find(
      (u) =>
        u.username.toLowerCase() === body.username?.toLowerCase() ||
        u.email.toLowerCase() === body.email?.toLowerCase(),
    );
    if (existing) {
      throw new BadRequestException('نام کاربری یا ایمیل تکراری است.');
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(body.password || 'password123', salt);

    const newUser = {
      id: `usr-${Date.now()}`,
      username: body.username.trim(),
      email: body.email.toLowerCase().trim(),
      displayName: body.displayName.trim(),
      passwordHash,
      gender: body.gender || 'boy',
      avatar: body.avatar || 'preset-1',
      phone: body.phone || null,
      bio: body.bio || '',
      role: body.role || 'user',
      membership: body.membership || 'EXTERNAL',
      godGameAllowed: !!body.godGameAllowed,
      isSuspended: false,
      walletBalance: Number(body.walletBalance) || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.db.users.push(newUser);

    // Initial player stat
    const mafiaCat = this.db.categories.find((c) => c.slug === 'mafia');
    if (mafiaCat) {
      this.db.playerStats.push({
        id: `ps-${Date.now()}`,
        userId: newUser.id,
        categoryId: mafiaCat.id,
        score: 1000,
        matches: 0,
        wins: 0,
        losses: 0,
        reasoning: 50,
        bluff: 50,
        negotiation: 50,
        leadership: 50,
        shooting: 50,
        teamwork: 50,
      });
    }

    this.db.auditLogs.unshift({
      id: `al-${Date.now()}`,
      actorId: adminUser.id,
      action: 'CREATE_USER',
      targetType: 'USER',
      targetId: newUser.id,
      details: `ایجاد کاربر جدید ${newUser.username} توسط مدیر`,
      createdAt: new Date().toISOString(),
    });

    this.db.save();

    const { passwordHash: _, ...safe } = newUser;
    return safe;
  }

  getMedals() {
    return this.db.medals;
  }

  awardMedal(adminUser: any, body: { userId: string; medalId: string; note?: string }) {
    const user = this.db.users.find((u) => u.id === body.userId);
    const medal = this.db.medals.find((m) => m.id === body.medalId);
    if (!user || !medal) throw new NotFoundException('کاربر یا مدال یافت نشد.');

    const newAward = {
      id: `um-${Date.now()}`,
      userId: user.id,
      medalId: medal.id,
      awardedAt: new Date().toISOString(),
      note: body.note || '',
    };

    this.db.userMedals.push(newAward);

    this.db.auditLogs.unshift({
      id: `al-${Date.now()}`,
      actorId: adminUser.id,
      action: 'AWARD_MEDAL',
      targetType: 'USER',
      targetId: user.id,
      details: `اعطای مدال "${medal.title}" به بازیکن ${user.displayName}. یادداشت: ${body.note || '-'}`,
      createdAt: new Date().toISOString(),
    });

    this.db.save();
    return { success: true, userMedal: newAward };
  }

  getMvpList() {
    return this.db.mvpAwards.map((mvp) => {
      const u = this.db.users.find((user) => user.id === mvp.userId);
      return {
        ...mvp,
        userDisplayName: u?.displayName || 'کاربر برگزیده',
        avatar: u?.avatar,
      };
    });
  }

  createMvpAward(adminUser: any, body: { userId: string; title: string; period: string; note?: string }) {
    const user = this.db.users.find((u) => u.id === body.userId);
    if (!user) throw new NotFoundException('کاربر یافت نشد.');

    const newMvp = {
      id: `mvp-${Date.now()}`,
      userId: user.id,
      title: body.title,
      period: body.period,
      note: body.note || '',
      awardedAt: new Date().toISOString(),
    };

    this.db.mvpAwards.unshift(newMvp);

    this.db.auditLogs.unshift({
      id: `al-${Date.now()}`,
      actorId: adminUser.id,
      action: 'CREATE_MVP',
      targetType: 'USER',
      targetId: user.id,
      details: `انتخاب ${user.displayName} به عنوان MVP دوره ${body.period}`,
      createdAt: new Date().toISOString(),
    });

    this.db.save();
    return newMvp;
  }

  getSettings() {
    const map: Record<string, string> = {};
    this.db.siteSettings.forEach((s) => {
      map[s.key] = s.value;
    });
    return map;
  }

  updateSettings(data: Record<string, string>) {
    Object.keys(data).forEach((key) => {
      let item = this.db.siteSettings.find((s) => s.key === key);
      if (item) {
        item.value = data[key];
      } else {
        this.db.siteSettings.push({
          id: `s-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          key,
          value: data[key],
          description: null,
        });
      }
    });

    this.db.save();
    return this.getSettings();
  }

  getAuditLogs() {
    return this.db.auditLogs.map((log) => {
      const actor = this.db.users.find((u) => u.id === log.actorId);
      return {
        ...log,
        actorDisplayName: actor?.displayName || 'سیستم',
      };
    });
  }
}
