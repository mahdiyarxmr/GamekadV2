import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { Tabs } from '../components/ui/Tabs';
import { RokadBadge } from '../components/ui/Badge';
import { SpiderChart } from '../components/ui/SpiderChart';
import { StatCard } from '../components/ui/StatCard';
import { Button } from '../components/ui/Button';
import { Trophy, Medal, Flame, Shield, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { toPersianDigits, formatShamsiDate } from '../utils/formatters';

export const PlayerProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('stats');
  const [recentCount, setRecentCount] = useState<number>(5);

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

      {/* 2. MEDALS TAB */}
      {activeTab === 'medals' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-200">
          {medals.length === 0 ? (
            <div className="col-span-full p-8 text-center text-[#64748B] font-bold bg-[#0E1420] rounded-2xl border-1.5 border-dashed border-[#1E293B]">
              هنوز مدالی به این بازیکن اختصاص نیافته است.
            </div>
          ) : (
            medals.map((m: any) => (
              <div
                key={m.id}
                className="p-5 bg-[#0E1420] rounded-2xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] flex items-center gap-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-400/10 text-amber-400 border-1.5 border-amber-500/40 flex items-center justify-center shrink-0">
                  <Medal size={28} />
                </div>
                <div className="flex flex-col text-right">
                  <h4 className="text-title font-black text-white">{m.medal?.title}</h4>
                  <p className="text-body-sm text-[#94A3B8] leading-relaxed mt-0.5">
                    {m.medal?.description}
                  </p>
                  {m.note && (
                    <span className="text-caption font-bold text-amber-400 mt-1">
                      یادداشت داور: {m.note}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 3. SPIDER RADAR CHART TAB */}
      {activeTab === 'radar' && (
        <div className="bg-[#0E1420] rounded-3xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] p-6 sm:p-8 flex flex-col items-center gap-4 animate-in fade-in duration-200">
          <div className="text-center">
            <h3 className="text-title font-black text-white">رادار مهارت‌های ۶ گانه گیمینگ</h3>
            <p className="text-caption text-[#64748B] mt-1">
              تحلیل عملکرد بازیکن در حوزه‌های استدلال منطقی، بلوف‌زنی، مذاکره، رهبری، واکنش کلاچ و کار تیمی.
            </p>
          </div>

          <SpiderChart skills={radarSkills} size={320} />
        </div>
      )}

      {/* 4. ROLE PLAYBOOK TAB */}
      {activeTab === 'roles' && (
        <div className="bg-[#0E1420] rounded-2xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] overflow-hidden animate-in fade-in duration-200">
          <div className="p-4 border-b border-[#1E293B] bg-[#0A0E17] font-bold text-title text-white">
            کارنامه بازی در نقش‌های مختلف
          </div>
          <div className="divide-y border-[#1E293B]">
            {rolePlaybook.map((r: any, idx: number) => (
              <div key={idx} className="p-4 flex items-center justify-between hover:bg-[#141C2C] transition-colors">
                <span className="text-body-sm font-bold text-white">{r.roleName}</span>
                <div className="flex items-center gap-3 text-caption font-bold">
                  <span className="text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                    {toPersianDigits(r.wins)} برد
                  </span>
                  <span className="text-red-400 bg-red-950/40 px-2.5 py-1 rounded-lg border border-red-500/30">
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
        <div className="flex flex-col gap-3 animate-in fade-in duration-200">
          {recentGames.length === 0 ? (
            <div className="p-8 text-center text-[#64748B] font-bold bg-[#0E1420] rounded-2xl border-1.5 border-dashed border-[#1E293B]">
              هنوز بازی اخیری ثبت نشده است.
            </div>
          ) : (
            <>
              {recentGames.slice(0, recentCount).map((game: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 bg-[#0E1420] rounded-2xl border-1.5 border-[#1E293B] shadow-[1.5px_1.5px_0_#000000] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold border-1.5 ${
                        game.isWinner
                          ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/40'
                          : 'bg-red-950/40 text-red-400 border-red-500/40'
                      }`}
                    >
                      {game.isWinner ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-body-sm font-black text-white">{game.sessionTitle}</span>
                      <span className="text-caption text-[#64748B]">
                        نقش: {game.roleName} ({game.scenarioTitle})
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span
                      className={`text-caption font-bold ${
                        game.isWinner ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {game.isWinner ? 'پیروزی' : 'شکست'}
                    </span>
                    <span className="text-[11px] text-[#64748B]">{formatShamsiDate(game.date)}</span>
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
    </div>
  );
};
