import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { RokadBadge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { Users, Search, Trophy, Medal, Flame } from 'lucide-react';
import { toPersianDigits } from '../utils/formatters';

export const PlayersPage: React.FC = () => {
  const [players, setPlayers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [membershipFilter, setMembershipFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .getPlayers({
        search,
        membership: membershipFilter !== 'all' ? membershipFilter : undefined,
      })
      .then((res) => {
        setPlayers(res.players || []);
      })
      .finally(() => setLoading(false));
  }, [search, membershipFilter]);

  return (
    <div className="flex flex-col gap-6 sm:gap-8 py-4 sm:py-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#59BBAF]/15 text-[#59BBAF] border border-[#59BBAF]/30 w-fit text-caption font-black">
          <Users size={14} className="text-[#59BBAF]" />
          <span>تالار اعضا و رقابت‌کنندگان</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">بازیکنان و اعضای باشگاه گیم‌کاد</h1>
        <p className="text-body-sm sm:text-body text-[#94A3B8]">
          پروفایل بازیکنان و گیمرهای مافیا و کنسولی در اکوسیستم هنرستان رکاد و رقابت‌کنندگان آزاد مشهد.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3.5 sm:p-4 bg-[#0E1420] rounded-2xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000]">
        <div className="relative w-full sm:w-80">
          <Search size={18} className="absolute right-3.5 top-3 text-[#64748B]" />
          <input
            type="text"
            placeholder="جستجوی نام یا نام کاربری..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pr-10 pl-4 bg-[#0A0E17] text-body-sm rounded-xl border border-[#1E293B] outline-none focus:border-[#59BBAF] text-white placeholder-[#64748B]"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-caption font-bold text-[#64748B] ml-1">عضویت:</span>
          {[
            { id: 'all', label: 'همه' },
            { id: 'ROKAD', label: 'رُکادی‌ها' },
            { id: 'EXTERNAL', label: 'آزاد / مهمان' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setMembershipFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-caption font-bold border transition-all cursor-pointer btn-tactile ${
                membershipFilter === f.id
                  ? 'bg-[#59BBAF] text-[#080B11] border-black shadow-[1.5px_1.5px_0_#000000]'
                  : 'bg-[#0A0E17] text-[#94A3B8] border-[#1E293B] hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Players Grid */}
      {loading ? (
        <div className="p-12 text-center text-[#64748B] font-bold">در حال بارگذاری لیست بازیکنان...</div>
      ) : players.length === 0 ? (
        <EmptyState
          icon={<Users size={32} className="text-[#59BBAF]" />}
          title="بازیکنی با این مشخصات یافت نشد"
          actionText="پاک کردن فیلترها"
          onAction={() => {
            setSearch('');
            setMembershipFilter('all');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {players.map((p) => (
            <Link
              key={p.id}
              to={`/players/${p.username}`}
              className="bg-[#0E1420] rounded-2xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] hover:border-[#59BBAF] transition-all p-5 flex flex-col items-center text-center gap-4 group"
            >
              <div className="w-20 h-20 rounded-2xl bg-[#59BBAF] text-[#080B11] font-black text-2xl flex items-center justify-center border-2 border-black shadow-[2px_2px_0_#000000] group-hover:scale-105 transition-transform overflow-hidden">
                {p.avatar ? (
                  <img src={p.avatar} alt={p.displayName} className="w-full h-full object-cover" />
                ) : (
                  p.displayName.slice(0, 1)
                )}
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-title font-black text-white group-hover:text-[#59BBAF] transition-colors">
                    {p.displayName}
                  </h3>
                  <RokadBadge membership={p.membership} size="sm" />
                </div>
                <span className="text-[11px] font-mono text-[#64748B] dir-ltr">@{p.username}</span>
              </div>

              {p.bio && (
                <p className="text-body-sm text-[#94A3B8] line-clamp-2 leading-relaxed">
                  {p.bio}
                </p>
              )}

              <div className="w-full pt-3 border-t border-[#1E293B] flex items-center justify-around text-caption">
                <div className="flex flex-col">
                  <span className="text-[#64748B]">بردها</span>
                  <span className="font-bold text-emerald-400">{toPersianDigits(p.wins || 0)}</span>
                </div>
                <div className="w-px h-6 bg-[#1E293B]" />
                <div className="flex flex-col">
                  <span className="text-[#64748B]">امتیاز</span>
                  <span className="font-black text-[#59BBAF]">{toPersianDigits(p.score || 0)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
