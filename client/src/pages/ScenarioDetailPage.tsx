import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { Scenario, Role } from '../types';
import { FlipRoleCard } from '../components/ui/FlipRoleCard';
import { Button } from '../components/ui/Button';
import {
  ArrowRight,
  Sun,
  Moon,
  Shield,
  Calendar,
  Skull,
  Flame,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Users,
} from 'lucide-react';
import { toPersianDigits } from '../utils/formatters';

export const ScenarioDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(true);
  const [sideFilter, setSideFilter] = useState<'ALL' | 'CITIZEN' | 'MAFIA'>('ALL');

  useEffect(() => {
    if (!slug) return;
    api
      .getScenarioBySlug(slug)
      .then((res) => setScenario(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-[#64748B] font-bold">
        در حال بارگذاری سناریو و نقش‌ها...
      </div>
    );
  }

  if (!scenario) {
    return (
      <div className="p-12 text-center flex flex-col items-center gap-4">
        <h2 className="text-h2 font-black text-white">سناریوی مورد نظر یافت نشد.</h2>
        <Link to="/guide">
          <Button variant="outline">بازگشت به راهنمای سناریوها</Button>
        </Link>
      </div>
    );
  }

  const allRoles: Role[] = scenario.roles || [];
  const citizenRoles = allRoles.filter((r) => r.side === 'CITIZEN');
  const mafiaRoles = allRoles.filter((r) => r.side === 'MAFIA');

  const filteredRoles =
    sideFilter === 'CITIZEN'
      ? citizenRoles
      : sideFilter === 'MAFIA'
      ? mafiaRoles
      : allRoles;

  // Sorted roles by night order for timeline
  const nightOrderRoles = [...allRoles]
    .filter((r) => r.nightOrder && r.nightOrder > 0)
    .sort((a, b) => (a.nightOrder || 0) - (b.nightOrder || 0));

  return (
    <div className="flex flex-col gap-6 sm:gap-8 py-4 sm:py-6 max-w-6xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          to="/guide"
          className="inline-flex items-center gap-1.5 text-body-sm font-bold text-[#64748B] hover:text-[#59BBAF] transition-colors"
        >
          <ArrowRight size={16} />
          <span>بازگشت به سناریوهای مافیا</span>
        </Link>
      </div>

      {/* Main Banner */}
      <div className="bg-[#0E1420] rounded-3xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] p-6 sm:p-8 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-caption font-black px-3 py-1 rounded-full bg-[#59BBAF]/15 text-[#59BBAF] border border-[#59BBAF]/30">
            سناریوی مسابقاتی کلاب گیم‌کاد
          </span>
          <span className="text-body-sm font-bold text-[#94A3B8]">
            ظرفیت میز: {toPersianDigits(scenario.minPlayers)} تا {toPersianDigits(scenario.maxPlayers)} بازیکن
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-white">{scenario.title}</h1>
        <p className="text-body-sm sm:text-body text-[#94A3B8] leading-relaxed max-w-3xl">
          {scenario.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div className="p-4 bg-emerald-950/25 rounded-2xl border border-emerald-500/30 text-right flex flex-col gap-1.5">
            <span className="text-caption font-black text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 size={16} />
              <span>شرط پیروزی شهروندان:</span>
            </span>
            <p className="text-body-sm text-emerald-200/90 leading-relaxed">
              {scenario.victoryCitizen}
            </p>
          </div>

          <div className="p-4 bg-red-950/25 rounded-2xl border border-red-500/30 text-right flex flex-col gap-1.5">
            <span className="text-caption font-black text-red-400 flex items-center gap-1.5">
              <Skull size={16} />
              <span>شرط پیروزی مافیا:</span>
            </span>
            <p className="text-body-sm text-red-200/90 leading-relaxed">
              {scenario.victoryMafia}
            </p>
          </div>
        </div>
      </div>

      {/* SPECIAL MECHANICS OF SCENARIO */}
      {scenario.rules && (
        <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-500/10 via-[#0E1420] to-[#0E1420] rounded-2xl border-1.5 border-amber-500/40 shadow-[2px_2px_0_#000000] flex flex-col gap-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-title">
            <Sparkles size={20} />
            <h3 className="font-black">مکانیزم‌ها و قوانین اختصاصی این سناریو</h3>
          </div>
          <p className="text-body-sm sm:text-body text-[#CBD5E1] leading-relaxed whitespace-pre-line">
            {scenario.rules}
          </p>
        </div>
      )}

      {/* Day and Night Phases */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="p-5 sm:p-6 bg-[#0E1420] rounded-2xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] flex flex-col gap-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-title">
            <Sun size={20} />
            <h3 className="font-black">فاز روز، تارگت‌ها و دفاعیه</h3>
          </div>
          <p className="text-body-sm text-[#94A3B8] leading-relaxed">
            {scenario.dayPhaseRules}
          </p>
        </div>

        <div className="p-5 sm:p-6 bg-[#0E1420] rounded-2xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] flex flex-col gap-3">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-title">
            <Moon size={20} />
            <h3 className="font-black">فاز شب و ترتیب اکت‌ها</h3>
          </div>
          <p className="text-body-sm text-[#94A3B8] leading-relaxed">
            {scenario.nightPhaseRules}
          </p>
        </div>
      </div>

      {/* NIGHT ORDER TIMELINE */}
      {nightOrderRoles.length > 0 && (
        <div className="p-5 sm:p-6 bg-[#0E1420] rounded-2xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] flex flex-col gap-4">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-title">
            <Clock size={20} />
            <h3 className="font-black text-white">ترتیب بیدار شدن نقش‌ها در شب (فرمان گاد)</h3>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {nightOrderRoles.map((r, index) => (
              <div
                key={r.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141C2C] border border-[#1E293B]"
              >
                <span className="w-5 h-5 rounded-full bg-[#59BBAF] text-[#080B11] font-black text-caption flex items-center justify-center shrink-0">
                  {toPersianDigits(index + 1)}
                </span>
                <span className="text-body-sm font-bold text-white">{r.name}</span>
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                  r.side === 'MAFIA' ? 'bg-red-950/60 text-red-400' : 'bg-emerald-950/60 text-emerald-400'
                }`}>
                  {r.side === 'MAFIA' ? 'مافیا' : 'شهروند'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Roles Grid Header and Side Filter */}
      <div className="flex flex-col gap-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-[#59BBAF]" />
            <h2 className="text-h2 font-black text-white">کارت‌های نقش این سناریو</h2>
            <span className="text-caption text-[#64748B]">
              ({toPersianDigits(allRoles.length)} نقش تخصصی)
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 bg-[#0E1420] p-1 rounded-xl border border-[#1E293B] w-fit">
            <button
              type="button"
              onClick={() => setSideFilter('ALL')}
              className={`px-3 py-1 text-caption font-black rounded-lg transition-all ${
                sideFilter === 'ALL'
                  ? 'bg-[#59BBAF] text-[#080B11]'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              همه ({toPersianDigits(allRoles.length)})
            </button>
            <button
              type="button"
              onClick={() => setSideFilter('CITIZEN')}
              className={`px-3 py-1 text-caption font-black rounded-lg transition-all ${
                sideFilter === 'CITIZEN'
                  ? 'bg-emerald-500 text-black'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              شهروندان ({toPersianDigits(citizenRoles.length)})
            </button>
            <button
              type="button"
              onClick={() => setSideFilter('MAFIA')}
              className={`px-3 py-1 text-caption font-black rounded-lg transition-all ${
                sideFilter === 'MAFIA'
                  ? 'bg-red-500 text-white'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              مافیا ({toPersianDigits(mafiaRoles.length)})
            </button>
          </div>
        </div>

        {/* Roles 3D Flip Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoles.map((role) => (
            <FlipRoleCard key={role.id} role={role} />
          ))}
        </div>
      </div>

      {/* Direct Play CTA */}
      <div className="p-6 bg-[#0E1420] rounded-2xl border-1.5 border-[#59BBAF]/50 shadow-[0_0_20px_rgba(89,187,175,0.1)] flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
        <div className="flex items-center gap-3 text-right">
          <div className="w-12 h-12 rounded-xl bg-[#59BBAF] text-[#080B11] font-black flex items-center justify-center shrink-0">
            <Calendar size={24} />
          </div>
          <div className="flex flex-col">
            <h4 className="text-title font-black text-white">آماده تجربه سناریوی «{scenario.title}» هستید؟</h4>
            <span className="text-body-sm text-[#94A3B8]">میزهای پیش‌رو را بررسی و صندلی خود را رزرو کنید.</span>
          </div>
        </div>

        <Link to="/events">
          <Button variant="primary" size="md">
            مشاهده میزهای فعال
          </Button>
        </Link>
      </div>
    </div>
  );
};
