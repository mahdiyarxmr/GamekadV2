import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { RokadBadge } from '../components/ui/Badge';
import { formatTomans, formatShamsiDate, toPersianDigits } from '../utils/formatters';
import {
  User,
  Wallet,
  Calendar,
  Crown,
  Shield,
  Edit3,
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Flame,
  Zap,
  Shuffle,
  Camera,
} from 'lucide-react';
import { OFFICIAL_AVATAR_PRESETS, getRandomAvatarPreset } from '../utils/avatars';

export const AccountPage: React.FC = () => {
  const { user, refreshMe } = useAuth();
  const navigate = useNavigate();

  const [myReservations, setMyReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: '',
    bio: '',
    avatar: '',
    gender: 'boy' as 'boy' | 'girl',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setEditForm({
      displayName: user.displayName,
      bio: user.bio || '',
      avatar: user.avatar || 'preset-1',
      gender: user.gender,
    });

    api
      .getMyReservations()
      .then((res) => setMyReservations(res))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  if (!user) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateMe(editForm);
      await refreshMe();
      setIsEditOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelReservation = async (resId: string) => {
    if (!confirm('آیا از لغو این رزرو صندلی اطمینان دارید؟ در صورت پرداخت آنلاین، وجه بلافاصله به کیف پول شما بازگردانده می‌شود.')) return;
    try {
      await api.cancelReservation(resId);
      const res = await api.getMyReservations();
      setMyReservations(res);
      await refreshMe();
    } catch (err: any) {
      alert(err.message || 'خطا در لغو رزرو');
    }
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8 py-4 sm:py-6 max-w-4xl mx-auto">
      {/* Profile Card (Centered Photo) */}
      <div className="bg-[#0E1420] rounded-3xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] p-6 sm:p-8 flex flex-col items-center text-center gap-4 relative overflow-hidden">
        {/* Top actions */}
        <div className="w-full flex items-center justify-between pb-4 border-b border-[#1E293B]">
          <Link
            to={`/players/${user.username}`}
            className="text-body-sm font-bold text-[#59BBAF] flex items-center gap-1.5 hover:underline"
          >
            <span>مشاهده کارت بازیکن در لابی</span>
            <ExternalLink size={16} />
          </Link>

          <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)} className="gap-1.5">
            <Edit3 size={14} />
            <span>ویرایش مشخصات</span>
          </Button>
        </div>

        {/* Big Centered Avatar */}
        <div className="w-24 sm:w-28 h-24 sm:h-28 rounded-3xl bg-[#59BBAF] text-[#080B11] font-black text-4xl flex items-center justify-center border-2 border-black shadow-[2px_2px_0_#000000] overflow-hidden my-1">
          {user.avatar ? (
            <img src={user.avatar} alt={user.displayName} className="w-full h-full object-cover" />
          ) : (
            user.displayName.slice(0, 1)
          )}
        </div>

        {/* Name and Badges */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white">{user.displayName}</h1>
            <RokadBadge membership={user.membership} size="md" />
          </div>
          <span className="text-body-sm font-mono text-[#64748B] dir-ltr">@{user.username}</span>
          <span className="text-caption font-bold text-[#94A3B8] mt-0.5">
            {user.gender === 'boy' ? 'آقا / پسر' : 'خانم / دختر'}
          </span>
        </div>

        {user.bio ? (
          <p className="text-body-sm text-[#94A3B8] max-w-lg leading-relaxed bg-[#0A0E17] p-3 sm:p-4 rounded-2xl border border-[#1E293B]">
            {user.bio}
          </p>
        ) : (
          <p className="text-caption text-[#64748B] italic">
            هنوز بیوگرافی گیمری ثبت نکرده‌اید. با کلیک بر روی دکمه ویرایش، سبک بازی خود را معرفی کنید.
          </p>
        )}

        {/* Shortcuts for God Game and Admin */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-[#1E293B] w-full">
          {(user.godGameAllowed || user.role === 'admin') && (
            <Link to="/host/god-game">
              <Button variant="primary" size="md" className="gap-2">
                <Shield size={18} />
                <span>میز خدای بازی (Game Master Live)</span>
              </Button>
            </Link>
          )}

          {user.role === 'admin' && (
            <Link to="/admin/dashboard">
              <Button variant="outline" size="md" className="gap-2">
                <Crown size={18} className="text-amber-400" />
                <span>ورود به پنل مدیریت کلاب</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Wallet Summary Card */}
      <div className="bg-[#0E1420] rounded-3xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-950/40 text-emerald-400 border-1.5 border-emerald-500/40 flex items-center justify-center shrink-0">
            <Wallet size={28} />
          </div>
          <div className="flex flex-col text-right">
            <span className="text-caption font-bold text-[#64748B]">موجودی در دسترس کیف پول:</span>
            <span className="text-2xl sm:text-3xl font-black text-white">
              {formatTomans(user.walletBalance)}
            </span>
          </div>
        </div>

        <Link to="/account/wallet">
          <Button variant="primary" size="md" className="gap-2">
            <Zap size={16} />
            <span>شارژ حساب و تاریخچه تراکنش‌ها</span>
          </Button>
        </Link>
      </div>

      {/* My Reservations Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-[#59BBAF]" />
            <h2 className="text-h2 font-black text-white">صندلی‌ها و رزروهای من</h2>
          </div>
          <Link to="/events" className="text-caption font-bold text-[#59BBAF] hover:underline">
            رزرو میز جدید
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-[#64748B] font-bold">در حال فراخوانی رزروها...</div>
        ) : myReservations.length === 0 ? (
          <div className="p-8 text-center bg-[#0E1420] rounded-2xl border-1.5 border-dashed border-[#1E293B] text-[#64748B] font-bold">
            هنوز صندلی روی هیچ میزی رزرو نکرده‌اید.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {myReservations.map((res: any) => (
              <div
                key={res.id}
                className="bg-[#0E1420] rounded-2xl border-1.5 border-[#1E293B] shadow-[1.5px_1.5px_0_#000000] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex flex-col gap-1.5 text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-title font-black text-white">
                      {res.event?.title || 'رویداد مافیا'}
                    </span>
                    <span
                      className={`text-[11px] font-black px-2 py-0.5 rounded-full border ${
                        res.paymentStatus === 'paid'
                          ? 'bg-emerald-950/50 text-emerald-400 border-emerald-500/40'
                          : res.paymentStatus === 'partially_paid'
                          ? 'bg-amber-950/50 text-amber-400 border-amber-500/40'
                          : res.paymentStatus === 'venue_due'
                          ? 'bg-blue-950/50 text-blue-400 border-blue-500/40'
                          : res.paymentStatus === 'refunded'
                          ? 'bg-gray-800 text-gray-400 border-gray-600'
                          : 'bg-red-950/50 text-red-400 border-red-500/40'
                      }`}
                    >
                      {res.paymentStatus === 'paid'
                        ? 'پرداخت کامل'
                        : res.paymentStatus === 'partially_paid'
                        ? 'پیش‌پرداخت شده'
                        : res.paymentStatus === 'venue_due'
                        ? 'تسویه حضوری در کلاب'
                        : res.paymentStatus === 'refunded'
                        ? 'مرجوع شده'
                        : 'لغو شده'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-caption text-[#64748B]">
                    <span className="flex items-center gap-1 text-white">
                      <Clock size={12} className="text-[#59BBAF]" />
                      <span>{formatShamsiDate(res.event?.startTime || res.createdAt)}</span>
                    </span>
                    <span>• {toPersianDigits(res.seats)} صندلی</span>
                    <span>• مبلغ: {formatTomans(res.totalAmount)}</span>
                    {res.attended && (
                      <span className="text-emerald-400 font-bold">• بر میز حاضر شده</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {res.status !== 'cancelled' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancelReservation(res.id)}
                      className="text-red-400 hover:border-red-500"
                    >
                      لغو رزرو صندلی
                    </Button>
                  )}
                  <Link to={`/events/${res.eventId}`}>
                    <Button variant="ghost" size="sm" className="text-[#59BBAF]">
                      مشاهده میز
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="ویرایش مشخصات گیمر"
        maxWidth="md"
      >
        <form onSubmit={handleSaveProfile} className="flex flex-col gap-4 text-right">
          <div>
            <label className="text-caption font-bold text-[#64748B] block mb-1">
              نام نمایشی در تالار و لیدربورد:
            </label>
            <Input
              value={editForm.displayName}
              onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="text-caption font-bold text-[#64748B] block mb-1">
              جنسیت (جهت دسته‌بندی میزهای مسابقه):
            </label>
            <div className="flex items-center gap-3">
              {[
                { id: 'boy', label: 'آقا / پسر' },
                { id: 'girl', label: 'خانم / دختر' },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setEditForm({ ...editForm, gender: g.id as any })}
                  className={`flex-1 py-2 rounded-xl text-caption font-black border transition-all cursor-pointer ${
                    editForm.gender === g.id
                      ? 'bg-[#59BBAF] text-[#080B11] border-black shadow-sm'
                      : 'bg-[#0A0E17] text-[#94A3B8] border-[#1E293B]'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-caption font-bold text-[#64748B] block mb-1">
              بیوگرافی و سبک بازی:
            </label>
            <textarea
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              rows={3}
              placeholder="علاقه‌مندی به سناریوهای مافیا، مهارت در بلوف‌خوانی یا بازی‌های کنسولی..."
              className="w-full p-3 bg-[#0A0E17] text-white rounded-xl border border-[#1E293B] text-body-sm outline-none focus:border-[#59BBAF]"
            />
          </div>

          {/* Avatar Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-caption font-bold text-[#64748B]">
                تصویر پروفایل کاربری:
              </label>
              <button
                type="button"
                onClick={() => setEditForm({ ...editForm, avatar: getRandomAvatarPreset() })}
                className="text-caption font-bold text-[#59BBAF] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Shuffle size={12} />
                <span>تصادفی</span>
              </button>
            </div>

            {/* Current Selected Preview */}
            <div className="flex items-center gap-3 p-3 bg-[#0A0E17] rounded-2xl border border-[#1E293B] mb-3">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#141C2C] border-2 border-[#59BBAF] shrink-0">
                <img src={editForm.avatar} alt="پیش‌نمایش" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <span className="text-caption text-[#64748B] block mb-1">یا آدرس مستقیم تصویر دلخواه:</span>
                <input
                  type="text"
                  placeholder="https://... یا /profiles/..."
                  value={editForm.avatar}
                  onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                  className="w-full h-8 px-2.5 bg-[#0E1420] text-caption rounded-lg border border-[#1E293B] text-white outline-none focus:border-[#59BBAF] font-mono dir-ltr text-left"
                />
              </div>
            </div>

            {/* Preset grid */}
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {OFFICIAL_AVATAR_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setEditForm({ ...editForm, avatar: p.url })}
                  className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                    editForm.avatar === p.url
                      ? 'border-[#59BBAF] ring-2 ring-[#59BBAF]/50 scale-105 shadow-[0_0_10px_rgba(89,187,175,0.4)]'
                      : 'border-[#1E293B] opacity-60 hover:opacity-100 hover:border-[#64748B]'
                  }`}
                  title={p.name}
                >
                  <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1E293B]">
            <Button variant="outline" size="md" type="button" onClick={() => setIsEditOpen(false)}>
              انصراف
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={saving}>
              ذخیره تغییرات
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
