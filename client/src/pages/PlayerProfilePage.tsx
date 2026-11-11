import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { Tabs } from '../components/ui/Tabs';
import { RokadBadge } from '../components/ui/Badge';
import { SpiderChart } from '../components/ui/SpiderChart';
import { StatCard } from '../components/ui/StatCard';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import {
  Trophy,
  Medal,
  Flame,
  Shield,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  Zap,
  HeartHandshake,
  Moon,
  Eye,
  Mic,
  Award,
  Crown,
  Calendar,
  Info,
} from 'lucide-react';
import { toPersianDigits, formatShamsiDate } from '../utils/formatters';

interface TierTheme {
  name: string;
  badgeText: string;
  badgeBg: string;
  border: string;
  iconBg: string;
  iconColor: string;
  glow: string;
}

const renderMedalIcon = (iconName: string, size = 26) => {
  switch (iconName?.toLowerCase()) {
    case 'sparkles':
      return <Sparkles size={size} />;
    case 'zap':
      return <Zap size={size} />;
    case 'flame':
      return <Flame size={size} />;
    case 'hearthandshake':
      return <HeartHandshake size={size} />;
    case 'moon':
      return <Moon size={size} />;
    case 'eye':
      return <Eye size={size} />;
    case 'mic':
      return <Mic size={size} />;
    case 'trophy':
      return <Trophy size={size} />;
    case 'shield':
      return <Shield size={size} />;
    case 'crown':
      return <Crown size={size} />;
    default:
      return <Medal size={size} />;
  }
};

const getTierTheme = (tier?: string, slug?: string): TierTheme => {
  const t = (tier || '').toUpperCase();
  const s = (slug || '').toLowerCase();

  if (t === 'DIAMOND' || s.includes('clutch') || s.includes('wolf')) {
    return {
      name: 'سطح الماس (Diamond)',
      badgeText: 'الماس',
      badgeBg: 'bg-cyan-950/70 text-cyan-300 border-cyan-400/50',
      border: 'border-cyan-500/40 hover:border-cyan-400',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/40',
      iconColor: 'text-cyan-300',
      glow: 'shadow-[0_0_15px_rgba(6,182,212,0.2)]',
    };
  }

  if (t === 'SILVER' || s.includes('fair') || s.includes('silver')) {
    return {
      name: 'سطح نقره (Silver)',
      badgeText: 'نقره',
      badgeBg: 'bg-slate-900/80 text-slate-300 border-slate-400/50',
      border: 'border-slate-500/40 hover:border-slate-300',
      iconBg: 'bg-slate-500/10 text-slate-300 border-slate-400/40',
      iconColor: 'text-slate-300',
      glow: 'shadow-[0_0_15px_rgba(148,163,184,0.2)]',
    };
  }

  if (t === 'BRONZE' || s.includes('orator') || s.includes('bronze')) {
    return {
      name: 'سطح برنز (Bronze)',
      badgeText: 'برنز',
      badgeBg: 'bg-amber-950/80 text-amber-500 border-amber-600/50',
      border: 'border-amber-600/40 hover:border-amber-500',
      iconBg: 'bg-amber-600/10 text-amber-500 border-amber-600/40',
      iconColor: 'text-amber-500',
      glow: 'shadow-[0_0_15px_rgba(217,119,6,0.2)]',
    };
  }

  // Default: GOLD
  return {
    name: 'سطح طلا (Gold)',
    badgeText: 'طلا',
    badgeBg: 'bg-amber-950/70 text-amber-300 border-amber-400/50',
    border: 'border-amber-500/40 hover:border-amber-400',
    iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/40',
    iconColor: 'text-amber-400',
    glow: 'shadow-[0_0_15px_rgba(245,158,11,0.2)]',
  };
};

