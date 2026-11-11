import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { EventItem, GameCategory, Scenario } from '../types';
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
  Flame,
  Award,
  Clock,
  MapPin,
  Skull,
  Zap,
  Star,
  Shield,
  Crown,
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
          <div className="w-14 h-14 rounded-2xl bg-[#59BBAF] text-[#080B11] border-2 border-black shadow-[0_0_25px_rgba(89,187,175,0.5)] flex items-center justify-center animate-bounce">
            <Gamepad2 size={30} />
          </div>
          <span className="text-body-sm font-black text-[#59BBAF]">در حال ورود به کلاب گیم‌کاد...</span>
        </div>
      </div>
    );
  }

  const spotlight: EventItem | null = data?.spotlight;
  const upcomingEvents: EventItem[] = data?.upcomingEvents || [];
  const scenarios: Scenario[] = data?.scenarios || [];
  const topPlayers = data?.topPlayers || [];
  const mvps = data?.mvps || [];

  // Top 3 for podium
  const rank1 = topPlayers.find((p: any) => p.rank === 1);
  const rank2 = topPlayers.find((p: any) => p.rank === 2);
  const rank3 = topPlayers.find((p: any) => p.rank === 3);
  const otherPlayers = topPlayers.filter((p: any) => p.rank > 3);

  return (
    <div className="flex flex-col gap-10 sm:gap-14 py-4 sm:py-8 max-w-5xl mx-auto w-full min-w-0">
      {/* QUICK STORY CIRCLES */}
      <div className="flex items-center justify-center gap-3 sm:gap-5 overflow-x-auto pb-2 pt-1 no-scrollbar select-none w-full max-w-full">
        <Link to="/events" className="flex flex-col items-center gap-1.5 shrink-0 group">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 p-0.5 shadow-hard-xs group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-2xl bg-[#0E1420] flex items-center justify-center text-red-400">
              <Skull size={26} />
            </div>
          </div>
          <span className="text-[11px] font-black text-white">شب‌های مافیا</span>
        </Link>

        <Link to="/games" className="flex flex-col items-center gap-1.5 shrink-0 group">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-[#59BBAF] to-blue-500 p-0.5 shadow-hard-xs group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-2xl bg-[#0E1420] flex items-center justify-center text-[#59BBAF]">
              <Gamepad2 size={26} />
            </div>
          </div>
          <span className="text-[11px] font-black text-white">فوتبال PS5</span>
        </Link>

        <Link to="/leaderboard" className="flex flex-col items-center gap-1.5 shrink-0 group">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-purple-600 p-0.5 shadow-hard-xs group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-2xl bg-[#0E1420] flex items-center justify-center text-amber-400">
              <Trophy size={26} />
            </div>
          </div>
          <span className="text-[11px] font-black text-white">رنکینگ کلاب</span>
        </Link>

        <Link to="/guide" className="flex flex-col items-center gap-1.5 shrink-0 group">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 p-0.5 shadow-hard-xs group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-2xl bg-[#0E1420] flex items-center justify-center text-purple-400">
              <BookOpen size={26} />
            </div>
          </div>
          <span className="text-[11px] font-black text-white">کارت‌های نقش</span>
        </Link>

        <Link to="/account/wallet" className="flex flex-col items-center gap-1.5 shrink-0 group">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-600 p-0.5 shadow-hard-xs group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-2xl bg-[#0E1420] flex items-center justify-center text-emerald-400">
              <Zap size={26} />
            </div>
          </div>
          <span className="text-[11px] font-black text-white">شارژ کیف</span>
        </Link>
      </div>

      {/* 1. CENTERED HERO BANNER (GAMING ADRENALINE) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0E1420] via-[#0E1420] to-[#080B11] border-1.5 border-[#1E293B] shadow-[0_15px_40px_rgba(0,0,0,0.8)] p-6 sm:p-12 text-center flex flex-col items-center justify-center w-full max-w-full">
        {/* Decorative Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 sm:w-96 h-28 bg-[#59BBAF]/15 blur-3xl pointer-events-none rounded-full" />

        <div className="flex flex-col items-center gap-5 relative z-10 max-w-3xl w-full min-w-0">
          {/* Centered Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#59BBAF]/15 text-[#59BBAF] border border-[#59BBAF]/30 text-caption font-black shadow-[0_0_15px_rgba(89,187,175,0.2)]">
            <Flame size={15} className="text-amber-400 animate-pulse shrink-0" />
            <span>کلاب رسمی مسابقات حضوری و شب‌های مافیا در مشهد</span>
          </div>

          {/* Centered Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight break-words">
            میدان نبرد، بلوف‌های سنگین و{' '}
            <span className="bg-gradient-to-r from-[#59BBAF] via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              آدرنالین خالص
            </span>
          </h1>

          {/* Centered Subtitle */}
          <p className="text-body-sm sm:text-body text-[#94A3B8] leading-relaxed max-w-2xl break-words">
            رزرو فوری صندلی در شب‌های مافیا با کارت‌های فیزیکی نئوبروتالیسم، شبیه‌سازی لابی‌های پشت‌پرده، دوئل‌های کنسولی پلی‌استیشن ۵ و رقابت برای صدرنشینی در جدول رنکینگ مشهد.
          </p>

          {/* Centered Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2 w-full sm:w-auto">
            <Link to="/events" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-[0_0_20px_rgba(89,187,175,0.3)]">
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

          {/* Centered Stat Badges (3 Visual Metrics) */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 pt-6 border-t border-[#1E293B] w-full max-w-lg">
            <div className="flex flex-col items-center p-3 rounded-2xl bg-[#0A0E17] border border-[#1E293B]">
              <span className="text-title sm:text-h1 font-black text-[#59BBAF]">۵۰۰+</span>
              <span className="text-[11px] sm:text-caption font-bold text-[#64748B] mt-0.5">بازیکن عضو</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-2xl bg-[#0A0E17] border border-[#1E293B]">
              <span className="text-title sm:text-h1 font-black text-amber-400">۴</span>
              <span className="text-[11px] sm:text-caption font-bold text-[#64748B] mt-0.5">سناریوی رسمی</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-2xl bg-[#0A0E17] border border-[#1E293B]">
              <span className="text-title sm:text-h1 font-black text-emerald-400">۱۰۰٪</span>
              <span className="text-[11px] sm:text-caption font-bold text-[#64748B] mt-0.5">حضوری در مشهد</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SPOTLIGHT EVENT (HOT MATCH SHOWCASE) */}
      {spotlight && (
        <section className="flex flex-col gap-3.5 w-full max-w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping shrink-0" />
              <Flame size={20} className="text-amber-400 shrink-0" />
              <h2 className="text-title sm:text-h2 font-black text-white">میز داغ امشب (آماده نبرد)</h2>
            </div>
            <Link to={`/events/${spotlight.id}`} className="text-caption font-bold text-[#59BBAF] flex items-center gap-1 hover:underline shrink-0">
              <span>رزرو فوری</span>
              <ArrowLeft size={14} />
            </Link>
          </div>

          <div className="p-4 sm:p-6 bg-gradient-to-r from-[#0E1420] via-[#0E1420] to-[#141C2C] rounded-3xl border-1.5 border-[#59BBAF]/60 shadow-[0_0_25px_rgba(89,187,175,0.18)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 w-full max-w-full overflow-hidden">
            {/* Visual Icon Badge */}
            <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-[#59BBAF]/10 border border-[#59BBAF]/40 flex items-center justify-center text-3xl sm:text-4xl text-[#59BBAF] shadow-inner shrink-0 self-center md:self-auto">
              🎭
            </div>

            {/* Content Details */}
            <div className="flex flex-col gap-2.5 max-w-xl text-right w-full min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <GenderBadge targetGender={spotlight.targetGender} />
                <span className="text-caption font-black px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 shrink-0">
                  {toPersianDigits(spotlight.remainingSeats || 0)} صندلی خالی باقی‌مانده
                </span>
                <span className="text-caption font-bold px-2.5 py-0.5 rounded-full bg-[#141C2C] text-[#94A3B8] border border-[#1E293B] shrink-0">
                  {spotlight.category?.name || 'شب‌های مافیا'}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white leading-snug break-words">
                {spotlight.title}
              </h3>
              
              <p className="text-body-sm text-[#94A3B8] leading-relaxed break-words overflow-hidden">
                {spotlight.description}
              </p>

              {/* Graphical Visual Seat Bar */}
              <div className="flex flex-col gap-1.5 pt-1 w-full max-w-md">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#64748B]">
                  <span>ظرفیت میز: {toPersianDigits(spotlight.reservedCount || 0)} رزرو شده از {toPersianDigits(spotlight.capacity || 12)}</span>
                  <span className="text-emerald-400 font-black">
                    {Math.round(((spotlight.reservedCount || 0) / (spotlight.capacity || 12)) * 100)}٪ تکمیل
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#0A0E17] border border-[#1E293B] overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-500 to-[#59BBAF] transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(10, ((spotlight.reservedCount || 0) / (spotlight.capacity || 12)) * 100))}%`,
                    }}
                  />
                </div>
              </div>

              {/* Time and Venue info */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-caption font-bold text-[#64748B] pt-1 max-w-full">
                <span className="flex items-center gap-1 text-white shrink-0">
                  <Clock size={14} className="text-[#59BBAF]" />
                  <span>{formatShamsiDate(spotlight.startTime)}</span>
                </span>
                <span className="flex items-center gap-1.5 min-w-0 max-w-full">
                  <MapPin size={14} className="text-[#59BBAF] shrink-0" />
                  <span className="truncate block max-w-[200px] sm:max-w-xs md:max-w-md" title={spotlight.venueAddress}>
                    {spotlight.venueAddress}
                  </span>
                </span>
              </div>
            </div>

            {/* Pricing Card & CTA */}
            <div className="flex flex-row md:flex-col items-center justify-between md:justify-center gap-3 shrink-0 p-4 bg-[#0A0E17] rounded-2xl border border-[#1E293B] w-full md:w-auto shadow-hard-xs">
              <div className="text-right min-w-0">
                <span className="text-[11px] text-[#64748B] font-bold block">ورودی هر صندلی:</span>
                <span className="text-title sm:text-h1 font-black text-[#59BBAF] whitespace-nowrap">
                  {formatTomans(spotlight.price)}
                </span>
              </div>
              <Link to={`/events/${spotlight.id}`} className="shrink-0">
                <Button variant="primary" size="md">
                  رزرو صندلی
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 3. UPCOMING TABLES (EVENTS GRID WITH VISUAL SEAT METERS) */}
      <section className="flex flex-col gap-3.5 w-full max-w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-[#59BBAF] shrink-0" />
            <h2 className="text-title sm:text-h2 font-black text-white">میزهای بازی پیش‌رو</h2>
          </div>
          <Link to="/events" className="text-caption font-bold text-[#59BBAF] flex items-center gap-1 hover:underline shrink-0">
            <span>مشاهده همه میزها</span>
            <ArrowLeft size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-full">
          {upcomingEvents.map((evt) => {
            const filledPct = Math.round(((evt.reservedCount || 0) / (evt.capacity || 12)) * 100);
            return (
              <div
                key={evt.id}
                className="bg-[#0E1420] rounded-2xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] hover:border-[#59BBAF] transition-all p-5 flex flex-col justify-between gap-4 w-full max-w-full overflow-hidden group"
              >
                <div className="flex flex-col gap-2.5 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <GenderBadge targetGender={evt.targetGender} />
                    <span className="text-caption font-black text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/30 shrink-0">
                      {toPersianDigits(evt.remainingSeats || 0)} خالی
                    </span>
                  </div>

                  <h3 className="text-title font-black text-white group-hover:text-[#59BBAF] transition-colors truncate">
                    {evt.title}
                  </h3>
                  
                  <p className="text-body-sm text-[#94A3B8] line-clamp-2 leading-relaxed break-words">
                    {evt.description}
                  </p>

                  {/* Visual Seat Meter */}
                  <div className="flex flex-col gap-1 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#64748B]">
                      <span>تکمیل صندلی‌ها:</span>
                      <span className="text-emerald-400">{filledPct}٪</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#0A0E17] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#59BBAF]"
                        style={{ width: `${Math.min(100, Math.max(5, filledPct))}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[11px] text-[#64748B] block">هزینه ورودی:</span>
                    <span className="text-body-sm font-black text-[#59BBAF] whitespace-nowrap">
                      {formatTomans(evt.price)}
                    </span>
                  </div>
                  <Link to={`/events/${evt.id}`} className="shrink-0">
                    <Button variant="outline" size="sm">
                      رزرو
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. SCENARIOS WITH VISUAL DIFFICULTY & ROLE SPLIT */}
      <section className="flex flex-col gap-3.5 w-full max-w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skull size={20} className="text-red-400 shrink-0" />
            <h2 className="text-title sm:text-h2 font-black text-white">سناریوهای رسمی مافیا</h2>
          </div>
          <Link to="/guide" className="text-caption font-bold text-[#59BBAF] flex items-center gap-1 hover:underline shrink-0">
            <span>آرشیو کامل سناریوها</span>
            <ArrowLeft size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-full">
          {scenarios.map((sc) => (
            <div
              key={sc.id}
              className="bg-[#0E1420] rounded-2xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] p-5 flex flex-col justify-between gap-4 w-full max-w-full overflow-hidden hover:border-[#59BBAF] transition-all"
            >
              <div className="flex flex-col gap-2.5 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-[#141C2C] text-[#59BBAF] border border-[#1E293B] truncate">
                    {sc.title}
                  </span>
                  <span className="text-[11px] font-bold text-[#64748B] shrink-0">
                    {toPersianDigits(sc.minPlayers)} تا {toPersianDigits(sc.maxPlayers)} نفره
                  </span>
                </div>

                <h3 className="text-title font-black text-white leading-snug break-words">{sc.title}</h3>
                <p className="text-body-sm text-[#94A3B8] line-clamp-3 leading-relaxed break-words">
                  {sc.description}
                </p>

                {/* Visual Difficulty Rating */}
                <div className="flex items-center justify-between pt-1 text-caption text-[#64748B]">
                  <span className="font-bold">درجه سختی:</span>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    <Star size={13} fill="currentColor" />
                    <Star size={13} fill="currentColor" />
                    <Star size={13} fill="currentColor" />
                    <Star size={13} fill="currentColor" />
                    <Star size={13} className="text-[#1E293B]" />
                  </div>
                </div>
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

      {/* 5. LEADERBOARD WITH VISUAL 3D PODIUM */}
      <section className="flex flex-col gap-4 w-full max-w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy size={20} className="text-amber-400 shrink-0" />
            <h2 className="text-title sm:text-h2 font-black text-white">گرگ‌های شب (رنکینگ برتر کلاب)</h2>
          </div>
          <Link to="/leaderboard" className="text-caption font-bold text-[#59BBAF] flex items-center gap-1 hover:underline shrink-0">
            <span>مشاهده جدول کامل</span>
            <ArrowLeft size={14} />
          </Link>
        </div>

        {/* 3D GAMING PODIUM (CENTERED HERO TOP 3) */}
        {topPlayers.length >= 3 && (
          <div className="bg-gradient-to-b from-[#0E1420] to-[#0A0E17] rounded-3xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] p-5 sm:p-8 flex items-end justify-center gap-2 sm:gap-6 pt-10 select-none overflow-hidden">
            {/* Rank 2 (Silver Pedestal - Right) */}
            {rank2 && (
              <div className="flex flex-col items-center gap-2 flex-1 max-w-[130px] sm:max-w-[150px]">
                <Link to={`/players/${rank2.username}`} className="flex flex-col items-center gap-1 group">
                  <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-[#59BBAF] text-[#080B11] border-2 border-slate-300 shadow-[0_0_15px_rgba(148,163,184,0.3)] flex items-center justify-center font-black text-xl overflow-hidden group-hover:scale-105 transition-transform">
                    {rank2.avatar ? <img src={rank2.avatar} alt={rank2.displayName} className="w-full h-full object-cover" /> : rank2.displayName.slice(0, 1)}
                  </div>
                  <span className="text-caption sm:text-body-sm font-black text-white truncate max-w-[100px] sm:max-w-[130px] text-center mt-1">
                    {rank2.displayName}
                  </span>
                  <span className="text-[10px] font-black text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-600">
                    🥈 رتبه ۲
                  </span>
                </Link>
                {/* Silver Pedestal */}
                <div className="w-full h-24 sm:h-28 rounded-t-2xl bg-gradient-to-t from-slate-900 to-slate-800 border-t-2 border-x-2 border-slate-400/60 flex flex-col items-center justify-center text-center p-2 shadow-inner">
                  <span className="text-title sm:text-h2 font-black text-slate-200">{toPersianDigits(rank2.score)}</span>
                  <span className="text-[10px] text-slate-400 font-bold">امتیاز</span>
                </div>
              </div>
            )}

            {/* Rank 1 (Gold Pedestal - Center & Tallest!) */}
            {rank1 && (
              <div className="flex flex-col items-center gap-2 flex-1 max-w-[140px] sm:max-w-[170px] relative z-10">
                {/* Crown Icon */}
                <div className="text-amber-400 animate-bounce">
                  <Crown size={28} />
                </div>
                <Link to={`/players/${rank1.username}`} className="flex flex-col items-center gap-1 group">
                  <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-amber-400 text-black border-2 border-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.5)] flex items-center justify-center font-black text-2xl overflow-hidden group-hover:scale-105 transition-transform">
                    {rank1.avatar ? <img src={rank1.avatar} alt={rank1.displayName} className="w-full h-full object-cover" /> : rank1.displayName.slice(0, 1)}
                  </div>
                  <span className="text-caption sm:text-body-sm font-black text-white truncate max-w-[110px] sm:max-w-[140px] text-center mt-1">
                    {rank1.displayName}
                  </span>
                  <span className="text-[10px] font-black text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/50">
                    👑 گرگ برتر
                  </span>
                </Link>
                {/* Gold Pedestal */}
                <div className="w-full h-32 sm:h-36 rounded-t-2xl bg-gradient-to-t from-amber-950/60 via-amber-900/40 to-amber-800/50 border-t-2 border-x-2 border-amber-400 flex flex-col items-center justify-center text-center p-2 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                  <span className="text-title sm:text-h1 font-black text-amber-300">{toPersianDigits(rank1.score)}</span>
                  <span className="text-[10px] text-amber-400/80 font-bold">امتیاز طلایی</span>
                </div>
              </div>
            )}

            {/* Rank 3 (Bronze Pedestal - Left) */}
            {rank3 && (
              <div className="flex flex-col items-center gap-2 flex-1 max-w-[130px] sm:max-w-[150px]">
                <Link to={`/players/${rank3.username}`} className="flex flex-col items-center gap-1 group">
                  <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-[#59BBAF] text-[#080B11] border-2 border-amber-700 shadow-[0_0_15px_rgba(180,83,9,0.3)] flex items-center justify-center font-black text-xl overflow-hidden group-hover:scale-105 transition-transform">
                    {rank3.avatar ? <img src={rank3.avatar} alt={rank3.displayName} className="w-full h-full object-cover" /> : rank3.displayName.slice(0, 1)}
                  </div>
                  <span className="text-caption sm:text-body-sm font-black text-white truncate max-w-[100px] sm:max-w-[130px] text-center mt-1">
                    {rank3.displayName}
                  </span>
                  <span className="text-[10px] font-black text-amber-500 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-700">
                    🥉 رتبه ۳
                  </span>
                </Link>
                {/* Bronze Pedestal */}
                <div className="w-full h-20 sm:h-22 rounded-t-2xl bg-gradient-to-t from-amber-950/80 to-amber-900/60 border-t-2 border-x-2 border-amber-700/60 flex flex-col items-center justify-center text-center p-2 shadow-inner">
                  <span className="text-title sm:text-h2 font-black text-amber-400">{toPersianDigits(rank3.score)}</span>
                  <span className="text-[10px] text-amber-500/80 font-bold">امتیاز</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Other Players List */}
        {otherPlayers.length > 0 && (
          <div className="bg-[#0E1420] rounded-2xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] overflow-hidden w-full max-w-full">
            <div className="divide-y border-[#1E293B]">
              {otherPlayers.map((player: any) => (
                <div key={player.userId} className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-[#141C2C] transition-colors gap-3 w-full max-w-full overflow-hidden">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-body-sm border-1.5 shrink-0 bg-[#0A0E17] text-[#64748B] border-[#1E293B]">
                      {toPersianDigits(player.rank)}
                    </div>

                    <Link to={`/players/${player.username}`} className="flex items-center gap-2 sm:gap-2.5 hover:text-[#59BBAF] min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-xl bg-[#59BBAF] text-[#080B11] font-black flex items-center justify-center text-body-sm shrink-0 overflow-hidden border border-black/40">
                        {player.avatar ? (
                          <img src={player.avatar} alt={player.displayName} className="w-full h-full object-cover" />
                        ) : (
                          player.displayName.slice(0, 1)
                        )}
                      </div>
                      <div className="flex flex-col text-right min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-body-sm font-black text-white truncate max-w-[120px] sm:max-w-[200px]">{player.displayName}</span>
                          <RokadBadge membership={player.membership} size="sm" />
                        </div>
                        <span className="text-[11px] text-[#64748B] font-mono dir-ltr text-right truncate">@{player.username}</span>
                      </div>
                    </Link>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                    <div className="text-left hidden sm:block">
                      <span className="text-[11px] text-[#64748B] block">بردها:</span>
                      <span className="text-caption font-bold text-emerald-400 whitespace-nowrap">{toPersianDigits(player.wins)} برد</span>
                    </div>
                    <div className="text-left">
                      <span className="text-[11px] text-[#64748B] block">امتیاز کل:</span>
                      <span className="text-title font-black text-[#59BBAF] whitespace-nowrap">{toPersianDigits(player.score)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 6. MVP SHOWCASE */}
      {mvps.length > 0 && (
        <section className="flex flex-col gap-3.5 w-full max-w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award size={20} className="text-amber-400 shrink-0" />
              <h2 className="text-title sm:text-h2 font-black text-white">ستاره‌های هفته کلاب (MVP)</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-full">
            {mvps.map((mvp: any) => (
              <div
                key={mvp.id}
                className="p-5 bg-gradient-to-r from-amber-500/10 via-[#0E1420] to-[#0E1420] rounded-2xl border-1.5 border-amber-500/40 shadow-[2px_2px_0_#000000] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400 text-black border-2 border-black flex items-center justify-center font-black text-xl shadow-hard-xs shrink-0">
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
