import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { EventItem, Scenario } from '../types';
import { Button } from '../components/ui/Button';
import { GenderBadge } from '../components/ui/Badge';
import { formatTomans, formatShamsiDate, toPersianDigits } from '../utils/formatters';
import {
  Gamepad2,
  Calendar,
  BookOpen,
  Trophy,
  ArrowLeft,
  Flame,
  Award,
  Clock,
  MapPin,
  Skull,
  Zap,
  Crown,
  Sparkles,
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
          <span className="text-body font-black text-[#59BBAF]">در حال ورود به کلاب گیم‌کاد...</span>
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
  // Full 5 players underneath (Critique item 7)
  const remainingPlayers = topPlayers.slice(3, 8);

  return (
    <div className="flex flex-col gap-10 sm:gap-14 py-4 sm:py-6 max-w-6xl mx-auto w-full min-w-0">
      {/* 1. HERO SECTION WITH REAL CLUB PHOTO & ACTION HIERARCHY (Critique items 2, 11, 13, 15) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0E1420] via-[#0E1420] to-[#080B11] border-1.5 border-[#1E293B] shadow-[0_15px_40px_rgba(0,0,0,0.8)] p-6 sm:p-10 w-full max-w-full">
        {/* Glow ambient */}
        <div className="absolute top-0 right-1/4 w-80 h-32 bg-[#59BBAF]/10 blur-3xl pointer-events-none rounded-full" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 w-full">
          {/* Left Column: Content & Direct Actions */}
          <div className="lg:col-span-7 flex flex-col gap-4 text-right">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#59BBAF]/15 text-[#59BBAF] border border-[#59BBAF]/30 text-caption font-black w-fit shadow-[0_0_15px_rgba(89,187,175,0.2)]">
              <Flame size={15} className="text-amber-400 animate-pulse shrink-0" />
              <span>کلاب رسمی شب‌های مافیا و تورنمنت‌های مسابقاتی مشهد</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight break-words">
              میدان نبرد، بلوف‌های سنگین و{' '}
              <span className="text-[#59BBAF]">
                آدرنالین خالص بازی
              </span>
            </h1>

            {/* Critique item 15: Natural gamer wording */}
            <p className="text-body text-[#94A3B8] leading-relaxed max-w-xl break-words">
              بیا بازی کن، صندلی رزرو کن، استدلال بیار و در رنکینگ مشهد رتبه بگیر. میزهای رسمی شب‌های مافیا با کارت‌های فیزیکی، دوئل‌های کنسولی PS5 و داوری زنده.
            </p>

            {/* Critique item 11: Unbalanced buttons -> Primary Filled vs Secondary Subtle */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link to="/events" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto h-12 px-6 shadow-hard-xs font-black">
                  <Calendar size={18} />
                  <span>رزرو صندلی میز امشب</span>
                </Button>
              </Link>
              <Link to="/guide" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-5 text-[#94A3B8] hover:text-white border-[#1E293B] hover:border-[#59BBAF]">
                  <Skull size={18} className="text-red-400" />
                  <span>کارت‌های نقش و سناریوها</span>
                </Button>
              </Link>
            </div>

            {/* Trust Stats Bar (Critique items 2 & 13: Real numbers, moved down) */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 pt-5 border-t border-[#1E293B] mt-2 max-w-lg">
              <div className="flex flex-col p-2.5 sm:p-3 rounded-2xl bg-[#0A0E17] border border-[#1E293B] text-center">
                <span className="text-title sm:text-h1 font-black text-[#59BBAF]">۵۰۰+</span>
                <span className="text-caption font-bold text-[#64748B]">بازیکن عضو</span>
              </div>
              <div className="flex flex-col p-2.5 sm:p-3 rounded-2xl bg-[#0A0E17] border border-[#1E293B] text-center">
                <span className="text-title sm:text-h1 font-black text-amber-400">۴</span>
                <span className="text-caption font-bold text-[#64748B]">سناریوی رسمی</span>
              </div>
              <div className="flex flex-col p-2.5 sm:p-3 rounded-2xl bg-[#0A0E17] border border-[#1E293B] text-center">
                <span className="text-title sm:text-h1 font-black text-emerald-400">+۱۵۰</span>
                <span className="text-caption font-bold text-[#64748B]">بازی مسابقاتی</span>
              </div>
            </div>
          </div>

          {/* Right Column: Real Atmosphere Club Visual (Critique item 2) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-[#1E293B] shadow-[0_0_30px_rgba(0,0,0,0.8)] aspect-[4/3] group">
              <img
                src="/profiles/Game Club.jpg"
                alt="فضای باشگاه بازی گیم‌کاد"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080B11] via-black/40 to-transparent" />
              
              {/* Live Badge Overlay */}
              <div className="absolute top-3.5 right-3.5 inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-[#080B11]/90 backdrop-blur-md border border-[#1E293B] text-caption font-black text-white shadow-md">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>باشگاه حضوری گیم‌کاد مشهد</span>
              </div>

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-3.5 right-3.5 left-3.5 p-3 rounded-2xl bg-[#0E1420]/90 backdrop-blur-md border border-[#1E293B] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#59BBAF] text-[#080B11] font-black flex items-center justify-center text-caption shrink-0">
                    <Sparkles size={18} />
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-caption font-black text-white">اتمسفر اختصاصی رقابت</span>
                    <span className="text-[11px] text-[#94A3B8]">کارت‌های فیزیکی، داور رسمی و صوت مسابقاتی</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK GAME CATEGORY PILLS (Critique item 1: Moved here as category switcher) */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-caption font-black text-[#64748B]">دسته‌بندی بازی‌ها و مسابقات کلاب:</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 select-none">
          <Link
            to="/events"
            className="p-3.5 rounded-2xl bg-[#0E1420] border-1.5 border-[#1E293B] hover:border-[#59BBAF] transition-all flex items-center gap-3 group shadow-hard-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-red-950/60 text-red-400 border border-red-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Skull size={20} />
            </div>
            <div className="flex flex-col text-right min-w-0">
              <span className="text-body-sm font-black text-white group-hover:text-[#59BBAF] transition-colors truncate">شب‌های مافیا</span>
              <span className="text-[11px] text-[#64748B]">میزهای ۱۰ و ۱۲ نفره</span>
            </div>
          </Link>

          <Link
            to="/games"
            className="p-3.5 rounded-2xl bg-[#0E1420] border-1.5 border-[#1E293B] hover:border-[#59BBAF] transition-all flex items-center gap-3 group shadow-hard-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-950/60 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Gamepad2 size={20} />
            </div>
            <div className="flex flex-col text-right min-w-0">
              <span className="text-body-sm font-black text-white group-hover:text-[#59BBAF] transition-colors truncate">کنسول PS5</span>
              <span className="text-[11px] text-[#64748B]">FC 25 و مورتال کامبت</span>
            </div>
          </Link>

          <Link
            to="/guide"
            className="p-3.5 rounded-2xl bg-[#0E1420] border-1.5 border-[#1E293B] hover:border-[#59BBAF] transition-all flex items-center gap-3 group shadow-hard-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-950/60 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <BookOpen size={20} />
            </div>
            <div className="flex flex-col text-right min-w-0">
              <span className="text-body-sm font-black text-white group-hover:text-[#59BBAF] transition-colors truncate">دانشنامه نقش‌ها</span>
              <span className="text-[11px] text-[#64748B]">۳۳ کارت فلیپ ۳ بعدی</span>
            </div>
          </Link>

          <Link
            to="/leaderboard"
            className="p-3.5 rounded-2xl bg-[#0E1420] border-1.5 border-[#1E293B] hover:border-[#59BBAF] transition-all flex items-center gap-3 group shadow-hard-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Trophy size={20} />
            </div>
            <div className="flex flex-col text-right min-w-0">
              <span className="text-body-sm font-black text-white group-hover:text-[#59BBAF] transition-colors truncate">رنکینگ گرگ‌ها</span>
              <span className="text-[11px] text-[#64748B]">جدول امتیازات زنده</span>
            </div>
          </Link>
        </div>
      </section>

      {/* 2. SPOTLIGHT EVENT (HOT MATCH) (Critique items 3, 6, 8, 9, 10) */}
      {spotlight && (
        <section className="flex flex-col gap-3.5 w-full max-w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping shrink-0" />
              <Flame size={20} className="text-amber-400 shrink-0" />
              <h2 className="text-title sm:text-h2 font-black text-white">میز داغ امشب (آماده نبرد)</h2>
            </div>
            {/* Critique item 6: Touch target min 40px height */}
            <Link
              to={`/events/${spotlight.id}`}
              className="text-body-sm font-black text-[#59BBAF] hover:text-[#48D1B2] flex items-center gap-1.5 h-10 px-3 rounded-xl hover:bg-[#0E1420] transition-colors shrink-0"
            >
              <span>رزرو فوری</span>
              <ArrowLeft size={16} />
            </Link>
          </div>

          <div className="p-5 sm:p-7 bg-[#0E1420] rounded-3xl border-1.5 border-[#59BBAF]/60 shadow-[0_0_25px_rgba(89,187,175,0.18)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 w-full max-w-full overflow-hidden">
            {/* Content Details */}
            <div className="flex flex-col gap-3 max-w-2xl text-right w-full min-w-0 flex-1">
              {/* Critique item 10: Max 2 clean chips */}
              <div className="flex flex-wrap items-center gap-2">
                <GenderBadge targetGender={spotlight.targetGender} />
                <span className="text-caption font-black px-2.5 py-1 rounded-full bg-emerald-950/70 text-emerald-400 border border-emerald-500/40 shrink-0">
                  {toPersianDigits(spotlight.remainingSeats || 0)} صندلی خالی
                </span>
              </div>

              {/* Critique item 8 & 12: Clear typography, 2-line clean title */}
              <h3 className="text-xl sm:text-2xl font-black text-white leading-snug break-words">
                {spotlight.title}
              </h3>
              
              <p className="text-body-sm text-[#94A3B8] leading-relaxed break-words line-clamp-2">
                {spotlight.description}
              </p>

              {/* Critique item 9: Unified Seat Meter (No duplicate percentages) */}
              <div className="flex flex-col gap-1.5 pt-1 w-full max-w-md">
                <div className="flex items-center justify-between text-caption font-bold">
                  <span className="text-white font-black">{toPersianDigits(spotlight.remainingSeats || 0)} صندلی خالی باقی‌مانده</span>
                  <span className="text-[#64748B]">ظرفیت کل: {toPersianDigits(spotlight.capacity || 12)} نفر</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#0A0E17] border border-[#1E293B] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-500 to-[#59BBAF]"
                    style={{
                      width: `${Math.min(100, Math.max(10, (((spotlight.capacity || 12) - (spotlight.remainingSeats || 0)) / (spotlight.capacity || 12)) * 100))}%`,
                    }}
                  />
                </div>
              </div>

              {/* Time and Venue info */}
              <div className="flex flex-wrap items-center gap-4 text-caption font-bold text-[#64748B] pt-1 max-w-full">
                <span className="flex items-center gap-1.5 text-white shrink-0">
                  <Clock size={15} className="text-[#59BBAF]" />
                  <span>{formatShamsiDate(spotlight.startTime)}</span>
                </span>
                <span className="flex items-center gap-1.5 min-w-0 max-w-full">
                  <MapPin size={15} className="text-[#59BBAF] shrink-0" />
                  <span className="truncate block max-w-[240px] sm:max-w-md" title={spotlight.venueAddress}>
                    {spotlight.venueAddress}
                  </span>
                </span>
              </div>
            </div>

            {/* Critique item 3: Prominent Teal CTA Button next to price */}
            <div className="flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 shrink-0 p-4 sm:p-5 bg-[#0A0E17] rounded-2xl border-1.5 border-[#1E293B] w-full md:w-56 shadow-hard-xs">
              <div className="text-right md:text-center min-w-0">
                <span className="text-caption text-[#64748B] font-bold block">ورودی هر صندلی:</span>
                <span className="text-h2 sm:text-h1 font-black text-[#59BBAF] whitespace-nowrap">
                  {formatTomans(spotlight.price)}
                </span>
              </div>
              <Link to={`/events/${spotlight.id}`} className="shrink-0 w-auto md:w-full">
                <Button variant="primary" size="lg" className="w-full h-11 px-6 font-black shadow-hard-xs text-body-sm">
                  رزرو صندلی
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 3. UPCOMING TABLES (CAROUSEL ON MOBILE, GRID ON DESKTOP - Critique item 4) */}
      <section className="flex flex-col gap-3.5 w-full max-w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-[#59BBAF] shrink-0" />
            <h2 className="text-title sm:text-h2 font-black text-white">میزهای بازی پیش‌رو</h2>
          </div>
          {/* Critique item 6: Min 40px touch height */}
          <Link
            to="/events"
            className="text-body-sm font-black text-[#59BBAF] hover:text-[#48D1B2] flex items-center gap-1.5 h-10 px-3 rounded-xl hover:bg-[#0E1420] transition-colors shrink-0"
          >
            <span>مشاهده همه میزها</span>
            <ArrowLeft size={16} />
          </Link>
        </div>

        {/* Horizontal carousel on mobile (< sm), grid on desktop (Critique item 4) */}
        <div className="flex sm:grid sm:grid-cols-3 overflow-x-auto sm:overflow-visible gap-4 pb-3 sm:pb-0 snap-x snap-mandatory no-scrollbar w-full max-w-full">
          {upcomingEvents.map((evt) => (
            <div
              key={evt.id}
              className="min-w-[280px] sm:min-w-0 flex-1 bg-[#0E1420] rounded-2xl border-1.5 border-[#1E293B] shadow-hard-xs hover:border-[#59BBAF] transition-all p-5 flex flex-col justify-between gap-4 snap-center group"
            >
              <div className="flex flex-col gap-2.5 min-w-0">
                {/* Max 2 chips */}
                <div className="flex items-center justify-between gap-2">
                  <GenderBadge targetGender={evt.targetGender} />
                  <span className="text-caption font-black text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-500/30 shrink-0">
                    {toPersianDigits(evt.remainingSeats || 0)} صندلی خالی
                  </span>
                </div>

                {/* Critique item 12: 2-line title instead of clipped with ... */}
                <h3 className="text-title font-black text-white group-hover:text-[#59BBAF] transition-colors line-clamp-2 min-h-[48px]">
                  {evt.title}
                </h3>
                
                <p className="text-body-sm text-[#94A3B8] line-clamp-2 leading-relaxed break-words">
                  {evt.description}
                </p>

                {/* Unified thin seat bar (Critique item 9) */}
                <div className="w-full h-1.5 rounded-full bg-[#0A0E17] overflow-hidden mt-1">
                  <div
                    className="h-full rounded-full bg-[#59BBAF]"
                    style={{
                      width: `${Math.min(100, Math.max(10, (((evt.capacity || 12) - (evt.remainingSeats || 0)) / (evt.capacity || 12)) * 100))}%`,
                    }}
                  />
                </div>
              </div>

              {/* CTA row: Price + Bold Teal Button (Critique item 3) */}
              <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[11px] text-[#64748B] block font-bold">هزینه ورودی:</span>
                  <span className="text-body sm:text-title font-black text-[#59BBAF] whitespace-nowrap">
                    {formatTomans(evt.price)}
                  </span>
                </div>
                <Link to={`/events/${evt.id}`} className="shrink-0">
                  <Button variant="primary" size="sm" className="h-9 px-4 font-black shadow-hard-xs">
                    رزرو صندلی
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SCENARIOS (CAROUSEL ON MOBILE, GRID ON DESKTOP - Critique items 4 & 16) */}
      <section className="flex flex-col gap-3.5 w-full max-w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skull size={20} className="text-red-400 shrink-0" />
            <h2 className="text-title sm:text-h2 font-black text-white">سناریوهای رسمی مافیا</h2>
          </div>
          {/* Critique item 6: Min 40px touch height */}
          <Link
            to="/guide"
            className="text-body-sm font-black text-[#59BBAF] hover:text-[#48D1B2] flex items-center gap-1.5 h-10 px-3 rounded-xl hover:bg-[#0E1420] transition-colors shrink-0"
          >
            <span>آرشیو سناریوها</span>
            <ArrowLeft size={16} />
          </Link>
        </div>

        {/* Mobile Horizontal Carousel (Critique item 4) */}
        <div className="flex sm:grid sm:grid-cols-3 overflow-x-auto sm:overflow-visible gap-4 pb-3 sm:pb-0 snap-x snap-mandatory no-scrollbar w-full max-w-full">
          {scenarios.map((sc, idx) => {
            // Critique item 16: Clear difficulty label instead of ambiguous stars
            const difficultyLabel = idx === 0 ? 'مبتدی و استاندارد' : idx === 1 ? 'متوسط و سرعتی' : 'پیشرفته و مسابقاتی';
            const difficultyColor = idx === 0 ? 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30' : idx === 1 ? 'text-amber-400 border-amber-500/40 bg-amber-950/30' : 'text-red-400 border-red-500/40 bg-red-950/30';

            return (
              <div
                key={sc.id}
                className="min-w-[280px] sm:min-w-0 flex-1 bg-[#0E1420] rounded-2xl border-1.5 border-[#1E293B] shadow-hard-xs p-5 flex flex-col justify-between gap-4 snap-center hover:border-[#59BBAF] transition-all"
              >
                <div className="flex flex-col gap-2.5 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-caption font-black px-2.5 py-0.5 rounded-full border ${difficultyColor}`}>
                      {difficultyLabel}
                    </span>
                    <span className="text-caption font-bold text-[#64748B] shrink-0">
                      {toPersianDigits(sc.minPlayers)} تا {toPersianDigits(sc.maxPlayers)} نفره
                    </span>
                  </div>

                  <h3 className="text-title font-black text-white leading-snug break-words min-h-[44px]">
                    {sc.title}
                  </h3>
                  
                  <p className="text-body-sm text-[#94A3B8] line-clamp-3 leading-relaxed break-words">
                    {sc.description}
                  </p>
                </div>

                <Link to={`/guide/scenarios/${sc.slug}`}>
                  <Button variant="outline" size="sm" className="w-full h-10 font-bold border-[#1E293B] hover:border-[#59BBAF]">
                    کارت‌های نقش و قوانین
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. LEADERBOARD WITH COMPACT 3D PODIUM + 5 PLAYERS (Critique item 7) */}
      <section className="flex flex-col gap-4 w-full max-w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy size={20} className="text-amber-400 shrink-0" />
            <h2 className="text-title sm:text-h2 font-black text-white">گرگ‌های شب (رنکینگ برتر کلاب)</h2>
          </div>
          {/* Critique item 6: Min 40px touch height */}
          <Link
            to="/leaderboard"
            className="text-body-sm font-black text-[#59BBAF] hover:text-[#48D1B2] flex items-center gap-1.5 h-10 px-3 rounded-xl hover:bg-[#0E1420] transition-colors shrink-0"
          >
            <span>مشاهده جدول کامل</span>
            <ArrowLeft size={16} />
          </Link>
        </div>

        {/* Compact Podium (Critique item 7: Shorter height, zero wasted pixels) */}
        {topPlayers.length >= 3 && (
          <div className="bg-gradient-to-b from-[#0E1420] to-[#0A0E17] rounded-3xl border-1.5 border-[#1E293B] shadow-hard-sm p-4 sm:p-6 flex items-end justify-center gap-2 sm:gap-6 pt-6 select-none overflow-hidden w-full">
            {/* Rank 2 (Silver Pedestal - Right) */}
            {rank2 && (
              <div className="flex flex-col items-center gap-1.5 flex-1 max-w-[120px] sm:max-w-[140px]">
                <Link to={`/players/${rank2.username}`} className="flex flex-col items-center gap-1 group">
                  <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-[#59BBAF] text-[#080B11] border-2 border-slate-300 shadow-[0_0_12px_rgba(148,163,184,0.3)] flex items-center justify-center font-black text-lg overflow-hidden group-hover:scale-105 transition-transform">
                    {rank2.avatar ? <img src={rank2.avatar} alt={rank2.displayName} className="w-full h-full object-cover" /> : rank2.displayName.slice(0, 1)}
                  </div>
                  <span className="text-caption font-black text-white truncate max-w-[100px] text-center mt-0.5">
                    {rank2.displayName}
                  </span>
                  <span className="text-[11px] font-black text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-600">
                    🥈 رتبه ۲
                  </span>
                </Link>
                {/* Silver Pedestal (Shorter) */}
                <div className="w-full h-16 sm:h-20 rounded-t-2xl bg-gradient-to-t from-slate-900 to-slate-800 border-t-2 border-x-2 border-slate-400/60 flex flex-col items-center justify-center text-center p-1.5 shadow-inner">
                  <span className="text-title font-black text-slate-200">{toPersianDigits(rank2.score)}</span>
                  <span className="text-[11px] text-slate-400 font-bold">امتیاز</span>
                </div>
              </div>
            )}

            {/* Rank 1 (Gold Pedestal - Center & Tallest!) */}
            {rank1 && (
              <div className="flex flex-col items-center gap-1.5 flex-1 max-w-[130px] sm:max-w-[160px] relative z-10">
                <div className="text-amber-400">
                  <Crown size={24} />
                </div>
                <Link to={`/players/${rank1.username}`} className="flex flex-col items-center gap-1 group">
                  <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-amber-400 text-black border-2 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.5)] flex items-center justify-center font-black text-xl overflow-hidden group-hover:scale-105 transition-transform">
                    {rank1.avatar ? <img src={rank1.avatar} alt={rank1.displayName} className="w-full h-full object-cover" /> : rank1.displayName.slice(0, 1)}
                  </div>
                  <span className="text-caption font-black text-white truncate max-w-[110px] text-center mt-0.5">
                    {rank1.displayName}
                  </span>
                  <span className="text-[11px] font-black text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/50">
                    👑 گرگ برتر
                  </span>
                </Link>
                {/* Gold Pedestal */}
                <div className="w-full h-24 sm:h-28 rounded-t-2xl bg-gradient-to-t from-amber-950/60 via-amber-900/40 to-amber-800/50 border-t-2 border-x-2 border-amber-400 flex flex-col items-center justify-center text-center p-1.5 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                  <span className="text-h2 sm:text-h1 font-black text-amber-300">{toPersianDigits(rank1.score)}</span>
                  <span className="text-[11px] text-amber-400/80 font-bold">امتیاز طلایی</span>
                </div>
              </div>
            )}

            {/* Rank 3 (Bronze Pedestal - Left) */}
            {rank3 && (
              <div className="flex flex-col items-center gap-1.5 flex-1 max-w-[120px] sm:max-w-[140px]">
                <Link to={`/players/${rank3.username}`} className="flex flex-col items-center gap-1 group">
                  <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-[#59BBAF] text-[#080B11] border-2 border-amber-700 shadow-[0_0_12px_rgba(180,83,9,0.3)] flex items-center justify-center font-black text-lg overflow-hidden group-hover:scale-105 transition-transform">
                    {rank3.avatar ? <img src={rank3.avatar} alt={rank3.displayName} className="w-full h-full object-cover" /> : rank3.displayName.slice(0, 1)}
                  </div>
                  <span className="text-caption font-black text-white truncate max-w-[100px] text-center mt-0.5">
                    {rank3.displayName}
                  </span>
                  <span className="text-[11px] font-black text-amber-500 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-700">
                    🥉 رتبه ۳
                  </span>
                </Link>
                {/* Bronze Pedestal */}
                <div className="w-full h-14 sm:h-16 rounded-t-2xl bg-gradient-to-t from-amber-950/80 to-amber-900/60 border-t-2 border-x-2 border-amber-700/60 flex flex-col items-center justify-center text-center p-1.5 shadow-inner">
                  <span className="text-title font-black text-amber-400">{toPersianDigits(rank3.score)}</span>
                  <span className="text-[11px] text-amber-500/80 font-bold">امتیاز</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 5 Ranked Players Underneath (Critique item 7: Full 5-player roster) */}
        {remainingPlayers.length > 0 && (
          <div className="bg-[#0E1420] rounded-2xl border-1.5 border-[#1E293B] shadow-hard-xs overflow-hidden w-full max-w-full">
            <div className="divide-y border-[#1E293B]">
              {remainingPlayers.map((player: any) => (
                <div key={player.userId} className="p-3 sm:p-4 flex items-center justify-between hover:bg-[#141C2C] transition-colors gap-3 w-full max-w-full overflow-hidden">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-caption border-1.5 shrink-0 bg-[#0A0E17] text-[#64748B] border-[#1E293B]">
                      {toPersianDigits(player.rank)}
                    </div>

                    <Link to={`/players/${player.username}`} className="flex items-center gap-2.5 hover:text-[#59BBAF] min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-xl bg-[#59BBAF] text-[#080B11] font-black flex items-center justify-center text-caption shrink-0 overflow-hidden border border-black/40">
                        {player.avatar ? (
                          <img src={player.avatar} alt={player.displayName} className="w-full h-full object-cover" />
                        ) : (
                          player.displayName.slice(0, 1)
                        )}
                      </div>
                      <div className="flex flex-col text-right min-w-0 flex-1">
                        <span className="text-body-sm font-black text-white truncate max-w-[140px] sm:max-w-[200px]">{player.displayName}</span>
                        <span className="text-caption text-[#64748B] font-mono dir-ltr text-right truncate">@{player.username}</span>
                      </div>
                    </Link>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-5 shrink-0">
                    <div className="text-left hidden sm:block">
                      <span className="text-caption text-[#64748B] block">بردها:</span>
                      <span className="text-caption font-bold text-emerald-400 whitespace-nowrap">{toPersianDigits(player.wins)} برد</span>
                    </div>
                    <div className="text-left">
                      <span className="text-caption text-[#64748B] block">امتیاز کل:</span>
                      <span className="text-title font-black text-[#59BBAF] whitespace-nowrap">{toPersianDigits(player.score)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 6. MVP SHOWCASE (Critique item 14: "ستاره‌های ماه کلاب") */}
      {mvps.length > 0 && (
        <section className="flex flex-col gap-3.5 w-full max-w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award size={20} className="text-amber-400 shrink-0" />
              <h2 className="text-title sm:text-h2 font-black text-white">ستاره‌های ماه کلاب (MVP)</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-full">
            {mvps.map((mvp: any) => (
              <div
                key={mvp.id}
                className="p-5 bg-gradient-to-r from-amber-500/10 via-[#0E1420] to-[#0E1420] rounded-2xl border-1.5 border-amber-500/40 shadow-hard-xs flex items-center justify-between gap-3"
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
