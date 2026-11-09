import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { DatabaseService } from '../database/database.service';
import { RegisterDto, LoginDto, UpdateProfileDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = this.db.users.find(
      (u) =>
        u.username.toLowerCase() === dto.username.toLowerCase() ||
        u.email.toLowerCase() === dto.email.toLowerCase(),
    );

    if (existing) {
      if (existing.username.toLowerCase() === dto.username.toLowerCase()) {
        throw new BadRequestException('این نام کاربری قبلاً ثبت شده است.');
      }
      throw new BadRequestException('این ایمیل قبلاً در سامانه ثبت شده است.');
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(dto.password, salt);

    const OFFICIAL_PRESETS = [
      '/profiles/Game Club.jpg',
      '/profiles/Boy.png',
      '/profiles/Girl.jpg',
      '/profiles/Studio.jpg',
      '/profiles/Academy.jpg',
      '/profiles/School.jpg',
      '/profiles/Institute.jpg',
    ];
    const defaultAvatar = OFFICIAL_PRESETS[Math.floor(Math.random() * OFFICIAL_PRESETS.length)];

    const newUser = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      username: dto.username.trim(),
      email: dto.email.toLowerCase().trim(),
      displayName: dto.displayName.trim(),
      passwordHash,
      gender: dto.gender,
      avatar: dto.avatar && !dto.avatar.startsWith('preset-') ? dto.avatar : defaultAvatar,
      phone: dto.phone || null,
      bio: '',
      role: 'user',
      membership: 'EXTERNAL', // Only admin can elevate to ROKAD
      godGameAllowed: false,
      isSuspended: false,
      walletBalance: 0,
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

    this.db.save();

    const token = this.jwtService.sign(
      { sub: newUser.id, username: newUser.username, role: newUser.role },
      { expiresIn: '7d' },
    );

    const { passwordHash: _, ...safeUser } = newUser;
    return {
      accessToken: token,
      user: safeUser,
    };
  }

  async login(dto: LoginDto) {
    const ident = dto.identifier.toLowerCase().trim();
    const user = this.db.users.find(
      (u) => u.username.toLowerCase() === ident || u.email.toLowerCase() === ident,
    );

    // Generic error to avoid leaking user existence
    if (!user) {
      throw new UnauthorizedException('نام کاربری یا رمز عبور اشتباه است.');
    }

    if (user.isSuspended) {
      throw new UnauthorizedException('حساب کاربری شما مسدود شده است. با پشتیبانی تماس بگیرید.');
    }

    const match = bcrypt.compareSync(dto.password, user.passwordHash);
    if (!match) {
      throw new UnauthorizedException('نام کاربری یا رمز عبور اشتباه است.');
    }

    const token = this.jwtService.sign(
      { sub: user.id, username: user.username, role: user.role },
      { expiresIn: dto.rememberMe ? '30d' : '7d' },
    );

    const { passwordHash: _, ...safeUser } = user;
    return {
      accessToken: token,
      user: safeUser,
    };
  }

  async getMe(userId: string) {
    const user = this.db.users.find((u) => u.id === userId);
    if (!user) {
      throw new UnauthorizedException('کاربر یافت نشد.');
    }

    const { passwordHash, ...safeUser } = user;

    const userMedals = this.db.userMedals
      .filter((um) => um.userId === userId)
      .map((um) => {
        const medal = this.db.medals.find((m) => m.id === um.medalId);
        return { ...um, medal };
      });

    const reservationsCount = this.db.reservations.filter((r) => r.userId === userId).length;
    const stats = this.db.playerStats.filter((ps) => ps.userId === userId);

    return {
      ...safeUser,
      userMedals,
      reservationsCount,
      stats,
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = this.db.users.find((u) => u.id === userId);
    if (!user) {
      throw new UnauthorizedException('کاربر یافت نشد.');
    }

    if (dto.displayName) user.displayName = dto.displayName.trim();
    if (dto.bio !== undefined) user.bio = dto.bio;
    if (dto.avatar) user.avatar = dto.avatar;
    if (dto.gender) user.gender = dto.gender;
    user.updatedAt = new Date().toISOString();

    this.db.save();

    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
}
