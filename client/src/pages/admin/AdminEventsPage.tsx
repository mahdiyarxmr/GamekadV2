import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { EventItem, GameCategory } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { GenderBadge } from '../../components/ui/Badge';
import { formatTomans, formatShamsiDate, toPersianDigits } from '../../utils/formatters';
import { Calendar, Plus, Users, CheckCircle2, Clock, MapPin, Tag } from 'lucide-react';

export const AdminEventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [categories, setCategories] = useState<GameCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [selectedEventReservations, setSelectedEventReservations] = useState<any[]>([]);
  const [selectedEventTitle, setSelectedEventTitle] = useState('');

  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    targetGender: 'mixed',
    payType: 'full',
    price: 85000,
    depositAmount: 30000,
    capacity: 12,
    venueAddress: 'مشهد، بلوار سجاد، بزرگمهر شمالی ۱، سالن مسابقات کلاب گیم‌کاد',
  });

  const fetchData = async () => {
    try {
      const [evts, cats] = await Promise.all([api.getEvents(), api.getCategories()]);
      setEvents(evts);
      setCategories(cats);
      if (cats.length > 0 && !createForm.categoryId) {
        setCreateForm((prev) => ({ ...prev, categoryId: cats[0].id }));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createEvent(createForm);
      setIsCreateOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'خطا در ساخت رویداد');
    }
  };

  const handleOpenAttendance = async (event: EventItem) => {
    const detail = await api.getEvent(event.id);
    setSelectedEventTitle(event.title);
    setSelectedEventReservations(detail.reservations || []);
    setIsAttendanceOpen(true);
  };

  const handleToggleAttendance = async (resId: string) => {
    await api.toggleAttendance(resId);
    setSelectedEventReservations((prev) =>
      prev.map((r) => (r.id === resId ? { ...r, attended: !r.attended } : r)),
    );
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-[#94A3B8] font-bold">
        در حال بارگذاری لیست میزهای بازی...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">مدیریت رویدادها و میزهای بازی</h1>
          <p className="text-body-sm text-[#94A3B8]">
            تعریف میزهای جدید مسابقاتی، مدیریت ظرفیت و ثبت حضور شرکت‌کنندگان.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsCreateOpen(true)}
          className="w-full sm:w-auto justify-center"
        >
          <Plus size={18} />
          <span>تعریف نشست جدید</span>
        </Button>
      </div>

      {/* MOBILE CARD VIEW: Shown on screens smaller than md */}
      <div className="flex flex-col gap-3.5 md:hidden">
        {events.map((evt) => (
          <div
            key={evt.id}
            className="p-4 bg-[#0E1420] rounded-2xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] flex flex-col gap-3.5"
          >
            {/* Top row: Title and Gender */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-body-sm font-black text-white leading-snug break-words flex-1">
                {evt.title}
              </h3>
              <GenderBadge targetGender={evt.targetGender || (evt as any).gender} />
            </div>

            {/* Middle row: Stats pills */}
            <div className="grid grid-cols-2 gap-2 text-caption">
              <div className="p-2 bg-[#0A0E17] rounded-xl border border-[#1E293B] flex items-center justify-between">
                <span className="text-[#64748B]">ظرفیت:</span>
                <span className="font-black text-white">
                  {toPersianDigits(evt.reservedCount || 0)} / {toPersianDigits(evt.capacity)}
                </span>
              </div>
              <div className="p-2 bg-[#0A0E17] rounded-xl border border-[#1E293B] flex items-center justify-between">
                <span className="text-[#64748B]">ورودی:</span>
                <span className="font-black text-[#59BBAF]">{formatTomans(evt.price)}</span>
              </div>
            </div>

            {/* Date and Address */}
            <div className="flex items-center gap-1.5 text-caption text-[#94A3B8]">
              <Clock size={13} className="text-[#59BBAF] shrink-0" />
              <span>{formatShamsiDate(evt.startTime)}</span>
            </div>

            {/* CTA: Attendance Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenAttendance(evt)}
              className="w-full justify-center h-10 border-[#1E293B] hover:border-[#59BBAF] text-white"
            >
              <Users size={15} className="text-[#59BBAF]" />
              <span>مدیریت حضور و صندلی‌ها</span>
            </Button>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE VIEW: Shown on md and larger */}
      <div className="hidden md:block bg-[#0E1420] rounded-3xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-[#1E293B] bg-[#0A0E17] text-caption font-black text-[#64748B]">
                <th className="py-3.5 px-5">عنوان میز</th>
                <th className="py-3.5 px-5">مخاطب</th>
                <th className="py-3.5 px-5 text-center">ظرفیت / رزرو</th>
                <th className="py-3.5 px-5 text-center">ورودی</th>
                <th className="py-3.5 px-5">زمان برگزاری</th>
                <th className="py-3.5 px-5 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B] text-body-sm">
              {events.map((evt) => (
                <tr key={evt.id} className="hover:bg-[#141C2C] transition-colors">
                  <td className="py-4 px-5 font-bold text-white max-w-xs truncate">
                    {evt.title}
                  </td>
                  <td className="py-4 px-5">
                    <GenderBadge targetGender={evt.targetGender || (evt as any).gender} />
                  </td>
                  <td className="py-4 px-5 text-center font-bold">
                    <span className="text-[#59BBAF]">{toPersianDigits(evt.reservedCount || 0)}</span>
                    <span className="text-[#64748B]"> / {toPersianDigits(evt.capacity)}</span>
                  </td>
                  <td className="py-4 px-5 text-center font-black text-[#59BBAF]">
                    {formatTomans(evt.price)}
                  </td>
                  <td className="py-4 px-5 text-caption text-[#94A3B8]">
                    {formatShamsiDate(evt.startTime)}
                  </td>
                  <td className="py-4 px-5 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenAttendance(evt)}
                      className="border-[#1E293B] hover:border-[#59BBAF]"
                    >
                      <Users size={14} className="text-[#59BBAF]" />
                      <span>حضور و غیاب</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance & Seating Modal */}
      <Modal
        isOpen={isAttendanceOpen}
        onClose={() => setIsAttendanceOpen(false)}
        title="ثبت حضور و کنترل صندلی‌های میز"
        maxWidth="lg"
      >
        <div className="flex flex-col gap-4">
          <div className="p-3 bg-[#0A0E17] rounded-xl border border-[#1E293B] text-body-sm font-bold text-white flex items-center justify-between">
            <span className="truncate">{selectedEventTitle}</span>
            <span className="text-caption font-black text-[#59BBAF] shrink-0">
              {toPersianDigits(selectedEventReservations.length)} نفر ثبت‌نامی
            </span>
          </div>

          {selectedEventReservations.length === 0 ? (
            <div className="p-8 text-center text-[#64748B] text-body-sm font-bold bg-[#0A0E17] rounded-2xl border border-[#1E293B]">
              هنوز بازیکنی روی این میز صندلی رزرو نکرده است.
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 max-h-96 overflow-y-auto pr-1">
              {selectedEventReservations.map((res: any) => (
                <div
                  key={res.id}
                  className="p-3 sm:p-3.5 rounded-xl border border-[#1E293B] bg-[#0A0E17] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-8 h-8 rounded-lg bg-[#141C2C] border border-[#1E293B] flex items-center justify-center font-black text-caption text-[#59BBAF] shrink-0">
                      #{toPersianDigits(res.seatNumber)}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-caption sm:text-body-sm text-white truncate">
                        {res.user?.displayName || 'کاربر مهمان'}
                      </span>
                      <span className="text-[11px] text-[#64748B] truncate">
                        @{res.user?.username || 'user'} • {res.user?.phone || 'بدون شماره'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleAttendance(res.id)}
                    className={`h-9 px-3.5 rounded-xl font-black text-caption flex items-center gap-1.5 transition-all shrink-0 ${
                      res.attended
                        ? 'bg-emerald-500 text-black shadow-sm'
                        : 'bg-[#141C2C] text-[#94A3B8] border border-[#1E293B] hover:text-white'
                    }`}
                  >
                    <CheckCircle2 size={15} />
                    <span>{res.attended ? 'حاضر شد' : 'ثبت حضور'}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Create Event Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="تعریف نشست و میز بازی جدید"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateEvent} className="flex flex-col gap-4">
          <Input
            label="عنوان کامل میز"
            placeholder="مثال: فینال لیگ مافیا (سناریوی پدرخوانده)"
            value={createForm.title}
            onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5 text-right">
              <label className="text-body-sm font-bold text-white">دسته‌بندی بازی</label>
              <select
                value={createForm.categoryId}
                onChange={(e) => setCreateForm({ ...createForm, categoryId: e.target.value })}
                className="h-11 px-3 bg-[#0A0E17] text-white text-body-sm rounded-xl border border-[#1E293B] outline-none focus:border-[#59BBAF]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5 text-right">
              <label className="text-body-sm font-bold text-white">تفکیک جنسیتی</label>
              <select
                value={createForm.targetGender}
                onChange={(e) => setCreateForm({ ...createForm, targetGender: e.target.value })}
                className="h-11 px-3 bg-[#0A0E17] text-white text-body-sm rounded-xl border border-[#1E293B] outline-none focus:border-[#59BBAF]"
              >
                <option value="mixed">عمومی / مختلط</option>
                <option value="boys">ویژه پسران</option>
                <option value="girls">ویژه دختران</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="مبلغ ورودی (تومان)"
              type="number"
              value={createForm.price}
              onChange={(e) => setCreateForm({ ...createForm, price: Number(e.target.value) })}
              required
            />
            <Input
              label="ظرفیت صندلی‌ها"
              type="number"
              value={createForm.capacity}
              onChange={(e) => setCreateForm({ ...createForm, capacity: Number(e.target.value) })}
              required
            />
          </div>

          <Input
            label="نشانی محل برگزاری در مشهد"
            value={createForm.venueAddress}
            onChange={(e) => setCreateForm({ ...createForm, venueAddress: e.target.value })}
            required
          />

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="md" type="button" onClick={() => setIsCreateOpen(false)}>
              انصراف
            </Button>
            <Button variant="primary" size="md" type="submit">
              ایجاد و انتشار میز
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
