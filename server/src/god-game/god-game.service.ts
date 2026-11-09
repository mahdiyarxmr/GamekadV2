import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class GodGameService {
  constructor(private readonly db: DatabaseService) {}

  getSessions(user: any) {
    if (user.role === 'admin') {
      return this.db.godGameSessions.map((s) => this.attachSessionDetails(s));
    }
    return this.db.godGameSessions
      .filter((s) => s.hostId === user.id)
      .map((s) => this.attachSessionDetails(s));
  }

  getSessionById(id: string, user: any) {
    const session = this.db.godGameSessions.find((s) => s.id === id);
    if (!session) throw new NotFoundException('نشست خدای بازی یافت نشد.');

    // Only host or admin can access
    if (session.hostId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('شما دسترسی به این میز خدای بازی را ندارید.');
    }

    return this.attachSessionDetails(session);
  }

  createSession(user: any, body: { title: string; scenarioId: string; seatsCount: number; targetGender?: string }) {
    const seatsCount = Math.max(4, Math.min(24, Number(body.seatsCount) || 10));
    const scenario = this.db.scenarios.find((s) => s.id === body.scenarioId);
    if (!scenario) throw new NotFoundException('سناریوی مورد نظر یافت نشد.');

    const newSession = {
      id: `ggs-${Date.now()}`,
      title: body.title || `میز شب - ${scenario.title}`,
      scenarioId: scenario.id,
      hostId: user.id,
      targetGender: body.targetGender || 'boys',
      seatsCount,
      currentPhase: 'SETUP',
      dayNumber: 1,
      timerSeconds: 180,
      timerRunning: false,
      winnerSide: null,
      isImported: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.db.godGameSessions.unshift(newSession);

    // Create empty seats
    for (let i = 1; i <= seatsCount; i++) {
      this.db.godGameSeats.push({
        id: `seat-${newSession.id}-${i}`,
        sessionId: newSession.id,
        seatNumber: i,
        playerId: null,
        playerName: `صندلی ${i}`,
        roleId: null,
        roleName: null,
        roleSide: null,
        isAlive: true,
        warningsCount: 0,
        isNominated: false,
        votesCount: 0,
        isKicked: false,
      });
    }

    // Add initial log
    this.db.godGameLogs.push({
      id: `gl-${Date.now()}`,
      sessionId: newSession.id,
      phase: 'SETUP',
      text: `میز جدید "${newSession.title}" با ${seatsCount} صندلی ساخته شد.`,
      createdAt: new Date().toISOString(),
    });

    this.db.save();

    return this.attachSessionDetails(newSession);
  }

  distributeRoles(sessionId: string, user: any) {
    const session = this.db.godGameSessions.find((s) => s.id === sessionId);
    if (!session) throw new NotFoundException('نشست یافت نشد.');

    if (session.hostId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('دسترسی غیرمجاز.');
    }

    const availableRoles = this.db.roles.filter((r) => r.scenarioId === session.scenarioId);
    if (availableRoles.length === 0) {
      throw new BadRequestException('برای این سناریو نقشی تعریف نشده است.');
    }

    const seats = this.db.godGameSeats.filter((s) => s.sessionId === sessionId && !s.isKicked);
    
    // Prepare role deck: shuffle available roles, fill remaining with Citizen if needed
    const deck = [...availableRoles];
    const citizenRole = availableRoles.find((r) => r.side === 'CITIZEN') || availableRoles[0];
    while (deck.length < seats.length) {
      deck.push(citizenRole);
    }
    // Shuffle
    const shuffled = deck.slice(0, seats.length).sort(() => Math.random() - 0.5);

    seats.forEach((seat, idx) => {
      const assigned = shuffled[idx];
      seat.roleId = assigned.id;
      seat.roleName = assigned.name;
      seat.roleSide = assigned.side;
    });

    this.db.godGameLogs.push({
      id: `gl-${Date.now()}`,
      sessionId,
      phase: session.currentPhase,
      text: `نقش‌های بازی به‌صورت تصادفی میان ${seats.length} بازیکن پخش شدند.`,
      createdAt: new Date().toISOString(),
    });

    this.db.save();

    return {
      success: true,
      message: 'نقش‌ها با موفقیت میان صندلی‌ها توزیع شدند.',
      session: this.attachSessionDetails(session),
    };
  }

  updatePhase(sessionId: string, user: any, body: { phase: string; dayNumber?: number }) {
    const session = this.db.godGameSessions.find((s) => s.id === sessionId);
    if (!session) throw new NotFoundException('نشست یافت نشد.');

    session.currentPhase = body.phase;
    if (body.dayNumber) session.dayNumber = body.dayNumber;
    session.timerSeconds = 180;
    session.timerRunning = false;
    session.updatedAt = new Date().toISOString();

    // Reset nominations if leaving defense/voting
    if (body.phase === 'NIGHT' || body.phase === 'DAY') {
      this.db.godGameSeats
        .filter((s) => s.sessionId === sessionId)
        .forEach((s) => {
          s.isNominated = false;
          s.votesCount = 0;
        });
    }

    const phaseTitles: Record<string, string> = {
      SETUP: 'چیدمان اولیه',
      DAY: `روز ${session.dayNumber}`,
      DEFENSE: `دفاعیه روز ${session.dayNumber}`,
      VOTING: `رأی‌گیری روز ${session.dayNumber}`,
      NIGHT: `شب ${session.dayNumber}`,
      FINISHED: 'پایان بازی',
    };

    this.db.godGameLogs.push({
      id: `gl-${Date.now()}`,
      sessionId,
      phase: session.currentPhase,
      text: `فاز بازی به "${phaseTitles[body.phase] || body.phase}" تغییر یافت.`,
      createdAt: new Date().toISOString(),
    });

    this.db.save();

    return this.attachSessionDetails(session);
  }

  updateSeat(sessionId: string, seatNumber: number, data: any) {
    const seat = this.db.godGameSeats.find(
      (s) => s.sessionId === sessionId && s.seatNumber === seatNumber,
    );
    if (!seat) throw new NotFoundException('صندلی مورد نظر یافت نشد.');

    if (data.playerName !== undefined) seat.playerName = data.playerName;
    if (data.playerId !== undefined) seat.playerId = data.playerId;
    if (data.roleId !== undefined) seat.roleId = data.roleId;
    if (data.roleName !== undefined) seat.roleName = data.roleName;
    if (data.roleSide !== undefined) seat.roleSide = data.roleSide;
    if (data.isAlive !== undefined) {
      seat.isAlive = data.isAlive;
      this.db.godGameLogs.push({
        id: `gl-${Date.now()}`,
        sessionId,
        phase: 'STATUS',
        text: `وضعیت صندلی ${seat.seatNumber} (${seat.playerName}): ${seat.isAlive ? 'زنده' : 'مرده'} شد.`,
        createdAt: new Date().toISOString(),
      });
    }
    if (data.warningsCount !== undefined) seat.warningsCount = Math.max(0, data.warningsCount);
    if (data.isNominated !== undefined) seat.isNominated = data.isNominated;
    if (data.votesCount !== undefined) seat.votesCount = Math.max(0, data.votesCount);
    if (data.isKicked !== undefined) {
      seat.isKicked = data.isKicked;
      if (data.isKicked) {
        seat.isAlive = false;
        this.db.godGameLogs.push({
          id: `gl-${Date.now()}`,
          sessionId,
          phase: 'KICK',
          text: `صندلی ${seat.seatNumber} (${seat.playerName}) از بازی اخراج شد.`,
          createdAt: new Date().toISOString(),
        });
      }
    }

    this.db.save();
    return seat;
  }

  addLog(sessionId: string, text: string) {
    const session = this.db.godGameSessions.find((s) => s.id === sessionId);
    if (!session) throw new NotFoundException('نشست یافت نشد.');

    const log = {
      id: `gl-${Date.now()}`,
      sessionId,
      phase: session.currentPhase,
      text,
      createdAt: new Date().toISOString(),
    };
    this.db.godGameLogs.push(log);
    this.db.save();
    return log;
  }

  importStats(sessionId: string, user: any, body: { winnerSide: string }) {
    const session = this.db.godGameSessions.find((s) => s.id === sessionId);
    if (!session) throw new NotFoundException('نشست یافت نشد.');

    if (session.isImported) {
      throw new BadRequestException('نتایج این بازی قبلاً در آمار و لیدربورد ثبت شده است.');
    }

    session.winnerSide = body.winnerSide as any;
    session.isImported = true;
    session.currentPhase = 'FINISHED';

    const seats = this.db.godGameSeats.filter((s) => s.sessionId === sessionId);
    const scenario = this.db.scenarios.find((sc) => sc.id === session.scenarioId);
    const categoryId = scenario?.categoryId || 'cat-mafia';

    // Award scores to players who have linked user accounts
    seats.forEach((seat) => {
      if (seat.playerId) {
        let stat = this.db.playerStats.find(
          (ps) => ps.userId === seat.playerId && ps.categoryId === categoryId,
        );
        if (!stat) {
          stat = {
            id: `ps-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            userId: seat.playerId,
            categoryId,
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
          };
          this.db.playerStats.push(stat);
        }

        const isWin = seat.roleSide === body.winnerSide;
        stat.matches += 1;
        if (isWin) {
          stat.wins += 1;
          stat.score += 50;
        } else {
          stat.losses += 1;
          stat.score = Math.max(0, stat.score - 20);
        }
      }
    });

    this.db.godGameLogs.push({
      id: `gl-${Date.now()}`,
      sessionId,
      phase: 'FINISHED',
      text: `بازی به پایان رسید. برنده: ساید ${body.winnerSide}. امتیازات بازیکنان به لیدربورد افزوده شد.`,
      createdAt: new Date().toISOString(),
    });

    this.db.save();

    return {
      success: true,
      message: 'نتایج با موفقیت در لیدربورد و پروفایل بازیکنان ثبت شد.',
      session: this.attachSessionDetails(session),
    };
  }

  private attachSessionDetails(session: any) {
    const scenario = this.db.scenarios.find((s) => s.id === session.scenarioId);
    const host = this.db.users.find((u) => u.id === session.hostId);
    const seats = this.db.godGameSeats
      .filter((s) => s.sessionId === session.id)
      .sort((a, b) => a.seatNumber - b.seatNumber);
    const logs = this.db.godGameLogs
      .filter((l) => l.sessionId === session.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return {
      ...session,
      scenario,
      hostDisplayName: host?.displayName || 'میزبان',
      seats,
      logs,
    };
  }
}
