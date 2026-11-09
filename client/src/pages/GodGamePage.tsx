import React, { useEffect, useState, useRef } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { GodGameSession, Scenario, RoleSide } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { RoleSideBadge, GenderBadge, RokadBadge } from '../components/ui/Badge';
import { toPersianDigits, formatShamsiDate } from '../utils/formatters';
import confetti from 'canvas-confetti';
import {
  Shield,
  Plus,
  Play,
  Pause,
  RotateCcw,
  Moon,
  Sun,
  Shuffle,
  Trophy,
  AlertTriangle,
  UserX,
  Vote,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Crosshair,
  HeartPulse,
  Search,
  Volume2,
  VolumeX,
  LayoutGrid,
  CircleDot,
  Skull,
  Flame,
  ChevronDown,
  Sparkles,
  Edit3,
  BookOpen,
  Users,
} from 'lucide-react';

export const GodGamePage: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<GodGameSession[]>([]);
  const [activeSession, setActiveSession] = useState<GodGameSession | null>(null);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDistributeOpen, setIsDistributeOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [kickTargetSeat, setKickTargetSeat] = useState<any | null>(null);
  const [newLogText, setNewLogText] = useState('');

  // UI Modes
  const [viewMode, setViewMode] = useState<'grid' | 'arena'>('grid');
  const [hideRoles, setHideRoles] = useState(false);
  const [showSessionsDropdown, setShowSessionsDropdown] = useState(false);

  // Specialized Multi-Timer State
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [timerMax, setTimerMax] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Night Assistant State
  const [nightMafiaTarget, setNightMafiaTarget] = useState<number | null>(null);
  const [nightDoctorTarget, setNightDoctorTarget] = useState<number | null>(null);
  const [detectiveTarget, setDetectiveTarget] = useState<number | null>(null);
  const [detectiveResult, setDetectiveResult] = useState<string | null>(null);

  // Create Form
  const [createForm, setCreateForm] = useState({
    title: '',
    scenarioId: '',
    seatsCount: 10,
    targetGender: 'boys',
  });

  const [importWinnerSide, setImportWinnerSide] = useState<RoleSide>('CITIZEN');

  // Scenario Roles & Seat Customization
  const [activeScenarioRoles, setActiveScenarioRoles] = useState<any[]>([]);
  const [isScenarioGuideOpen, setIsScenarioGuideOpen] = useState(false);
  const [editingSeat, setEditingSeat] = useState<any | null>(null);
  const [editSeatForm, setEditSeatForm] = useState<{
    playerName: string;
    roleId?: string;
    roleName: string;
    roleSide: RoleSide;
  }>({
    playerName: '',
    roleId: '',
    roleName: '',
    roleSide: 'CITIZEN',
  });

  // Audio Beep generator using Web Audio API
  const playBeep = (freq = 880, duration = 200) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration / 1000);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration / 1000);
    } catch (e) {
      // Audio not permitted or not supported
    }
  };

  // Timer Tick Interval
  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            playBeep(440, 600);
            setTimerRunning(false);
            return 0;
          }
          if (prev <= 6) {
            playBeep(800, 80);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds, soundEnabled]);

  const setPresetTimer = (seconds: number) => {
    setTimerMax(seconds);
    setTimerSeconds(seconds);
    setTimerRunning(false);
  };

  const addTimeSeconds = (extra: number) => {
    setTimerSeconds((prev) => prev + extra);
    setTimerMax((prev) => Math.max(prev, timerSeconds + extra));
  };

  const fetchData = async () => {
    try {
      const [sessList, scList] = await Promise.all([
        api.getGodGameSessions(),
        api.getScenarios(),
      ]);
      setSessions(sessList);
      setScenarios(scList);
      if (scList.length > 0 && !createForm.scenarioId) {
        setCreateForm((prev) => ({ ...prev, scenarioId: scList[0].id }));
      }
      if (sessList.length > 0 && !activeSession) {
        setActiveSession(sessList[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (activeSession?.scenarioId) {
      api.getRoles(activeSession.scenarioId).then((rList) => {
        setActiveScenarioRoles(rList || []);
      });
    }
  }, [activeSession?.scenarioId]);

  const handleSaveSeat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSession || !editingSeat) return;
    try {
      await api.updateGodGameSeat(activeSession.id, editingSeat.seatNumber, {
        playerName: editSeatForm.playerName,
        roleId: editSeatForm.roleId,
        roleName: editSeatForm.roleName,
        roleSide: editSeatForm.roleSide,
      });
      const refreshed = await api.getGodGameSession(activeSession.id);
      setActiveSession(refreshed);
      setEditingSeat(null);
    } catch (err: any) {
      alert(err.message || 'خطا در ذخیره صندلی');
    }
  };

  const handleSelectSession = async (id: string) => {
    const s = await api.getGodGameSession(id);
    setActiveSession(s);
    setShowSessionsDropdown(false);
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.createGodGameSession(createForm);
      setSessions([created, ...sessions]);
      setActiveSession(created);
      setIsCreateOpen(false);
    } catch (err: any) {
      alert(err.message || 'خطا در ایجاد میز');
    }
  };

  const handleDistributeRoles = async () => {
    if (!activeSession) return;
    try {
      const res = await api.distributeGodGameRoles(activeSession.id);
      setActiveSession(res.session);
      setIsDistributeOpen(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handlePhaseChange = async (phase: string) => {
    if (!activeSession) return;
    let nextDay = activeSession.dayNumber;
    if (phase === 'DAY' && activeSession.currentPhase === 'NIGHT') {
      nextDay += 1;
    }
    const updated = await api.updateGodGamePhase(activeSession.id, {
      phase,
      dayNumber: nextDay,
    });
    setActiveSession(updated);

    // Reset night assistant
    if (phase === 'NIGHT') {
      setNightMafiaTarget(null);
      setNightDoctorTarget(null);
      setDetectiveTarget(null);
      setDetectiveResult(null);
      setPresetTimer(180);
    } else if (phase === 'DAY') {
      setPresetTimer(60);
    } else if (phase === 'DEFENSE') {
      setPresetTimer(60);
    }
  };

  const handleToggleAlive = async (seat: any) => {
    if (!activeSession) return;
    await api.updateGodGameSeat(activeSession.id, seat.seatNumber, {
      isAlive: !seat.isAlive,
    });
    const refreshed = await api.getGodGameSession(activeSession.id);
    setActiveSession(refreshed);
  };

  const handleAddWarning = async (seat: any) => {
    if (!activeSession) return;
    const nextWarn = (seat.warningsCount + 1) % 4; // 0, 1, 2, 3
    if (nextWarn === 3) {
      if (confirm(`صندلی ${seat.seatNumber} به ۳ اخطار رسید. آیا مایل به اخراج از بازی هستید؟`)) {
        setKickTargetSeat(seat);
        return;
      }
    }
    await api.updateGodGameSeat(activeSession.id, seat.seatNumber, {
      warningsCount: nextWarn,
    });
    const refreshed = await api.getGodGameSession(activeSession.id);
    setActiveSession(refreshed);
  };

  const handleToggleNominated = async (seat: any) => {
    if (!activeSession) return;
    await api.updateGodGameSeat(activeSession.id, seat.seatNumber, {
      isNominated: !seat.isNominated,
    });
    const refreshed = await api.getGodGameSession(activeSession.id);
    setActiveSession(refreshed);
  };

  const handleVoteChange = async (seat: any, delta: number) => {
    if (!activeSession) return;
    const newCount = Math.max(0, seat.votesCount + delta);
    await api.updateGodGameSeat(activeSession.id, seat.seatNumber, {
      votesCount: newCount,
    });
    const refreshed = await api.getGodGameSession(activeSession.id);
    setActiveSession(refreshed);
  };

  const handleClearAllVotes = async () => {
    if (!activeSession) return;
    const seats = activeSession.seats || [];
    for (const s of seats) {
      if (s.votesCount > 0) {
        await api.updateGodGameSeat(activeSession.id, s.seatNumber, { votesCount: 0 });
      }
    }
    const refreshed = await api.getGodGameSession(activeSession.id);
    setActiveSession(refreshed);
  };

  const handleConfirmKick = async () => {
    if (!activeSession || !kickTargetSeat) return;
    await api.updateGodGameSeat(activeSession.id, kickTargetSeat.seatNumber, {
      isKicked: true,
      isAlive: false,
    });
    const refreshed = await api.getGodGameSession(activeSession.id);
    setActiveSession(refreshed);
    setKickTargetSeat(null);
  };

  const handleResolveNight = async () => {
    if (!activeSession) return;
    let eliminatedSeatNum: number | null = null;

    if (nightMafiaTarget) {
      if (nightMafiaTarget !== nightDoctorTarget) {
        eliminatedSeatNum = nightMafiaTarget;
        await api.updateGodGameSeat(activeSession.id, nightMafiaTarget, { isAlive: false });
      }
    }

    const logText = eliminatedSeatNum
      ? `🌅 طلوع روز: صندلی ${eliminatedSeatNum} در شب کشته شد و از بازی خارج شد.`
      : '🌅 طلوع روز: در شب گذشته هیچ بازیکنی کشته نشد (شهر در آرامش یا نجات پزشک).';

    await api.addGodGameLog(activeSession.id, logText);
    await handlePhaseChange('DAY');
  };

  const handleCheckDetective = (seatNumber: number) => {
    if (!activeSession) return;
    const seat = activeSession.seats?.find((s) => s.seatNumber === seatNumber);
    if (!seat) return;
    setDetectiveTarget(seatNumber);
    // Godfather often shows as citizen, regular mafia shows as mafia
    const isMafia = seat.roleSide === 'MAFIA';
    setDetectiveResult(isMafia ? 'مثبت (مافیا 🔴)' : 'منفی (شهروند 🟢)');
  };

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogText.trim() || !activeSession) return;
    await api.addGodGameLog(activeSession.id, newLogText.trim());
    setNewLogText('');
    const refreshed = await api.getGodGameSession(activeSession.id);
    setActiveSession(refreshed);
  };

  const handleConfirmImportStats = async () => {
    if (!activeSession) return;
    try {
      const res = await api.importGodGameStats(activeSession.id, {
        winnerSide: importWinnerSide,
      });
      confetti({ particleCount: 110, spread: 80, origin: { y: 0.6 } });
      setActiveSession(res.session);
      setIsImportOpen(false);
    } catch (err: any) {
      alert(err.message || 'خطا در ثبت نتایج');
    }
  };

  // Calculations for live stats
  const aliveSeats = activeSession?.seats?.filter((s) => s.isAlive && !s.isKicked) || [];
  const deadSeats = activeSession?.seats?.filter((s) => !s.isAlive || s.isKicked) || [];
  const aliveCitizens = aliveSeats.filter((s) => s.roleSide === 'CITIZEN').length;
  const aliveMafias = aliveSeats.filter((s) => s.roleSide === 'MAFIA').length;
  const nominatedSeats = activeSession?.seats?.filter((s) => s.isNominated && s.isAlive) || [];

  return (
    <div className="flex flex-col gap-6 py-4 sm:py-6">
      {/* 1. TOP HEADER & HUD */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 sm:p-5 bg-[#0E1420] rounded-3xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-[#59BBAF] text-[#080B11] border-2 border-black flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(89,187,175,0.4)]">
            <Shield size={26} />
          </div>

          <div className="flex flex-col text-right min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-white truncate">کنسول زنده خدای بازی (Game Master)</h1>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-950/60 text-blue-400 border border-blue-500/30">
                مدیریت زنده مسابقه
              </span>
            </div>
            <p className="text-caption text-[#94A3B8] truncate">
              چیدمان زنده صندلی‌ها، تایمر نطق و چالش، کنترل فاز شب و روز، ثبت آرا و لیدربورد.
            </p>
          </div>
        </div>

        {/* Action Controls & Session Switcher */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* View mode toggle */}
          <div className="flex items-center bg-[#0A0E17] rounded-xl border border-[#1E293B] p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-caption font-bold transition-all ${
                viewMode === 'grid' ? 'bg-[#59BBAF] text-[#080B11]' : 'text-[#64748B] hover:text-white'
              }`}
              title="نمای شبکه‌ای"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('arena')}
              className={`p-1.5 rounded-lg text-caption font-bold transition-all ${
                viewMode === 'arena' ? 'bg-[#59BBAF] text-[#080B11]' : 'text-[#64748B] hover:text-white'
              }`}
              title="نمای میز گرد آرنا"
            >
              <CircleDot size={16} />
            </button>
          </div>

          {/* Hide Roles Button (God Shield) */}
          <button
            type="button"
            onClick={() => setHideRoles(!hideRoles)}
            className={`h-9 px-3 rounded-xl border text-caption font-bold flex items-center gap-1.5 transition-all btn-tactile ${
              hideRoles
                ? 'bg-amber-950/50 text-amber-300 border-amber-500/50'
                : 'bg-[#0A0E17] text-[#94A3B8] border-[#1E293B] hover:text-white'
            }`}
            title="مخفی‌سازی نقش‌ها برای جلوگیری از سرک کشیدن بازیکنان"
          >
            {hideRoles ? <EyeOff size={15} /> : <Eye size={15} />}
            <span className="hidden sm:inline">{hideRoles ? 'نقش‌ها مخفی' : 'دیدن نقش‌ها'}</span>
          </button>

          {/* Active Session Switcher Pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSessionsDropdown(!showSessionsDropdown)}
              className="h-9 px-3 rounded-xl bg-[#0A0E17] text-white border border-[#1E293B] hover:border-[#59BBAF] text-caption font-black flex items-center gap-1.5 btn-tactile"
            >
              <span className="max-w-[120px] truncate">{activeSession?.title || 'انتخاب میز'}</span>
              <ChevronDown size={14} className="text-[#64748B]" />
            </button>

            {showSessionsDropdown && (
              <div className="absolute left-0 mt-2 w-64 bg-[#0E1420] rounded-2xl border-1.5 border-[#1E293B] shadow-2xl p-2 z-50 animate-in zoom-in-95">
                <div className="px-3 py-1.5 text-caption font-black text-[#64748B] border-b border-[#1E293B] mb-1">
                  میزهای میزبانی من:
                </div>
                <div className="max-h-56 overflow-y-auto flex flex-col gap-1">
                  {sessions.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleSelectSession(s.id)}
                      className={`p-2.5 rounded-xl text-right text-caption font-bold transition-all flex items-center justify-between ${
                        activeSession?.id === s.id
                          ? 'bg-[#59BBAF] text-[#080B11]'
                          : 'text-[#94A3B8] hover:text-white hover:bg-[#141C2C]'
                      }`}
                    >
                      <span className="truncate">{s.title}</span>
                      <span className="text-[10px] opacity-75">{toPersianDigits(s.seatsCount)} صندلی</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Create New Session Button */}
          <Button variant="primary" size="sm" onClick={() => setIsCreateOpen(true)} className="gap-1.5">
            <Plus size={16} />
            <span className="hidden sm:inline">میز جدید</span>
          </Button>
        </div>
      </div>

      {activeSession ? (
        <div className="flex flex-col gap-6">
          {/* 2. GAME HUD BAR (Status, Alive Counts, Timer & Phase Tabs) */}
          <div className="bg-[#0E1420] rounded-3xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] p-4 sm:p-6 flex flex-col gap-5">
            {/* Top row: Live Counts & God Insights */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1E293B]">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-body-sm font-black text-white">{activeSession.title}</span>
                <button
                  type="button"
                  onClick={() => setIsScenarioGuideOpen(true)}
                  className="text-caption font-black px-2.5 py-1 rounded-xl bg-[#141C2C] text-[#59BBAF] border border-[#59BBAF]/40 hover:bg-[#59BBAF]/20 flex items-center gap-1.5 transition-all cursor-pointer shadow-hard-xs"
                  title="مشاهده قوانین، نقش‌ها و نوبت شب سناریوی فعال"
                >
                  <BookOpen size={13} />
                  <span>{activeSession.scenario?.title || 'سناریو'} (قوانین و نقش‌ها)</span>
                </button>
                <span className="text-caption font-black px-2 py-0.5 rounded-full bg-amber-950/50 text-amber-400 border border-amber-500/40">
                  روز {toPersianDigits(activeSession.dayNumber)}
                </span>
                {activeSession.isImported && (
                  <span className="text-caption font-black px-2 py-0.5 rounded-full bg-emerald-950/50 text-emerald-400 border border-emerald-500/40">
                    ✓ لیدربورد ثبت شد
                  </span>
                )}
              </div>

              {/* God-Only Live Ratio Pill */}
              <div className="flex items-center gap-2 text-caption font-black">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#0A0E17] border border-[#1E293B] text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{toPersianDigits(aliveSeats.length)} زنده</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#0A0E17] border border-[#1E293B] text-red-400">
                  <Skull size={13} />
                  <span>{toPersianDigits(deadSeats.length)} کشته</span>
                </div>
                {!hideRoles && (
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#141C2C] border border-[#59BBAF]/40 text-[#59BBAF]">
                    <span>شهر: {toPersianDigits(aliveCitizens)}</span>
                    <span>|</span>
                    <span>مافیا: {toPersianDigits(aliveMafias)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Middle row: Phase Navigation Buttons */}
            <div className="flex flex-col gap-2">
              <span className="text-caption font-bold text-[#64748B]">تغییر فاز مسابقه:</span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[
                  { id: 'SETUP', label: 'معارفه', icon: <Shuffle size={14} /> },
                  { id: 'DAY', label: 'روز', icon: <Sun size={14} /> },
                  { id: 'DEFENSE', label: 'دفاعیه', icon: <AlertTriangle size={14} /> },
                  { id: 'VOTING', label: 'رأی‌گیری', icon: <Vote size={14} /> },
                  { id: 'NIGHT', label: 'شب', icon: <Moon size={14} /> },
                  { id: 'FINISHED', label: 'پایان', icon: <Trophy size={14} /> },
                ].map((p) => {
                  const isActive = activeSession.currentPhase === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handlePhaseChange(p.id)}
                      className={`h-11 rounded-2xl font-black text-caption sm:text-body-sm flex items-center justify-center gap-1.5 border transition-all btn-tactile ${
                        isActive
                          ? 'bg-[#59BBAF] text-[#080B11] border-black shadow-[1.5px_1.5px_0_#000000] scale-[1.02]'
                          : 'bg-[#0A0E17] text-[#94A3B8] border-[#1E293B] hover:text-white hover:border-[#59BBAF]'
                      }`}
                    >
                      {p.icon}
                      <span>{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom row: Specialized Multi-Timer Bar */}
            <div className="p-4 bg-[#0A0E17] rounded-2xl border border-[#1E293B] flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Presets & Extra time */}
              <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
                <span className="text-caption font-bold text-[#64748B] ml-1">تایمر نطق:</span>
                {[
                  { label: '۳۰ث چالش', sec: 30 },
                  { label: '۶۰ث نطق', sec: 60 },
                  { label: '۳دقیقه آزاد', sec: 180 },
                ].map((t) => (
                  <button
                    key={t.sec}
                    type="button"
                    onClick={() => setPresetTimer(t.sec)}
                    className={`px-3 py-1.5 rounded-xl text-caption font-black border transition-all btn-tactile ${
                      timerMax === t.sec && !timerRunning
                        ? 'bg-[#141C2C] text-[#59BBAF] border-[#59BBAF]'
                        : 'bg-[#0E1420] text-[#94A3B8] border-[#1E293B] hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => addTimeSeconds(15)}
                  className="px-2.5 py-1.5 rounded-xl text-caption font-black bg-amber-950/40 text-amber-400 border border-amber-500/30 hover:bg-amber-900/50 btn-tactile"
                  title="افزودن ۱۵ ثانیه زمان اضافه"
                >
                  +۱۵ ثانیه
                </button>
              </div>

              {/* Central Clock Display */}
              <div className="flex items-center gap-4">
                <div
                  className={`text-3xl sm:text-4xl font-black font-mono tracking-wider px-4 py-1 rounded-2xl border-2 transition-colors ${
                    timerSeconds <= 5 && timerRunning
                      ? 'bg-red-950 text-red-400 border-red-500 animate-pulse'
                      : timerSeconds <= 15 && timerRunning
                      ? 'bg-amber-950 text-amber-400 border-amber-500'
                      : 'bg-[#0E1420] text-[#59BBAF] border-[#1E293B]'
                  }`}
                >
                  {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTimerRunning(!timerRunning)}
                    className={`w-11 h-11 rounded-2xl border flex items-center justify-center text-white transition-all btn-tactile ${
                      timerRunning
                        ? 'bg-amber-500 border-amber-600 shadow-md text-black'
                        : 'bg-[#59BBAF] border-black text-[#080B11] shadow-[1.5px_1.5px_0_#000000]'
                    }`}
                  >
                    {timerRunning ? <Pause size={20} /> : <Play size={20} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPresetTimer(timerMax)}
                    className="w-11 h-11 rounded-2xl bg-[#0E1420] border border-[#1E293B] hover:border-[#59BBAF] text-[#94A3B8] hover:text-white flex items-center justify-center transition-all btn-tactile"
                    title="ریست تایمر"
                  >
                    <RotateCcw size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`w-11 h-11 rounded-2xl border flex items-center justify-center transition-all btn-tactile ${
                      soundEnabled
                        ? 'bg-[#0E1420] text-[#59BBAF] border-[#1E293B]'
                        : 'bg-[#0E1420] text-[#64748B] border-[#1E293B]'
                    }`}
                    title={soundEnabled ? 'صدا فعال' : 'صدا غیرفعال'}
                  >
                    {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                  </button>
                </div>
              </div>

              {/* Shuffle & Leaderboard Import Actions */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsDistributeOpen(true)} className="gap-1.5">
                  <Shuffle size={14} />
                  <span className="hidden sm:inline">پخش کارت‌ها</span>
                </Button>

                {!activeSession.isImported && (
                  <Button variant="primary" size="sm" onClick={() => setIsImportOpen(true)} className="gap-1.5">
                    <Trophy size={14} />
                    <span>ثبت لیدربورد</span>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* 3. NIGHT ASSISTANT CHECKLIST (Visible when Phase is NIGHT) */}
          {activeSession.currentPhase === 'NIGHT' && (
            <div className="bg-[#0E1420] rounded-3xl border-1.5 border-indigo-500/50 shadow-[0_0_25px_rgba(99,102,241,0.2)] p-5 sm:p-6 flex flex-col gap-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
                <div className="flex items-center gap-2 text-indigo-400 font-black text-title">
                  <Moon size={20} />
                  <span>دستیار هوشمند فاز شب (اکت‌های شبانه)</span>
                </div>
                <span className="text-caption text-[#64748B]">تمام شلیک‌ها و نجات‌ها را انتخاب و خورشید را بالا بیاورید!</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Step 1: Mafia Kill */}
                <div className="p-4 bg-[#0A0E17] rounded-2xl border border-red-500/30 flex flex-col gap-2.5">
                  <div className="flex items-center gap-2 text-red-400 font-black text-body-sm">
                    <Crosshair size={16} />
                    <span>۱. شلیک شبانه مافیا:</span>
                  </div>
                  <select
                    value={nightMafiaTarget || ''}
                    onChange={(e) => setNightMafiaTarget(Number(e.target.value) || null)}
                    className="h-10 px-3 bg-[#0E1420] text-white text-caption font-bold rounded-xl border border-[#1E293B] outline-none focus:border-red-500"
                  >
                    <option value="">بدون شلیک / شات معلق</option>
                    {aliveSeats.map((s) => (
                      <option key={s.seatNumber} value={s.seatNumber}>
                        صندلی {toPersianDigits(s.seatNumber)} ({s.playerName})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Step 2: Doctor Save */}
                <div className="p-4 bg-[#0A0E17] rounded-2xl border border-emerald-500/30 flex flex-col gap-2.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-black text-body-sm">
                    <HeartPulse size={16} />
                    <span>۲. نجات پزشک (دکتر):</span>
                  </div>
                  <select
                    value={nightDoctorTarget || ''}
                    onChange={(e) => setNightDoctorTarget(Number(e.target.value) || null)}
                    className="h-10 px-3 bg-[#0E1420] text-white text-caption font-bold rounded-xl border border-[#1E293B] outline-none focus:border-emerald-500"
                  >
                    <option value="">بدون سیو</option>
                    {aliveSeats.map((s) => (
                      <option key={s.seatNumber} value={s.seatNumber}>
                        صندلی {toPersianDigits(s.seatNumber)} ({s.playerName})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Step 3: Detective Inquiry */}
                <div className="p-4 bg-[#0A0E17] rounded-2xl border border-blue-500/30 flex flex-col gap-2.5">
                  <div className="flex items-center gap-2 text-blue-400 font-black text-body-sm">
                    <Search size={16} />
                    <span>۳. استعلام کارآگاه:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={detectiveTarget || ''}
                      onChange={(e) => handleCheckDetective(Number(e.target.value))}
                      className="flex-1 h-10 px-3 bg-[#0E1420] text-white text-caption font-bold rounded-xl border border-[#1E293B] outline-none focus:border-blue-500"
                    >
                      <option value="">انتخاب صندلی...</option>
                      {aliveSeats.map((s) => (
                        <option key={s.seatNumber} value={s.seatNumber}>
                          صندلی {toPersianDigits(s.seatNumber)}
                        </option>
                      ))}
                    </select>
                    {detectiveResult && (
                      <span className="text-caption font-black px-2 py-1 bg-[#0E1420] rounded-xl border border-[#1E293B] text-white">
                        {detectiveResult}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Sun Rise Button */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-caption text-[#94A3B8]">
                  {nightMafiaTarget && nightMafiaTarget === nightDoctorTarget
                    ? '🛡️ شات مافیا توسط دکتر سیو شده است!'
                    : nightMafiaTarget
                    ? `⚠️ صندلی ${nightMafiaTarget} هدف شلیک قرار گرفته و با طلوع صبح حذف خواهد شد.`
                    : 'هیچ بازیکنی شلیک نشده است.'}
                </span>

                <Button variant="primary" size="md" onClick={handleResolveNight} className="gap-2">
                  <Sun size={18} className="text-amber-400" />
                  <span>اعلام نتایج شب و طلوع صبح ☀️</span>
                </Button>
              </div>
            </div>
          )}

          {/* 4. DEFENSE & VOTING MANAGER (Visible when Phase is DEFENSE or VOTING) */}
          {(activeSession.currentPhase === 'DEFENSE' || activeSession.currentPhase === 'VOTING') && (
            <div className="bg-[#0E1420] rounded-3xl border-1.5 border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.2)] p-5 sm:p-6 flex flex-col gap-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
                <div className="flex items-center gap-2 text-amber-400 font-black text-title">
                  <Vote size={20} />
                  <span>میز رأی‌گیری و دفاعیه ({toPersianDigits(nominatedSeats.length)} متهم روی جایگاه)</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleClearAllVotes}>
                    صفر کردن تمام آرا
                  </Button>
                </div>
              </div>

              {nominatedSeats.length === 0 ? (
                <div className="p-6 text-center text-[#64748B] font-bold bg-[#0A0E17] rounded-2xl border border-dashed border-[#1E293B]">
                  هیچ بازیکنی برای دفاعیه نامزد نشده است. با زدن دکمه «نامزد رأی» روی صندلی‌ها، متهمین را مشخص کنید.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {nominatedSeats.map((seat) => (
                    <div
                      key={seat.id}
                      className="p-4 bg-[#0A0E17] rounded-2xl border-1.5 border-amber-500/50 flex items-center justify-between gap-3 shadow-md"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-8 h-8 rounded-xl bg-amber-400 text-black font-black flex items-center justify-center text-caption shrink-0">
                          {toPersianDigits(seat.seatNumber)}
                        </span>
                        <div className="flex flex-col truncate">
                          <span className="text-body-sm font-black text-white truncate">{seat.playerName}</span>
                          <span className="text-[11px] text-amber-400">جایگاه دفاعیه</span>
                        </div>
                      </div>

                      {/* Vote Count Controls */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleVoteChange(seat, -1)}
                          className="w-8 h-8 rounded-xl bg-[#0E1420] text-white border border-[#1E293B] hover:border-amber-400 font-black flex items-center justify-center btn-tactile"
                        >
                          -
                        </button>
                        <span className="text-title font-black text-amber-400 w-6 text-center">
                          {toPersianDigits(seat.votesCount)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleVoteChange(seat, 1)}
                          className="w-8 h-8 rounded-xl bg-[#0E1420] text-white border border-[#1E293B] hover:border-amber-400 font-black flex items-center justify-center btn-tactile"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. SEATS ARENA / GRID VIEW */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#59BBAF]" />
                <h3 className="text-title sm:text-h2 font-black text-white">
                  صندلی‌های بازی ({toPersianDigits(activeSession.seats?.length || 0)} جایگاه)
                </h3>
              </div>
              <span className="text-caption text-[#64748B]">
                {viewMode === 'arena' ? 'نمای سالن مسابقاتی' : 'نمای کارت‌های مدیریتی'}
              </span>
            </div>

            {/* SEATS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {activeSession.seats?.map((seat) => (
                <div
                  key={seat.id}
                  className={`p-4 rounded-3xl border-1.5 transition-all flex flex-col justify-between gap-3 shadow-[2px_2px_0_#000000] ${
                    seat.isKicked
                      ? 'bg-red-950/20 border-red-500/40 opacity-50'
                      : !seat.isAlive
                      ? 'bg-[#0A0E17] border-gray-700 opacity-65'
                      : seat.isNominated
                      ? 'bg-[#0E1420] border-amber-500 ring-2 ring-amber-500/30'
                      : 'bg-[#0E1420] border-[#1E293B] hover:border-[#59BBAF]'
                  }`}
                >
                  {/* Seat Top Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-[#0A0E17] border border-[#1E293B] flex items-center justify-center font-black text-caption text-white">
                        {toPersianDigits(seat.seatNumber)}
                      </span>

                      {!seat.isAlive ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded-full bg-red-950/70 text-red-400 border border-red-500/40">
                          <Skull size={12} />
                          <span>کشته</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>زنده</span>
                        </span>
                      )}
                    </div>

                    {/* Disciplinary Warnings Badges */}
                    <div className="flex items-center gap-1">
                      {seat.warningsCount >= 1 && (
                        <span className="w-3.5 h-4.5 rounded-sm bg-amber-400 border border-black shadow-sm" title="کارت زرد اول" />
                      )}
                      {seat.warningsCount >= 2 && (
                        <span className="w-3.5 h-4.5 rounded-sm bg-amber-400 border border-black shadow-sm" title="کارت زرد دوم" />
                      )}
                      {seat.warningsCount >= 3 && (
                        <span className="w-3.5 h-4.5 rounded-sm bg-red-600 border border-black shadow-sm" title="کارت قرمز" />
                      )}
                      {seat.isKicked && (
                        <span className="text-[10px] font-black text-red-500 bg-red-950/80 px-1.5 py-0.5 rounded">
                          اخراج
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Player & Secret Role */}
                  <div className="flex flex-col gap-1 text-right">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className={`text-title font-black text-white truncate ${!seat.isAlive ? 'line-through text-[#64748B]' : ''}`}>
                        {seat.playerName}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSeat(seat);
                          setEditSeatForm({
                            playerName: seat.playerName || '',
                            roleId: seat.roleId || '',
                            roleName: seat.roleName || '',
                            roleSide: seat.roleSide || 'CITIZEN',
                          });
                        }}
                        className="p-1 rounded-lg bg-[#0A0E17] text-[#94A3B8] hover:text-[#59BBAF] hover:bg-[#141C2C] border border-[#1E293B] transition-colors shrink-0"
                        title="ویرایش نام بازیکن یا نقش"
                      >
                        <Edit3 size={13} />
                      </button>
                    </div>

                    {/* Role Display (Respects God Shield) */}
                    <div className="flex items-center gap-2">
                      {hideRoles ? (
                        <span className="text-[11px] font-bold text-[#64748B] italic">نقش پنهان</span>
                      ) : (
                        <>
                          <span className="text-caption font-black text-[#59BBAF]">
                            {seat.roleName || 'بدون نقش'}
                          </span>
                          {seat.roleSide && <RoleSideBadge side={seat.roleSide} />}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Live Vote counter if nominated */}
                  {seat.isNominated && (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-amber-950/30 border border-amber-500/40 text-caption font-bold text-amber-300">
                      <span>آرای اخذ شده:</span>
                      <span className="text-body font-black text-amber-400">{toPersianDigits(seat.votesCount)} رأی</span>
                    </div>
                  )}

                  {/* Seat Action Buttons Toolbar */}
                  <div className="pt-3 border-t border-[#1E293B] grid grid-cols-4 gap-1.5 text-caption">
                    {/* 1. Toggle Alive/Dead */}
                    <button
                      type="button"
                      onClick={() => handleToggleAlive(seat)}
                      className={`h-8 rounded-xl font-bold border transition-all btn-tactile text-[11px] ${
                        seat.isAlive
                          ? 'bg-red-950/40 text-red-400 border-red-500/40 hover:bg-red-900/60'
                          : 'bg-emerald-950/40 text-emerald-400 border-emerald-500/40 hover:bg-emerald-900/60'
                      }`}
                      title={seat.isAlive ? 'کشتن بازیکن' : 'احیای بازیکن'}
                    >
                      {seat.isAlive ? 'قتل' : 'احیا'}
                    </button>

                    {/* 2. Add Warning */}
                    <button
                      type="button"
                      onClick={() => handleAddWarning(seat)}
                      className="h-8 rounded-xl font-bold bg-[#0A0E17] text-amber-400 border border-[#1E293B] hover:border-amber-400 transition-all btn-tactile text-[11px]"
                      title="ثبت کارت زرد / اخطار"
                    >
                      اخطار: {toPersianDigits(seat.warningsCount)}
                    </button>

                    {/* 3. Nominate for Defense */}
                    <button
                      type="button"
                      onClick={() => handleToggleNominated(seat)}
                      className={`h-8 rounded-xl font-bold border transition-all btn-tactile text-[11px] ${
                        seat.isNominated
                          ? 'bg-amber-400 text-black border-amber-500 font-black'
                          : 'bg-[#0A0E17] text-[#94A3B8] border-[#1E293B] hover:text-white'
                      }`}
                      title="ارسال به جایگاه دفاعیه"
                    >
                      دفاعیه
                    </button>

                    {/* 4. Kick Player */}
                    <button
                      type="button"
                      onClick={() => setKickTargetSeat(seat)}
                      className="h-8 rounded-xl font-bold bg-[#0A0E17] text-red-400 border border-[#1E293B] hover:border-red-500 transition-all btn-tactile flex items-center justify-center"
                      title="اخراج انضباطی"
                    >
                      <UserX size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. GAME ACTIVITY LOG & TIMELINE */}
          <div className="bg-[#0E1420] rounded-3xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] p-5 sm:p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <div className="flex items-center gap-2 font-black text-title text-white">
                <FileText size={18} className="text-[#59BBAF]" />
                <span>گزارش وقایع و لاگ نشست داوری</span>
              </div>
              <span className="text-caption text-[#64748B]">
                {toPersianDigits(activeSession.logs?.length || 0)} رویداد ثبت شده
              </span>
            </div>

            {/* Quick Note Input */}
            <form onSubmit={handleAddLog} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="ثبت رخداد دستی (مثال: چالش بی‌پاسخ صندلی ۲، سکوت جادوگر)..."
                value={newLogText}
                onChange={(e) => setNewLogText(e.target.value)}
                className="flex-1 h-10 px-4 bg-[#0A0E17] text-body-sm rounded-xl border border-[#1E293B] outline-none focus:border-[#59BBAF] text-white placeholder-[#64748B]"
              />
              <Button variant="primary" size="sm" type="submit">
                ثبت لاگ
              </Button>
            </form>

            {/* Timeline entries */}
            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto divide-y divide-[#1E293B] pt-1">
              {activeSession.logs?.map((l) => (
                <div key={l.id} className="pt-2 flex items-start justify-between gap-4 text-caption">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-bold px-2 py-0.5 rounded-md bg-[#0A0E17] border border-[#1E293B] text-[#59BBAF] shrink-0 text-[10px]">
                      {l.phase}
                    </span>
                    <span className="font-medium text-[#E2E8F0] break-words">{l.text}</span>
                  </div>
                  <span className="text-[#64748B] shrink-0 text-[11px]">{formatShamsiDate(l.createdAt)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-[#64748B] font-bold bg-[#0E1420] rounded-3xl border-1.5 border-dashed border-[#1E293B]">
          هیچ میزی انتخاب نشده است. با زدن دکمه «میز جدید» یک نشست میزبانی بسازید.
        </div>
      )}

      {/* CREATE SESSION MODAL */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="ایجاد میز مسابقه جدید" maxWidth="md">
        <form onSubmit={handleCreateSession} className="flex flex-col gap-4 text-right">
          <div>
            <label className="text-caption font-bold text-[#64748B] block mb-1">عنوان میز:</label>
            <Input
              value={createForm.title}
              onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
              placeholder="مثال: شب‌های مافیا - دورهمی پنج‌شنبه"
              required
            />
          </div>

          <div>
            <label className="text-caption font-bold text-[#64748B] block mb-1">سناریوی بازی:</label>
            <select
              value={createForm.scenarioId}
              onChange={(e) => setCreateForm({ ...createForm, scenarioId: e.target.value })}
              className="w-full h-11 px-3 bg-[#0A0E17] text-white text-body-sm font-bold rounded-xl border border-[#1E293B] outline-none focus:border-[#59BBAF]"
            >
              {scenarios.map((sc) => (
                <option key={sc.id} value={sc.id} className="bg-[#0E1420] text-white">
                  {sc.title} ({toPersianDigits(sc.minPlayers)} تا {toPersianDigits(sc.maxPlayers)} نفره)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-caption font-bold text-[#64748B] block mb-1">تعداد صندلی‌ها:</label>
              <Input
                type="number"
                min={4}
                max={24}
                value={createForm.seatsCount}
                onChange={(e) => setCreateForm({ ...createForm, seatsCount: Number(e.target.value) })}
                required
              />
            </div>

            <div>
              <label className="text-caption font-bold text-[#64748B] block mb-1">جنسیت میز:</label>
              <select
                value={createForm.targetGender}
                onChange={(e) => setCreateForm({ ...createForm, targetGender: e.target.value })}
                className="w-full h-11 px-3 bg-[#0A0E17] text-white text-body-sm font-bold rounded-xl border border-[#1E293B] outline-none focus:border-[#59BBAF]"
              >
                <option value="boys">پسران</option>
                <option value="girls">دختران</option>
                <option value="mixed">مختلط / عمومی</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1E293B]">
            <Button variant="outline" size="md" type="button" onClick={() => setIsCreateOpen(false)}>
              انصراف
            </Button>
            <Button variant="primary" size="md" type="submit">
              ایجاد میز مسابقه
            </Button>
          </div>
        </form>
      </Modal>

      {/* DISTRIBUTE ROLES MODAL */}
      <Modal isOpen={isDistributeOpen} onClose={() => setIsDistributeOpen(false)} title="پخش تصادفی نقش‌های سناریو" maxWidth="sm">
        <div className="flex flex-col gap-4 text-right py-2">
          <p className="text-body-sm text-[#94A3B8] leading-relaxed">
            آیا مایل به بر زدن کارت‌ها و اختصاص تصادفی نقش‌ها به تمام صندلی‌های این میز هستید؟ نقش‌های پیشین جایگزین خواهند شد.
          </p>

          <div className="flex items-center gap-2 pt-3 border-t border-[#1E293B]">
            <Button variant="outline" size="md" onClick={() => setIsDistributeOpen(false)} className="flex-1">
              انصراف
            </Button>
            <Button variant="primary" size="md" onClick={handleDistributeRoles} className="flex-1 gap-1.5">
              <Shuffle size={16} />
              <span>پخش تصادفی</span>
            </Button>
          </div>
        </div>
      </Modal>

      {/* KICK PLAYER CONFIRMATION MODAL */}
      <Modal isOpen={!!kickTargetSeat} onClose={() => setKickTargetSeat(null)} title="تأیید اخراج انضباطی بازیکن" maxWidth="sm">
        <div className="flex flex-col gap-4 text-right py-2">
          <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-red-300 text-caption font-bold">
            ⚠️ بازیکن از این مسابقه اخراج، کشته و صندلی مسدود می‌شود.
          </div>

          <p className="text-body-sm text-white">
            آیا از اخراج انضباطی صندلی {kickTargetSeat?.seatNumber} ({kickTargetSeat?.playerName}) اطمینان دارید؟
          </p>

          <div className="flex items-center gap-2 pt-3 border-t border-[#1E293B]">
            <Button variant="outline" size="md" onClick={() => setKickTargetSeat(null)} className="flex-1">
              انصراف
            </Button>
            <Button variant="danger" size="md" onClick={handleConfirmKick} className="flex-1">
              تأیید اخراج
            </Button>
          </div>
        </div>
      </Modal>

      {/* IMPORT TO LEADERBOARD MODAL */}
      <Modal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} title="ثبت نتایج نهایی در لیدربورد باشگاه" maxWidth="md">
        <div className="flex flex-col gap-4 text-right py-2">
          <p className="text-body-sm text-[#94A3B8] leading-relaxed">
            با ثبت نتایج، برای اعضای تیم برنده +۵۰ امتیاز و برای تیم بازنده -۲۰ امتیاز در لیدربورد رسمی باشگاه منظور خواهد شد. (این عملیات یک‌بار قابل انجام است).
          </p>

          <div>
            <label className="text-caption font-bold text-[#64748B] block mb-2">ساید پیروز بازی را مشخص کنید:</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'CITIZEN', label: 'پیروزی شهروندان 🟢', color: 'emerald' },
                { id: 'MAFIA', label: 'پیروزی مافیا 🔴', color: 'red' },
                { id: 'INDEPENDENT', label: 'ساید مستقل 🟣', color: 'purple' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setImportWinnerSide(s.id as any)}
                  className={`py-3 px-2 rounded-2xl text-caption font-black border transition-all btn-tactile ${
                    importWinnerSide === s.id
                      ? 'bg-[#59BBAF] text-[#080B11] border-black shadow-[1.5px_1.5px_0_#000000]'
                      : 'bg-[#0A0E17] text-[#94A3B8] border-[#1E293B] hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-4 border-t border-[#1E293B]">
            <Button variant="outline" size="md" onClick={() => setIsImportOpen(false)} className="flex-1">
              انصراف
            </Button>
            <Button variant="primary" size="md" onClick={handleConfirmImportStats} className="flex-1 gap-1.5">
              <Trophy size={16} />
              <span>ثبت رسمی امتیازات</span>
            </Button>
          </div>
        </div>
      </Modal>

      {/* EDIT SEAT & ROLE MODAL */}
      <Modal
        isOpen={!!editingSeat}
        onClose={() => setEditingSeat(null)}
        title={`ویرایش صندلی ${editingSeat?.seatNumber}`}
        maxWidth="sm"
      >
        <form onSubmit={handleSaveSeat} className="flex flex-col gap-4 text-right py-2">
          <div>
            <label className="text-caption font-bold text-[#64748B] block mb-1">نام بازیکن:</label>
            <Input
              value={editSeatForm.playerName}
              onChange={(e) => setEditSeatForm({ ...editSeatForm, playerName: e.target.value })}
              placeholder="نام بازیکن روی صندلی"
              required
            />
          </div>

          <div>
            <label className="text-caption font-bold text-[#64748B] block mb-1">نقش بازیکن:</label>
            <select
              value={editSeatForm.roleId || ''}
              onChange={(e) => {
                const selected = activeScenarioRoles.find((r) => r.id === e.target.value);
                if (selected) {
                  setEditSeatForm({
                    ...editSeatForm,
                    roleId: selected.id,
                    roleName: selected.name,
                    roleSide: selected.side,
                  });
                } else {
                  setEditSeatForm({
                    ...editSeatForm,
                    roleId: '',
                  });
                }
              }}
              className="w-full h-11 px-3 bg-[#0A0E17] text-white text-body-sm font-bold rounded-xl border border-[#1E293B] outline-none focus:border-[#59BBAF]"
            >
              <option value="">-- انتخاب از نقش‌های سناریو --</option>
              {activeScenarioRoles.map((r) => (
                <option key={r.id} value={r.id} className="bg-[#0E1420] text-white">
                  {r.name} ({r.side === 'MAFIA' ? 'مافیا 🔴' : 'شهروند 🟢'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-caption font-bold text-[#64748B] block mb-1">نام سفارشی نقش (اختیاری):</label>
            <Input
              value={editSeatForm.roleName}
              onChange={(e) => setEditSeatForm({ ...editSeatForm, roleName: e.target.value })}
              placeholder="مثلاً: کارآگاه، رئیس مافیا..."
            />
          </div>

          <div>
            <label className="text-caption font-bold text-[#64748B] block mb-1.5">ساید بازیکن:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setEditSeatForm({ ...editSeatForm, roleSide: 'CITIZEN' })}
                className={`py-2 px-3 rounded-xl text-caption font-black border transition-all ${
                  editSeatForm.roleSide === 'CITIZEN'
                    ? 'bg-emerald-500 text-black border-black shadow-[1.5px_1.5px_0_#000000]'
                    : 'bg-[#0A0E17] text-[#94A3B8] border-[#1E293B]'
                }`}
              >
                شهروند 🟢
              </button>
              <button
                type="button"
                onClick={() => setEditSeatForm({ ...editSeatForm, roleSide: 'MAFIA' })}
                className={`py-2 px-3 rounded-xl text-caption font-black border transition-all ${
                  editSeatForm.roleSide === 'MAFIA'
                    ? 'bg-red-500 text-white border-black shadow-[1.5px_1.5px_0_#000000]'
                    : 'bg-[#0A0E17] text-[#94A3B8] border-[#1E293B]'
                }`}
              >
                مافیا 🔴
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-[#1E293B]">
            <Button variant="outline" size="md" type="button" onClick={() => setEditingSeat(null)} className="flex-1">
              انصراف
            </Button>
            <Button variant="primary" size="md" type="submit" className="flex-1">
              ذخیره تغییرات
            </Button>
          </div>
        </form>
      </Modal>

      {/* SCENARIO GUIDE & ROLES MODAL */}
      <Modal
        isOpen={isScenarioGuideOpen}
        onClose={() => setIsScenarioGuideOpen(false)}
        title={activeSession?.scenario?.title || 'راهنمای سناریو'}
        maxWidth="lg"
      >
        <div className="flex flex-col gap-5 text-right py-2 max-h-[75vh] overflow-y-auto pr-1">
          {activeSession?.scenario?.description && (
            <p className="text-body-sm text-[#94A3B8] leading-relaxed">
              {activeSession.scenario.description}
            </p>
          )}

          {activeSession?.scenario?.rules && (
            <div className="p-4 bg-amber-950/25 rounded-2xl border border-amber-500/30 flex flex-col gap-1.5">
              <span className="text-caption font-black text-amber-400 flex items-center gap-1.5">
                <Sparkles size={15} />
                <span>قوانین و مکانیزم‌های اختصاصی:</span>
              </span>
              <p className="text-body-sm text-amber-200/90 leading-relaxed whitespace-pre-line">
                {activeSession.scenario.rules}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-caption">
            <div className="p-3 bg-emerald-950/20 rounded-xl border border-emerald-500/25">
              <span className="font-black text-emerald-400 block mb-1">🟢 شرط پیروزی شهروندان:</span>
              <p className="text-emerald-200/90 leading-relaxed">{activeSession?.scenario?.victoryCitizen}</p>
            </div>
            <div className="p-3 bg-red-950/20 rounded-xl border border-red-500/25">
              <span className="font-black text-red-400 block mb-1">🔴 شرط پیروزی مافیا:</span>
              <p className="text-red-200/90 leading-relaxed">{activeSession?.scenario?.victoryMafia}</p>
            </div>
          </div>

          {activeSession?.scenario?.nightPhaseRules && (
            <div className="p-3.5 bg-indigo-950/25 rounded-xl border border-indigo-500/30 text-caption text-indigo-200">
              <span className="font-black text-indigo-400 flex items-center gap-1.5 mb-1">
                <Moon size={14} />
                <span>نوبت و فاز شب:</span>
              </span>
              <p className="leading-relaxed">{activeSession.scenario.nightPhaseRules}</p>
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2">
            <h4 className="text-title font-black text-white flex items-center gap-2">
              <Users size={18} className="text-[#59BBAF]" />
              <span>کارت‌های نقش این سناریو ({toPersianDigits(activeScenarioRoles.length)} نقش):</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeScenarioRoles.map((r) => (
                <div key={r.id} className="p-3.5 bg-[#0A0E17] rounded-xl border border-[#1E293B] flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-body-sm font-black text-white">{r.name}</span>
                    <RoleSideBadge side={r.side} />
                  </div>
                  <p className="text-[12px] text-[#94A3B8] leading-relaxed line-clamp-2">{r.description}</p>
                  <div className="bg-[#141C2C] p-2 rounded-lg text-[11px] text-[#CBD5E1] leading-relaxed border border-[#1E293B]">
                    <strong className="text-[#59BBAF] block">توانایی:</strong>
                    {r.abilities}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#1E293B] flex justify-end">
            <Button variant="outline" size="md" onClick={() => setIsScenarioGuideOpen(false)}>
              بستن راهنما
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