export const PlayerProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('stats');
  const [recentCount, setRecentCount] = useState<number>(5);
  const [selectedMedal, setSelectedMedal] = useState<any | null>(null);

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    api
      .getPlayerProfile(username)
      .then((res) => setProfile(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return <div className="p-12 text-center text-[#64748B] font-bold">در حال بارگذاری شناسنامه بازیکن...</div>;
  }

  if (!profile) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-h2 font-black text-white mb-4">بازیکن یافت نشد.</h2>
        <Link to="/players">
          <Button variant="outline">بازگشت به تالار بازیکنان</Button>
        </Link>
      </div>
    );
  }

  const { user, primaryStat, medals, radarSkills, recentGames, rolePlaybook } = profile;

  return (
    <div className="flex flex-col gap-6 sm:gap-8 py-4 sm:py-6 max-w-4xl mx-auto">
      {/* Back button */}
      <div>
        <Link to="/players" className="inline-flex items-center gap-1.5 text-body-sm font-bold text-[#64748B] hover:text-[#59BBAF] transition-colors">
          <ArrowRight size={16} />
          <span>بازگشت به فهرست اعضای گیم‌کاد</span>
        </Link>
      </div>

      {/* Profile Header Box (Centered Big Photo) */}
      <div className="bg-[#0E1420] rounded-3xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] p-6 sm:p-8 flex flex-col items-center text-center gap-4 relative overflow-hidden">
        {/* Big Centered Avatar */}
        <div className="w-24 sm:w-28 h-24 sm:h-28 rounded-3xl bg-[#59BBAF] text-[#080B11] font-black text-4xl flex items-center justify-center border-2 border-black shadow-[2px_2px_0_#000000] overflow-hidden">
          {user.avatar ? (
            <img src={user.avatar} alt={user.displayName} className="w-full h-full object-cover" />
          ) : (
            user.displayName.slice(0, 1)
          )}
        </div>

        {/* User Info */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white">{user.displayName}</h1>
            <RokadBadge membership={user.membership} size="md" />
          </div>
          <span className="text-body-sm font-mono text-[#64748B] dir-ltr">@{user.username}</span>
          <div className="inline-flex items-center gap-1.5 mt-1 px-3 py-0.5 rounded-full text-caption font-bold bg-[#0A0E17] border border-[#1E293B] text-[#94A3B8]">
            <span>{user.gender === 'boy' ? 'پسران' : 'دختران'}</span>
          </div>
        </div>

        {user.bio && (
          <p className="text-body-sm text-[#94A3B8] max-w-lg leading-relaxed mt-2 bg-[#0A0E17] p-3 sm:p-4 rounded-2xl border border-[#1E293B]">
            {user.bio}
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center overflow-x-auto pb-1 no-scrollbar">
        <Tabs
          items={[
            { id: 'stats', label: 'امتیاز و آمار' },
            { id: 'medals', label: `نشان‌ها (${toPersianDigits(medals.length)})` },
            { id: 'radar', label: 'رادار مهارت ۶ گانه' },
            { id: 'roles', label: 'دفتر نقش‌ها' },
            { id: 'recent', label: 'بازی‌های اخیر' },
          ]}
          activeId={activeTab}
          onChange={(id) => setActiveTab(id)}
        />
      </div>

      {/* TAB CONTENT */}

      {/* 1. STATS TAB */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in duration-200">
          <StatCard
            label="امتیاز کل لیدربورد"
            value={primaryStat.score}
            icon={<Trophy size={22} className="text-amber-400" />}
          />
          <StatCard
            label="تعداد کل بازی‌ها"
            value={primaryStat.matches}
            icon={<Shield size={22} className="text-[#59BBAF]" />}
          />
          <StatCard
            label="تعداد پیروزی‌ها"
            value={primaryStat.wins}
            icon={<Flame size={22} className="text-emerald-400" />}
            trend={`${toPersianDigits(primaryStat.matches > 0 ? Math.round((primaryStat.wins / primaryStat.matches) * 100) : 0)}٪ نرخ برد`}
          />
          <StatCard
            label="مدال‌ها و افتخارات"
            value={medals.length}
            icon={<Medal size={22} className="text-amber-400" />}
          />
        </div>
      )}

      {/* 2. COMPACT MEDALS & BADGES SHOWCASE */}
      {activeTab === 'medals' && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-200">
          {medals.length === 0 ? (
            <div className="p-8 text-center text-[#64748B] font-bold bg-[#0E1420] rounded-2xl border-1.5 border-dashed border-[#1E293B]">
              هنوز مدالی به این بازیکن اختصاص نیافته است.
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-1">
                <span className="text-body-sm font-black text-white">
                  ویترین نشان‌ها و مدال‌های افتخار ({toPersianDigits(medals.length)} نشان)
                </span>
                <span className="text-caption text-[#59BBAF]">
                  💡 برای مشاهده جزئیات دستاورد، سطح نشان و نظر داور، روی هر مدال کلیک کنید.
                </span>
              </div>

              {/* Compact Badges Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
                {medals.map((m: any) => {
                  const theme = getTierTheme(m.medal?.tier, m.medal?.slug);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMedal(m)}
                      className={`group p-2.5 sm:p-3 rounded-2xl bg-[#0E1420] hover:bg-[#141C2C] border-1.5 ${theme.border} ${theme.glow} flex flex-col items-center text-center transition-all duration-200 cursor-pointer active:scale-95 shadow-[1.5px_1.5px_0_#000000]`}
                    >
                      {/* Icon Container */}
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-1.5 ${theme.iconBg} flex items-center justify-center shrink-0 mb-1.5 transition-transform duration-200 group-hover:scale-110`}
                      >
                        {renderMedalIcon(m.medal?.icon, 24)}
                      </div>

                      {/* Title */}
                      <span className="text-[11px] sm:text-caption font-black text-white truncate w-full text-center px-0.5">
                        {m.medal?.title}
                      </span>

                      {/* Tier Pill */}
                      <span
                        className={`text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-full border mt-1.5 ${theme.badgeBg}`}
                      >
                        {theme.badgeText}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* 3. SPIDER RADAR CHART TAB */}
      {activeTab === 'radar' && (
        <div className="bg-[#0E1420] rounded-3xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] p-4 sm:p-8 flex flex-col items-center gap-4 animate-in fade-in duration-200 w-full max-w-full overflow-hidden">
          <div className="text-center max-w-md">
            <h3 className="text-title font-black text-white">رادار مهارت‌های ۶ گانه گیمینگ</h3>
            <p className="text-caption text-[#64748B] mt-1 break-words">
              تحلیل عملکرد بازیکن در حوزه‌های استدلال منطقی، بلوف‌زنی، مذاکره، رهبری، واکنش کلاچ و کار تیمی.
            </p>
          </div>

          <SpiderChart skills={radarSkills} size={320} />
        </div>
      )}

      {/* 4. ROLE PLAYBOOK TAB */}
      {activeTab === 'roles' && (
        <div className="bg-[#0E1420] rounded-2xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] overflow-hidden animate-in fade-in duration-200 w-full max-w-full">
          <div className="p-4 border-b border-[#1E293B] bg-[#0A0E17] font-bold text-title text-white">
            کارنامه بازی در نقش‌های مختلف
          </div>
          <div className="divide-y border-[#1E293B]">
            {rolePlaybook.map((r: any, idx: number) => (
              <div key={idx} className="p-4 flex items-center justify-between hover:bg-[#141C2C] transition-colors gap-2">
                <span className="text-body-sm font-bold text-white truncate min-w-0">{r.roleName}</span>
                <div className="flex items-center gap-2 sm:gap-3 text-caption font-bold shrink-0">
                  <span className="text-emerald-400 bg-emerald-950/40 px-2 sm:px-2.5 py-1 rounded-lg border border-emerald-500/30">
                    {toPersianDigits(r.wins)} برد
                  </span>
                  <span className="text-red-400 bg-red-950/40 px-2 sm:px-2.5 py-1 rounded-lg border border-red-500/30">
                    {toPersianDigits(r.losses)} باخت
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. RECENT MATCHES TAB */}
      {activeTab === 'recent' && (
        <div className="flex flex-col gap-3 animate-in fade-in duration-200 w-full max-w-full">
          {recentGames.length === 0 ? (
            <div className="p-8 text-center text-[#64748B] font-bold bg-[#0E1420] rounded-2xl border-1.5 border-dashed border-[#1E293B]">
              هنوز بازی اخیری ثبت نشده است.
            </div>
          ) : (
            <>
              {recentGames.slice(0, recentCount).map((game: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3.5 sm:p-4 bg-[#0E1420] rounded-2xl border-1.5 border-[#1E293B] shadow-[1.5px_1.5px_0_#000000] flex items-center justify-between gap-3 w-full max-w-full overflow-hidden"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold border-1.5 shrink-0 ${
                        game.isWinner
                          ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/40'
                          : 'bg-red-950/40 text-red-400 border-red-500/40'
                      }`}
                    >
                      {game.isWinner ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    </div>
                    <div className="flex flex-col text-right min-w-0 flex-1">
                      <span className="text-body-sm font-black text-white truncate">{game.sessionTitle}</span>
                      <span className="text-caption text-[#64748B] truncate">
                        نقش: {game.roleName} ({game.scenarioTitle})
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0">
                    <span
                      className={`text-caption font-bold ${
                        game.isWinner ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {game.isWinner ? 'پیروزی' : 'شکست'}
                    </span>
                    <span className="text-[11px] text-[#64748B] whitespace-nowrap">{formatShamsiDate(game.date)}</span>
                  </div>
                </div>
              ))}

              {recentGames.length > recentCount && (
                <Button
                  variant="outline"
                  size="sm"
                  className="self-center mt-2"
                  onClick={() => setRecentCount((prev) => prev + 5)}
                >
                  مشاهده بازی‌های بیشتر
                </Button>
              )}
            </>
          )}
        </div>
      )}

      {/* BADGE DETAILS MODAL */}
      <Modal
        isOpen={!!selectedMedal}
        onClose={() => setSelectedMedal(null)}
        title="شناسنامه نشان افتخار"
        maxWidth="sm"
      >
        {selectedMedal && (() => {
          const theme = getTierTheme(selectedMedal.medal?.tier, selectedMedal.medal?.slug);
          return (
            <div className="flex flex-col items-center text-center gap-4">
              {/* Glowing Hero Icon */}
              <div
                className={`w-20 h-20 rounded-3xl border-2 ${theme.iconBg} ${theme.glow} flex items-center justify-center shadow-lg mt-1`}
              >
                {renderMedalIcon(selectedMedal.medal?.icon, 36)}
              </div>

              {/* Title & Tier Badge */}
              <div className="flex flex-col items-center gap-1.5">
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {selectedMedal.medal?.title}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-caption font-black px-3 py-1 rounded-full border ${theme.badgeBg}`}>
                    {theme.name}
                  </span>
                  <span className="text-caption font-bold px-2.5 py-1 rounded-full bg-[#141C2C] text-[#94A3B8] border border-[#1E293B]">
                    دستاورد باشگاه
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="w-full text-right p-4 bg-[#0A0E17] rounded-2xl border border-[#1E293B] flex flex-col gap-1.5">
                <span className="text-caption text-[#64748B] font-bold">شرح دستاورد:</span>
                <p className="text-body-sm text-[#CBD5E1] leading-relaxed break-words">
                  {selectedMedal.medal?.description || 'توضیحاتی برای این نشان ثبت نشده است.'}
                </p>
              </div>

              {/* Referee Note */}
              {selectedMedal.note && (
                <div className="w-full text-right p-4 bg-amber-950/20 rounded-2xl border border-amber-500/30 flex flex-col gap-1.5">
                  <span className="text-caption font-black text-amber-400 flex items-center gap-1">
                    <Award size={15} />
                    <span>یادداشت داور و میزبان مسابقه:</span>
                  </span>
                  <p className="text-body-sm text-amber-200/90 leading-relaxed font-bold break-words">
                    {selectedMedal.note}
                  </p>
                </div>
              )}

              {/* Award Date */}
              {selectedMedal.awardedAt && (
                <div className="flex items-center gap-1.5 text-caption font-bold text-[#64748B]">
                  <Calendar size={14} className="text-[#59BBAF]" />
                  <span>تاریخ کسب افتخار: {formatShamsiDate(selectedMedal.awardedAt)}</span>
                </div>
              )}

              {/* Action Close */}
              <Button
                variant="primary"
                size="md"
                className="w-full mt-2"
                onClick={() => setSelectedMedal(null)}
              >
                متوجه شدم
              </Button>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
};
