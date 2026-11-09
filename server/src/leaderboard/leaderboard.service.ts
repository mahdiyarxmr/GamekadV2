import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class LeaderboardService {
  constructor(private readonly db: DatabaseService) {}

  getLeaderboard(categorySlug = 'mafia', gender = 'all') {
    const category = this.db.categories.find((c) => c.slug === categorySlug) || this.db.categories[0];
    const categoryId = category ? category.id : 'cat-mafia';

    let stats = this.db.playerStats.filter((ps) => ps.categoryId === categoryId);

    // Join with user
    let players = stats.map((st) => {
      const user = this.db.users.find((u) => u.id === st.userId);
      const medals = this.db.userMedals
        .filter((um) => um.userId === st.userId)
        .map((um) => this.db.medals.find((m) => m.id === um.medalId))
        .filter(Boolean);

      const winRate = st.matches > 0 ? Math.round((st.wins / st.matches) * 100) : 0;

      return {
        userId: st.userId,
        username: user?.username || 'unknown',
        displayName: user?.displayName || 'کاربر',
        avatar: user?.avatar || 'preset-1',
        gender: user?.gender || 'boy',
        membership: user?.membership || 'EXTERNAL',
        score: st.score,
        matches: st.matches,
        wins: st.wins,
        losses: st.losses,
        winRate,
        medals,
      };
    });

    if (gender === 'boy' || gender === 'boys') {
      players = players.filter((p) => p.gender === 'boy');
    } else if (gender === 'girl' || gender === 'girls') {
      players = players.filter((p) => p.gender === 'girl');
    }

    // Sort: score desc -> wins desc -> userId asc
    players.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.wins !== a.wins) return b.wins - a.wins;
      return a.userId.localeCompare(b.userId);
    });

    // Add rank
    return {
      category,
      gender,
      rankings: players.map((p, idx) => ({ ...p, rank: idx + 1 })),
    };
  }

  getPlayers(query?: { search?: string; membership?: string; page?: number; limit?: number }) {
    let list = [...this.db.users];

    if (query?.search) {
      const s = query.search.toLowerCase().trim();
      list = list.filter(
        (u) =>
          u.username.toLowerCase().includes(s) ||
          u.displayName.toLowerCase().includes(s),
      );
    }

    if (query?.membership) {
      list = list.filter((u) => u.membership === query.membership);
    }

    const page = Math.max(1, Number(query?.page) || 1);
    const limit = Math.max(1, Math.min(50, Number(query?.limit) || 20));
    const total = list.length;
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    const safePlayers = paginated.map((u) => {
      const mafiaStat = this.db.playerStats.find(
        (ps) => ps.userId === u.id && ps.categoryId === 'cat-mafia',
      );
      const medalsCount = this.db.userMedals.filter((um) => um.userId === u.id).length;

      return {
        id: u.id,
        username: u.username,
        displayName: u.displayName,
        gender: u.gender,
        avatar: u.avatar,
        membership: u.membership,
        score: mafiaStat?.score || 1000,
        matches: mafiaStat?.matches || 0,
        medalsCount,
      };
    });

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      players: safePlayers,
    };
  }

  getPlayerProfile(username: string) {
    const user = this.db.users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase().trim(),
    );
    if (!user) throw new NotFoundException('پروفایل بازیکن یافت نشد.');

    const stats = this.db.playerStats.filter((ps) => ps.userId === user.id);
    const primaryStat = stats.find((s) => s.categoryId === 'cat-mafia') || stats[0] || {
      score: 1000,
      matches: 0,
      wins: 0,
      losses: 0,
      reasoning: 60,
      bluff: 60,
      negotiation: 60,
      leadership: 60,
      shooting: 60,
      teamwork: 60,
    };

    const medals = this.db.userMedals
      .filter((um) => um.userId === user.id)
      .map((um) => {
        const medal = this.db.medals.find((m) => m.id === um.medalId);
        return {
          ...um,
          medal,
        };
      });

    // Recent games simulation / real sessions where player sat
    const recentGames = this.db.godGameSeats
      .filter((seat) => seat.playerId === user.id)
      .map((seat) => {
        const session = this.db.godGameSessions.find((s) => s.id === seat.sessionId);
        const scenario = session ? this.db.scenarios.find((sc) => sc.id === session.scenarioId) : null;
        return {
          sessionId: seat.sessionId,
          sessionTitle: session?.title || 'بازی مافیا',
          scenarioTitle: scenario?.title || 'سناریو',
          roleName: seat.roleName || 'نقش نامشخص',
          roleSide: seat.roleSide,
          isWinner: session?.winnerSide === seat.roleSide,
          date: session?.createdAt || new Date().toISOString(),
        };
      });

    // Simulated role playbook if empty
    const rolePlaybook = [
      { roleName: 'دن مافیا', wins: 5, losses: 1 },
      { roleName: 'دکتر شهر', wins: 6, losses: 2 },
      { roleName: 'کارآگاه', wins: 4, losses: 1 },
      { roleName: 'شهروند ساده', wins: 3, losses: 2 },
    ];

    const radarSkills = [
      { subject: 'استدلال و منطق', value: primaryStat.reasoning, fullMark: 100 },
      { subject: 'بلوف‌زنی', value: primaryStat.bluff, fullMark: 100 },
      { subject: 'مذاکره و اقناع', value: primaryStat.negotiation, fullMark: 100 },
      { subject: 'رهبری تیم', value: primaryStat.leadership, fullMark: 100 },
      { subject: 'تیراندازی شب', value: primaryStat.shooting, fullMark: 100 },
      { subject: 'کار تیمی', value: primaryStat.teamwork, fullMark: 100 },
    ];

    const { passwordHash: _, ...safeUser } = user;

    return {
      user: safeUser,
      primaryStat,
      stats,
      medals,
      radarSkills,
      recentGames,
      rolePlaybook,
    };
  }
}
