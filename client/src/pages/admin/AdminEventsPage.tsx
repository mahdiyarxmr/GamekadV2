import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { EventItem, GameCategory } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { GenderBadge } from '../../components/ui/Badge';
import { formatTomans, formatShamsiDate, toPersianDigits } from '../../utils/formatters';
import { Calendar, Plus, Users, CheckCircle2, Clock } from 'lucide-react';

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
    venueAddress: 'مشهد، بلوار شهید فرامرز عباسی، رسالت ۳۲، بین ۴۵ و ۴۷، پلاک ۲۳',
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h1 font-black text-ui-text-primary">مدیریت رویدادها و میزهای بازی</h1>
          <p className="text-body-sm text-ui-text-secondary">
            تعریف میزهای جدید، مدیریت ظرفیت و ثبت حضور شرکت‌کنندگان.
          </p>
        </div>

        <Button variant="persona" size="md" onClick={() => setIsCreateOpen(true)}>
          <Plus size={18} />
          <span>تعریف نشست جدید</span>
        </Button>
      </div>

      {/* Events Table */}
      <div className="bg-ui-surface rounded-3xl border-1.5 border-ui-border-default shadow-hard-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b-1.5 border-ui-border-subtle bg-ui-surface-sunken/60 text-caption font-black text-ui-text-muted">
                <th className="py-3.5 px-6">عنوان میز</th>
                <th className="py-3.5 px-6">مخاطب</th>
                <th className="py-3.5 px-6 text-center">ظرفیت / رزرو</th>
                <th className="py-3.5 px-6 text-center">ورودی</th>
                <th className="py-3.5 px-6 text-left">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y-1.5 divide-ui-border-subtle text-body-sm">
              {events.map((evt) => (
                <tr key={evt.id} className="hover:bg-ui-surface-sunken transition-colors">
                  <td className="py-4 px-6 font-bold text-ui-text-primary">
                    <div className="flex flex-col">
                      <span>{evt.title}</span>
                      <span className="text-caption text-ui-text-muted">{evt.category?.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <GenderBadge targetGender={evt.targetGender} />
                  </td>
                  <td className="py-4 px-6 text-center font-bold">
                    <span className="text-emerald-600">{toPersianDigits(evt.reservedCount)}</span>
                    <span className="text-ui-text-muted"> / {toPersianDigits(evt.capacity)}</span>
                  </td>
                  <td className="py-4 px-6 text-center font-bold text-ui-text-primary">
                    {formatTomans(evt.price)}
                  </td>
                  <td className="py-4 px-6 text-left">
                    <Button variant="outline" size="sm" onClick={() => handleOpenAttendance(evt)}>
                      <Users size={14} />
                      <span>ثبت حضور ({toPersianDigits(evt.reservedCount)})</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE EVENT MODAL */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="تعریف میز / رویداد جدید"
        maxWidth="md"
      >
        <form onSubmit={handleCreateEvent} className="flex flex-col gap-4">
          <Input
            label="عنوان نشست"
            placeholder="مثال: شب‌های مافیا - سناریوی کاپو"
            value={createForm.title}
            onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
            required
          />

          <div className="flex flex-col gap-1.5 text-right">
            <label className="text-body-sm font-bold text-ui-text-primary">توضیحات کوتاه</label>
            <textarea
              rows={2}
              value={createForm.description}
              onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
              className="w-full p-3 bg-ui-surface-sunken text-body-sm rounded-xl border border-ui-border-default outline-none text-ui-text-primary"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 text-right">
              <label className="text-body-sm font-bold text-ui-text-primary">دسته بازی</label>
              <select
                value={createForm.categoryId}
                onChange={(e) => setCreateForm({ ...createForm, categoryId: e.target.value })}
                className="h-11 px-3 bg-ui-surface text-ui-text-primary text-body-sm rounded-xl border border-ui-border-default outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5 text-right">
              <label className="text-body-sm font-bold text-ui-text-primary">مخاطب</label>
              <select
                value={createForm.targetGender}
                onChange={(e) => setCreateForm({ ...createForm, targetGender: e.target.value as any })}
                className="h-11 px-3 bg-ui-surface text-ui-text-primary text-body-sm rounded-xl border border-ui-border-default outline-none"
              >
                <option value="boys">پسران</option>
                <option value="girls">دختران</option>
                <option value="mixed">مختلط</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="قیمت کامل (تومان)"
              type="number"
              value={createForm.price}
              onChange={(e) => setCreateForm({ ...createForm, price: Number(e.target.value) })}
              required
            />
            <Input
              label="پیش‌پرداخت (تومان)"
              type="number"
              value={createForm.depositAmount}
              onChange={(e) => setCreateForm({ ...createForm, depositAmount: Number(e.target.value) })}
            />
            <Input
              label="ظرفیت صندلی"
              type="number"
              value={createForm.capacity}
              onChange={(e) => setCreateForm({ ...createForm, capacity: Number(e.target.value) })}
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t-1.5 border-ui-border-subtle">
            <Button variant="ghost" size="md" type="button" onClick={() => setIsCreateOpen(false)}>
              انصراف
            </Button>
            <Button variant="persona" size="md" type="submit">
              ایجاد میز
            </Button>
          </div>
        </form>
      </Modal>

      {/* ATTENDANCE MODAL */}
      <Modal
        isOpen={isAttendanceOpen}
        onClose={() => setIsAttendanceOpen(false)}
        title={`ثبت حضور بازیکنان - ${selectedEventTitle}`}
        maxWidth="md"
      >
        <div className="flex flex-col gap-4 py-2">
          {selectedEventReservations.length === 0 ? (
            <p className="text-center text-ui-text-muted py-6">هنوز بازیکنی این میز را رزرو نکرده است.</p>
          ) : (
            <div className="divide-y divide-ui-border-subtle">
              {selectedEventReservations.map((r: any) => (
                <div key={r.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--theme-primary)] text-white font-bold flex items-center justify-center text-caption">
                      {r.userDisplayName?.slice(0, 1)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-body-sm text-ui-text-primary">{r.userDisplayName}</span>
                      <span className="text-caption text-ui-text-muted">{toPersianDigits(r.seats)} صندلی</span>
                    </div>
                  </div>

                  <Button
                    variant={r.attended ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleToggleAttendance(r.id)}
                  >
                    <CheckCircle2 size={16} />
                    <span>{r.attended ? 'حاضر شده' : 'ثبت حضور'}</span>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
