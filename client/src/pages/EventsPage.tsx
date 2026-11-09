import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { EventItem, GameCategory } from '../types';
import { Button } from '../components/ui/Button';
import { GenderBadge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { formatTomans, formatShamsiDate, toPersianDigits } from '../utils/formatters';
import { Calendar, Clock, MapPin, Flame, ArrowLeft, Users, Shield } from 'lucide-react';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [categories, setCategories] = useState<GameCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    Promise.all([api.getEvents(), api.getCategories()])
      .then(([evts, cats]) => {
        setEvents(evts);
        setCategories(cats);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredEvents = events.filter((e) => {
    if (genderFilter !== 'all' && e.targetGender !== genderFilter && e.targetGender !== 'mixed') {
      return false;
    }
    if (categoryFilter !== 'all' && e.categoryId !== categoryFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-6 sm:gap-8 py-4 sm:py-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#59BBAF]/15 text-[#59BBAF] border border-[#59BBAF]/30 w-fit text-caption font-black">
          <Flame size={14} className="text-amber-400" />
          <span>رزرو صندلی در سالن‌های رسمی مشهد</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">میزهای داغ بازی و رویدادهای حضوری کلاب</h1>
        <p className="text-body-sm sm:text-body text-[#94A3B8]">
          رزرو فوری صندلی در شب‌های مافیا با حضور گرداننده رسمی، تورنمنت‌های مسابقاتی کنسولی و دورهمی‌های بوردگیم گیم‌کاد.
        </p>
      </div>

      {/* Filters (Mobile Scrollable Pills) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 sm:p-4 bg-[#0E1420] rounded-2xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000]">
        {/* Gender Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          <span className="text-caption font-bold text-[#64748B] ml-1 shrink-0">میز:</span>
          {[
            { id: 'all', label: 'همه میزها' },
            { id: 'boys', label: 'پسران' },
            { id: 'girls', label: 'دختران' },
            { id: 'mixed', label: 'مختلط' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setGenderFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-caption font-black border transition-all cursor-pointer whitespace-nowrap btn-tactile ${
                genderFilter === f.id
                  ? 'bg-[#59BBAF] text-[#080B11] border-black shadow-[1.5px_1.5px_0_#000000]'
                  : 'bg-[#0A0E17] text-[#94A3B8] border-[#1E293B] hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-caption font-bold text-[#64748B] ml-1">دسته:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-9 px-3 bg-[#0A0E17] text-white text-caption font-bold rounded-xl border border-[#1E293B] outline-none focus:border-[#59BBAF]"
          >
            <option value="all">همه دسته‌ها</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#0E1420] text-white">
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="p-12 text-center text-[#64748B] font-bold">در حال بارگذاری میزها...</div>
      ) : filteredEvents.length === 0 ? (
        <EmptyState
          icon={<Calendar size={32} className="text-[#59BBAF]" />}
          title="میزی با این فیلترها یافت نشد"
          description="می‌توانید فیلتر مخاطب یا دسته بازی را تغییر دهید."
          actionText="مشاهده همه میزها"
          onAction={() => {
            setGenderFilter('all');
            setCategoryFilter('all');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="bg-[#0E1420] rounded-2xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] hover:border-[#59BBAF] transition-all p-5 sm:p-6 flex flex-col justify-between gap-5 group"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <GenderBadge targetGender={evt.targetGender} />
                  <span className="text-caption font-black text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    {toPersianDigits(evt.remainingSeats || 0)} صندلی خالی
                  </span>
                </div>

                <h3 className="text-title sm:text-h2 font-black text-white group-hover:text-[#59BBAF] transition-colors line-clamp-1">
                  {evt.title}
                </h3>
                <p className="text-body-sm text-[#94A3B8] line-clamp-2 leading-relaxed">
                  {evt.description}
                </p>

                <div className="flex flex-col gap-1.5 text-caption font-bold text-[#64748B] pt-2 border-t border-[#1E293B]">
                  <div className="flex items-center gap-1.5 text-white">
                    <Clock size={14} className="text-[#59BBAF]" />
                    <span>{formatShamsiDate(evt.startTime)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#59BBAF]" />
                    <span className="truncate">{evt.venueAddress}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#64748B] block">
                    {evt.payType === 'deposit' ? 'پیش‌پرداخت رزرو:' : 'ورودی کامل:'}
                  </span>
                  <span className="text-body sm:text-title font-black text-[#59BBAF]">
                    {formatTomans(evt.payType === 'deposit' ? (evt.depositAmount || Math.round(evt.price * 0.3)) : evt.price)}
                  </span>
                </div>
                <Link to={`/events/${evt.id}`}>
                  <Button variant="primary" size="sm">
                    <span>انتخاب صندلی</span>
                    <ArrowLeft size={14} />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
