import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { EventItem, GameCategory, Scenario, Article } from '../types';
import { Button } from '../components/ui/Button';
import { GenderBadge, RokadBadge } from '../components/ui/Badge';
import { formatTomans, formatShamsiDate, toPersianDigits } from '../utils/formatters';
import {
  Gamepad2,
  Calendar,
  BookOpen,
  Trophy,
  ArrowLeft,
  Sparkles,
  Users,
  ShieldCheck,
  Flame,
  Award,
  Clock,
  MapPin,
  CheckCircle2,
  Skull,
  Zap,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getHomepage()
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#59BBAF] text-[#080B11] border-2 border-black shadow-[0_0_20px_rgba(89,187,175,0.4)] flex items-center justify-center animate-bounce">
            <Gamepad2 size={26} />
          </div>
          <span className="text-body-sm font-black text-[#59BBAF]">در حال ورود به کلاب گیم‌کاد...</span>
        </div>
      </div>
    );
  }

  const spotlight: EventItem | null = data?.spotlight;
  const upcomingEvents: EventItem[] = data?.upcomingEvents || [];
  const categories: GameCategory[] = data?.categories || [];
  const scenarios: Scenario[] = data?.scenarios || [];
  const topPlayers = data?.topPlayers || [];
  const mvps = data?.mvps || [];

  return (
    <div className="flex flex-col gap-8 sm:gap-12 py-4 sm:py-8 max-w-5xl mx-auto">
      {/* MOBILE QUICK STORY PILLS */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar select-none">
        <Link to="/events" className="flex flex-col items-center gap-1.5 shrink-0 group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 p-0.5 shadow-hard-xs group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-2xl bg-[#0E1420] flex items-center justify-center text-red-400">
              <Skull size={24} />
            </div>
          </div>
          <span className="text-[11px] font-black text-white">شب‌های مافیا</span>
        </Link>

        <Link to="/games" className="flex flex-col items-center gap-1.5 shrink-0 group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#59BBAF] to-blue-500 p-0.5 shadow-hard-xs group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-2xl bg-[#0E1420] flex items-center justify-center text-[#59BBAF]">
              <Gamepad2 size={24} />
            </div>
          </div>
          <span className="text-[11px] font-black text-white">فوتبال PS5</span>
        </Link>

        <Link to="/leaderboard" className="flex flex-col items-center gap-1.5 shrink-0 group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-purple-600 p-0.5 shadow-hard-xs group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-2xl bg-[#0E1420] flex items-center justify-center text-amber-400">
              <Trophy size={24} />
            </div>
          </div>
          <span className="text-[11px] font-black text-white">رنکینگ کلاب</span>
        </Link>

        <Link to="/guide" className="flex flex-col items-center gap-1.5 shrink-0 group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 p-0.5 shadow-hard-xs group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-2xl bg-[#0E1420] flex items-center justify-center text-purple-400">
              <BookOpen size={24} />
            </div>
          </div>
          <span className="text-[11px] font-black text-white">کارت‌های نقش</span>
        </Link>

        <Link to="/account/wallet" className="flex flex-col items-center gap-1.5 shrink-0 group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-600 p-0.5 shadow-hard-xs group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-2xl bg-[#0E1420] flex items-center justify-center text-emerald-400">
              <Zap size={24} />
            </div>
          </div>
          <span className="text-[11px] font-black text-white">شارژ کیف</span>
        </Link>
      </div>

      {/* 1. HERO SECTION (GAMING ADRENALINE) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0E1420] via-[#0E1420] to-[#080B11] border-1.5 border-[#1E293B] shadow-[0_10px_35px_rgba(0,0,0,0.8)] p-5 sm:p-10">
        <div className="flex flex-col gap-4 text-right relative z-10 min-w-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#59BBAF]/15 text-[#59BBAF] border border-[#59BBAF]/30 w-fit text-caption font-black max-w-full truncate">
            <Flame size={14} className="text-amber-400 animate-pulse shrink-0" />
            <span className="truncate">کلاب بازی‌های حضوری و تورنمنت‌های مسابقاتی مشهد</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-normal sm:leading-tight tracking-tight break-words">
            میدان نبرد، بلوف‌های سنگین و <span className="text-[#59BBAF] underline decoration-[#59BBAF]/40">آدرنالین خالص</span>
          </h1>

          <p className="text-body-sm sm:text-body text-[#94A3B8] leading-relaxed max-w-2xl break-words">
            رزرو فوری صندلی در شب‌های مافیا با کارت‌های فیزیکی نئوبروتالیسم، شبیه‌سازی لابی‌های پشت‌پرده، دوئل‌های کنسولی پلی‌استیشن ۵ و رقابت برای صدرنشینی در جدول رنکینگ مشهد.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link to="/events" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                <Calendar size={18} />
                <span>رزرو صندلی میز امشب</span>
              </Button>
            </Link>
            <Link to="/guide" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Skull size={18} className="text-red-400" />
                <span>کارت‌های نقش و سناریوها</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative Watermark */}
        <div className="absolute left-2 -bottom-10 opacity-5 pointer-events-none hidden sm:block text-[#59BBAF]">
          <Gamepad2 size={320} />
        </div>
      </section>

      {/* 2. SPOTLIGHT EVENT (HOT MATCH) */}
      {spotlight && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame size={20} className="text-amber-400" />
              <h2 className="text-h2 font-black text-white">میز داغ امشب (آماده نبرد)</h2>
            </div>
            <Link to={`/events/${spotlight.id}`} className="text-caption font-bold text-[#59BBAF] flex items-center gap-1 hover:underline">
              <span>رزرو فوری</span>
              <ArrowLeft size={14} />
            </Link>
          </div>

          <div className="p-5 sm:p-6 bg-[#0E1420] rounded-2xl border-1.5 border-[#59BBAF]/60 shadow-[0_0_20px_rgba(89,187,175,0.15)] flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="flex flex-col gap-2.5 max-w-xl text-right">
              <div className="flex flex-wrap items-center gap-2">
                <GenderBadge targetGender={spotlight.targetGender} />
                <span className="text-caption font-black px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/40">
                  {toPersianDigits(spotlight.remainingSeats || 0)} صندلی خالی
                </span>
                <span className="text-caption font-bold px-2 py-0.5 rounded-full bg-[#141C2C] text-[#94A3B8] border border-[#1E293B]">
                  {spotlight.category?.name || 'شب‌های مافیا'}
                </span>
              </div>

              <h3 className="text-h1 font-black text-white leading-snug break-words">{spotlight.title}</h3>
              <p className="text-body-sm text-[#94A3B8] leading-relaxed line-clamp-2">{spotlight.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-caption font-bold text-[#64748B] pt-1">
                <span className="flex items-center gap-1 text-white">
                  <Clock size={14} className="text-[#59BBAF]" />
                  <span>{formatShamsiDate(spotlight.startTime)}</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} className="text-[#59BBAF]" />
                  <span className="truncate">{spotlight.venueAddress}</span>
                </span>
              </div>
            </div>

            <div className="flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 shrink-0 p-4 bg-[#0A0E17] rounded-xl border border-[#1E293B] w-full md:w-auto">
              <div className="text-right">
                <span className="text-[11px] text-[#64748B] font-bold block">ورودی میز:</span>
                <span className="text-title sm:text-h1 font-black text-[#59BBAF]">
                  {formatTomans(spotlight.price)}
                </span>
              </div>
              <Link to={`/events/${spotlight.id}`}>
                <Button variant="primary" size="md">
                  رزرو صندلی
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 3. UPCOMING TABLES (EVENTS GRID) */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-[#59BBAF]" />
            <h2 className="text-h2 font-black text-white">میزهای بازی پیش‌رو</h2>
          </div>
          <Link to="/events" className="text-caption font-bold text-[#59BBAF] flex items-center gap-1 hover:underline">
            <span>همه میزها</span>
            <ArrowLeft size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingEvents.map((evt) => (
            <div
              key={evt.id}
              className="bg-[#0E1420] rounded-2xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] hover:border-[#59BBAF] transition-all p-5 flex flex-col justify-between gap-4"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <GenderBadge targetGender={evt.targetGender} />
                  <span className="text-caption font-black text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    {toPersianDigits(evt.remainingSeats || 0)} خالی
                  </span>
                </div>
                <h3 className="text-title font-black text-white line-clamp-1">{evt.title}</h3>
                <p className="text-body-sm text-[#94A3B8] line-clamp-2 leading-relaxed">{evt.description}</p>
              </div>

              <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#64748B] block">هزینه ورودی:</span>
                  <span className="text-body-sm font-black text-[#59BBAF]">{formatTomans(evt.price)}</span>
                </div>
                <Link to={`/events/${evt.id}`}>
                  <Button variant="outline" size="sm">
                    رزرو
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SCENARIOS WITH FLIP PREVIEW */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skull size={20} className="text-red-400" />
            <h2 className="text-h2 font-black text-white">سناریوهای رسمی مافیا</h2>
          </div>
          <Link to="/guide" className="text-caption font-bold text-[#59BBAF] flex items-center gap-1 hover:underline">
            <span>آرشیو کامل سناریوها</span>
            <ArrowLeft size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scenarios.map((sc) => (
            <div
              key={sc.id}
              className="bg-[#0E1420] rounded-2xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] p-5 flex flex-col justify-between gap-4"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black px-2 py-0.5 rounded bg-[#141C2C] text-[#59BBAF] border border-[#1E293B]">
                    {sc.title}
                  </span>
                  <span className="text-[11px] font-bold text-[#64748B]">
                    {toPersianDigits(sc.minPlayers)} تا {toPersianDigits(sc.maxPlayers)} نفره
                  </span>
                </div>
                <h3 className="text-title font-black text-white leading-snug break-words">{sc.title}</h3>
                <p className="text-body-sm text-[#94A3B8] line-clamp-3 leading-relaxed">
                  {sc.description}
                </p>
              </div>

              <Link to={`/guide/scenarios/${sc.slug}`}>
                <Button variant="outline" size="sm" className="w-full">
                  کارت‌های نقش و قوانین
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 5. LEADERBOARD RANKING PREVIEW */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy size={20} className="text-amber-400" />
            <h2 className="text-h2 font-black text-white">گرگ‌های شب (رنکینگ برتر)</h2>
          </div>
          <Link to="/leaderboard" className="text-caption font-bold text-[#59BBAF] flex items-center gap-1 hover:underline">
            <span>مشاهده جدول کامل</span>
            <ArrowLeft size={14} />
          </Link>
        </div>

        <div className="bg-[#0E1420] rounded-2xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] overflow-hidden">
          <div className="divide-y border-[#1E293B]">
            {topPlayers.map((player: any) => (
              <div key={player.userId} className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-[#141C2C] transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-body-sm border-1.5 ${
                    player.rank === 1 ? 'bg-amber-400 text-black border-amber-500 shadow-md' :
                    player.rank === 2 ? 'bg-slate-300 text-black border-slate-400' :
                    player.rank === 3 ? 'bg-amber-600 text-white border-amber-700' :
                    'bg-[#0A0E17] text-[#64748B] border-[#1E293B]'
                  }`}>
                    {toPersianDigits(player.rank)}
                  </div>

                  <Link to={`/players/${player.username}`} className="flex items-center gap-2.5 hover:text-[#59BBAF] min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#59BBAF] text-[#080B11] font-black flex items-center justify-center text-body-sm shrink-0 overflow-hidden border border-black/40">
                      {player.avatar ? (
                        <img src={player.avatar} alt={player.displayName} className="w-full h-full object-cover" />
                      ) : (
                        player.displayName.slice(0, 1)
                      )}
                    </div>
                    <div className="flex flex-col text-right min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-body-sm font-black text-white truncate max-w-[120px] sm:max-w-[200px]">{player.displayName}</span>
                        <RokadBadge membership={player.membership} size="sm" />
                      </div>
                      <span className="text-[11px] text-[#64748B] font-mono dir-ltr text-right truncate">@{player.username}</span>
                    </div>
                  </Link>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-left hidden sm:block">
                    <span className="text-[11px] text-[#64748B] block">بردها:</span>
                    <span className="text-caption font-bold text-emerald-400">{toPersianDigits(player.wins)} برد</span>
                  </div>
                  <div className="text-left">
                    <span className="text-[11px] text-[#64748B] block">امتیاز کل:</span>
                    <span className="text-title font-black text-[#59BBAF]">{toPersianDigits(player.score)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. MVP SHOWCASE */}
      {mvps.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Award size={20} className="text-amber-400" />
            <h2 className="text-h2 font-black text-white">ستاره‌های هفته کلاب (MVP)</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mvps.map((mvp: any) => (
              <div
                key={mvp.id}
                className="p-5 bg-gradient-to-r from-amber-500/10 via-[#0E1420] to-[#0E1420] rounded-2xl border-1.5 border-amber-500/40 shadow-[2px_2px_0_#000000] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400 text-black border-2 border-black flex items-center justify-center font-black text-xl shadow-hard-xs">
                    👑
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-caption font-black text-amber-400">{mvp.period}</span>
                    <h3 className="text-title font-black text-white">{mvp.title}</h3>
                    <span className="text-body-sm font-bold text-[#94A3B8]">{mvp.userDisplayName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
