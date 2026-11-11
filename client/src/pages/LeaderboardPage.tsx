import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { GameCategory } from '../types';
import { RokadBadge } from '../components/ui/Badge';
import { Trophy, Medal, Flame, Users, ArrowLeft, Crown } from 'lucide-react';
import { toPersianDigits } from '../utils/formatters';

export const LeaderboardPage: React.FC = () => {
  const [categories, setCategories] = useState<GameCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('mafia');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [rankings, setRankings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCategories().then((cats) => {
      setCategories(cats);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .getLeaderboard(activeCategory, genderFilter)
      .then((res) => {
        setRankings(res.rankings || []);
      })
      .finally(() => setLoading(false));
  }, [activeCategory, genderFilter]);

  return (
    <div className="flex flex-col gap-6 sm:gap-8 py-4 sm:py-6 max-w-6xl mx-auto w-full min-w-0">
      {/* Centered Header */}
      <div className="flex flex-col items-center text-center gap-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#59BBAF]/15 text-[#59BBAF] border border-[#59BBAF]/30 text-caption font-black">
          <Trophy size={14} className="text-amber-400" />
          <span>جدول رنکینگ رسمی گیم‌کاد</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white">رده‌بندی گرگ‌های شب و گیمرهای برتر</h1>
        <p className="text-body-sm sm:text-body text-[#94A3B8]">
          جدول زنده امتیازات ثبت‌شده در نشست‌های بازی، نرخ برد، تعداد کلاچ‌های طلایی و مدال‌های افتخار.
        </p>
      </div>

      {/* Category Tabs & Gender Filter */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5 sm:p-4 bg-[#0E1420] rounded-2xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] w-full">
        {/* Categories Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-3.5 py-1.5 rounded-xl text-caption sm:text-body-sm font-black border transition-all select-none cursor-pointer whitespace-nowrap btn-tactile ${
                activeCategory === cat.slug
                  ? 'bg-[#59BBAF] text-[#080B11] border-black shadow-[1.5px_1.5px_0_#000000]'
                  : 'bg-[#0A0E17] text-[#94A3B8] border-[#1E293B] hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Gender Filter */}
        <div className="flex items-center gap-1.5 shrink-0 justify-center">
          <span className="text-caption font-bold text-[#64748B] ml-1">جنسیت:</span>
          {[
            { id: 'all', label: 'همه' },
            { id: 'boy', label: 'پسران' },
            { id: 'girl', label: 'دختران' },
          ].map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setGenderFilter(g.id)}
              className={`px-3 py-1 rounded-xl text-caption font-bold border transition-all cursor-pointer ${
                genderFilter === g.id
                  ? 'bg-white text-black border-white'
                  : 'bg-[#0A0E17] text-[#64748B] border-[#1E293B]'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3D GAMING PODIUM */}
      {rankings.length >= 3 && (
        <div className="bg-gradient-to-b from-[#0E1420] to-[#0A0E17] rounded-3xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] p-5 sm:p-8 flex items-end justify-center gap-2 sm:gap-6 pt-10 select-none overflow-hidden w-full">
          {/* Rank 2 (Silver Pedestal) */}
          <div className="flex flex-col items-center gap-2 flex-1 max-w-[130px] sm:max-w-[150px]">
            <Link to={`/players/${rankings[1].username}`} className="flex flex-col items-center gap-1 group">
              <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-[#59BBAF] text-[#080B11] border-2 border-slate-300 shadow-[0_0_15px_rgba(148,163,184,0.3)] flex items-center justify-center font-black text-xl overflow-hidden group-hover:scale-105 transition-transform">
                {rankings[1].avatar ? <img src={rankings[1].avatar} alt={rankings[1].displayName} className="w-full h-full object-cover" /> : rankings[1].displayName.slice(0, 1)}
              </div>
              <span className="text-caption sm:text-body-sm font-black text-white truncate max-w-[100px] sm:max-w-[130px] text-center mt-1">
                {rankings[1].displayName}
              </span>
              <span className="text-[10px] font-black text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-600">
                🥈 رتبه ۲
              </span>
            </Link>
            <div className="w-full h-24 sm:h-28 rounded-t-2xl bg-gradient-to-t from-slate-900 to-slate-800 border-t-2 border-x-2 border-slate-400/60 flex flex-col items-center justify-center text-center p-2 shadow-inner">
              <span className="text-title sm:text-h2 font-black text-slate-200">{toPersianDigits(rankings[1].score)}</span>
              <span className="text-[10px] text-slate-400 font-bold">امتیاز</span>
            </div>
          </div>

          {/* Rank 1 (Gold Pedestal) */}
          <div className="flex flex-col items-center gap-2 flex-1 max-w-[140px] sm:max-w-[170px] relative z-10">
            <div className="text-amber-400 animate-bounce">
              <Crown size={28} />
            </div>
            <Link to={`/players/${rankings[0].username}`} className="flex flex-col items-center gap-1 group">
              <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-amber-400 text-black border-2 border-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.5)] flex items-center justify-center font-black text-2xl overflow-hidden group-hover:scale-105 transition-transform">
                {rankings[0].avatar ? <img src={rankings[0].avatar} alt={rankings[0].displayName} className="w-full h-full object-cover" /> : rankings[0].displayName.slice(0, 1)}
              </div>
              <span className="text-caption sm:text-body-sm font-black text-white truncate max-w-[110px] sm:max-w-[140px] text-center mt-1">
                {rankings[0].displayName}
              </span>
              <span className="text-[10px] font-black text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/50">
                👑 گرگ برتر
              </span>
            </Link>
            <div className="w-full h-32 sm:h-36 rounded-t-2xl bg-gradient-to-t from-amber-950/60 via-amber-900/40 to-amber-800/50 border-t-2 border-x-2 border-amber-400 flex flex-col items-center justify-center text-center p-2 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <span className="text-title sm:text-h1 font-black text-amber-300">{toPersianDigits(rankings[0].score)}</span>
              <span className="text-[10px] text-amber-400/80 font-bold">امتیاز طلایی</span>
            </div>
          </div>

          {/* Rank 3 (Bronze Pedestal) */}
          <div className="flex flex-col items-center gap-2 flex-1 max-w-[130px] sm:max-w-[150px]">
            <Link to={`/players/${rankings[2].username}`} className="flex flex-col items-center gap-1 group">
              <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-[#59BBAF] text-[#080B11] border-2 border-amber-700 shadow-[0_0_15px_rgba(180,83,9,0.3)] flex items-center justify-center font-black text-xl overflow-hidden group-hover:scale-105 transition-transform">
                {rankings[2].avatar ? <img src={rankings[2].avatar} alt={rankings[2].displayName} className="w-full h-full object-cover" /> : rankings[2].displayName.slice(0, 1)}
              </div>
              <span className="text-caption sm:text-body-sm font-black text-white truncate max-w-[100px] sm:max-w-[130px] text-center mt-1">
                {rankings[2].displayName}
              </span>
              <span className="text-[10px] font-black text-amber-500 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-700">
                🥉 رتبه ۳
              </span>
            </Link>
            <div className="w-full h-20 sm:h-22 rounded-t-2xl bg-gradient-to-t from-amber-950/80 to-amber-900/60 border-t-2 border-x-2 border-amber-700/60 flex flex-col items-center justify-center text-center p-2 shadow-inner">
              <span className="text-title sm:text-h2 font-black text-amber-400">{toPersianDigits(rankings[2].score)}</span>
              <span className="text-[10px] text-amber-500/80 font-bold">امتیاز</span>
            </div>
          </div>
        </div>
      )}

      {/* Rankings Display (Table on Desktop, Cards on Mobile) */}
      <div className="bg-[#0E1420] rounded-3xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#64748B] font-bold">در حال محاسبه رنکینگ...</div>
        ) : rankings.length === 0 ? (
          <div className="p-12 text-center text-[#64748B] font-bold">
            هنوز امتیازی برای این دسته و جنسیت ثبت نشده است.
          </div>
        ) : (
          <>
            {/* MOBILE CARDS VIEW (< sm) */}
            <div className="block sm:hidden divide-y border-[#1E293B]">
              {rankings.map((p) => (
                <div key={p.userId} className="p-4 flex flex-col gap-3 hover:bg-[#141C2C]/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-black text-caption border-1.5 ${
                          p.rank === 1
                            ? 'bg-amber-400 text-black border-amber-500 shadow-md'
                            : p.rank === 2
                            ? 'bg-slate-300 text-slate-900 border-slate-400'
                            : p.rank === 3
                            ? 'bg-amber-600 text-white border-amber-700'
                            : 'bg-[#0A0E17] text-[#64748B] border-[#1E293B]'
                        }`}
                      >
                        {toPersianDigits(p.rank)}
                      </span>

                      <Link to={`/players/${p.username}`} className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-[#59BBAF] text-[#080B11] font-black flex items-center justify-center text-caption shrink-0 overflow-hidden border border-black/40">
                          {p.avatar ? (
                            <img src={p.avatar} alt={p.displayName} className="w-full h-full object-cover" />
                          ) : (
                            p.displayName.slice(0, 1)
                          )}
                        </div>
                        <div className="flex flex-col text-right">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white text-body-sm">{p.displayName}</span>
                            <RokadBadge membership={p.membership} size="sm" />
                          </div>
                          <span className="text-[11px] text-[#64748B] font-mono dir-ltr text-right">
                            @{p.username}
                          </span>
                        </div>
                      </Link>
                    </div>

                    <div className="text-left">
                      <span className="text-title font-black text-[#59BBAF]">
                        {toPersianDigits(p.score)}
                      </span>
                      <span className="text-[10px] text-[#64748B] block">امتیاز کل</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#1E293B]/60 text-caption font-bold">
                    <span className="text-[#94A3B8]">
                      بازی‌ها: <strong className="text-white">{toPersianDigits(p.matches)}</strong>
                    </span>
                    <span className="text-emerald-400">
                      بردها: <strong>{toPersianDigits(p.wins)}</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 text-[11px]">
                      برد: {toPersianDigits(p.winRate)}٪
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP TABLE VIEW (>= sm) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="border-b border-[#1E293B] bg-[#0A0E17] text-caption font-black text-[#64748B]">
                    <th className="py-4 px-4 sm:px-6 text-center w-16">رتبه</th>
                    <th className="py-4 px-4 sm:px-6">بازیکن</th>
                    <th className="py-4 px-4 sm:px-6 text-center">بازی‌ها</th>
                    <th className="py-4 px-4 sm:px-6 text-center">بردها</th>
                    <th className="py-4 px-4 sm:px-6 text-center">نرخ برد</th>
                    <th className="py-4 px-4 sm:px-6 text-center">مدال‌ها</th>
                    <th className="py-4 px-4 sm:px-6 text-left">امتیاز کل</th>
                  </tr>
                </thead>
                <tbody className="divide-y border-[#1E293B] text-body-sm">
                  {rankings.map((p) => (
                    <tr
                      key={p.userId}
                      className="hover:bg-[#141C2C] transition-colors group cursor-pointer"
                    >
                      {/* Rank */}
                      <td className="py-4 px-4 sm:px-6 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-xl font-black text-body-sm border-1.5 ${
                            p.rank === 1
                              ? 'bg-amber-400 text-black border-amber-500 shadow-md'
                              : p.rank === 2
                              ? 'bg-slate-300 text-slate-900 border-slate-400'
                              : p.rank === 3
                              ? 'bg-amber-600 text-white border-amber-700'
                              : 'bg-[#0A0E17] text-[#64748B] border-[#1E293B]'
                          }`}
                        >
                          {toPersianDigits(p.rank)}
                        </span>
                      </td>

                      {/* Player Info */}
                      <td className="py-4 px-4 sm:px-6">
                        <Link
                          to={`/players/${p.username}`}
                          className="flex items-center gap-3 hover:text-[#59BBAF]"
                        >
                          <div className="w-10 h-10 rounded-xl bg-[#59BBAF] text-[#080B11] font-black flex items-center justify-center text-body-sm shrink-0 overflow-hidden border border-black/40">
                            {p.avatar ? (
                              <img src={p.avatar} alt={p.displayName} className="w-full h-full object-cover" />
                            ) : (
                              p.displayName.slice(0, 1)
                            )}
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-white group-hover:text-[#59BBAF]">
                                {p.displayName}
                              </span>
                              <RokadBadge membership={p.membership} size="sm" />
                            </div>
                            <span className="text-[11px] text-[#64748B] font-mono dir-ltr text-right">
                              @{p.username}
                            </span>
                          </div>
                        </Link>
                      </td>

                      {/* Matches */}
                      <td className="py-4 px-4 sm:px-6 text-center font-bold text-[#94A3B8]">
                        {toPersianDigits(p.matches)}
                      </td>

                      {/* Wins */}
                      <td className="py-4 px-4 sm:px-6 text-center font-bold text-emerald-400">
                        {toPersianDigits(p.wins)}
                      </td>

                      {/* Win Rate */}
                      <td className="py-4 px-4 sm:px-6 text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-caption font-black bg-emerald-950/40 text-emerald-400 border border-emerald-500/30">
                          {toPersianDigits(p.winRate)}٪
                        </span>
                      </td>

                      {/* Medals */}
                      <td className="py-4 px-4 sm:px-6 text-center">
                        <span className="text-caption font-bold text-[#64748B]">
                          {toPersianDigits(p.medals?.length || 0)} نشان
                        </span>
                      </td>

                      {/* Total Score */}
                      <td className="py-4 px-4 sm:px-6 text-left">
                        <span className="text-title font-black text-[#59BBAF]">
                          {toPersianDigits(p.score)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
