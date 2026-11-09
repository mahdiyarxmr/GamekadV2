import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { EventItem } from '../types';
import { Button } from '../components/ui/Button';
import { GenderBadge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { formatTomans, formatShamsiDate, toPersianDigits } from '../utils/formatters';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Wallet,
  CreditCard,
  ArrowRight,
  Flame,
  Zap,
} from 'lucide-react';

export const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, refreshMe } = useAuth();

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [seats, setSeats] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    api
      .getEvent(id)
      .then((res) => setEvent(res))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="p-12 text-center text-[#64748B] font-bold">در حال بارگذاری اطلاعات میز مسابقه...</div>;
  }

  if (!event) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-h2 font-black text-white mb-4">میز مورد نظر یافت نشد.</h2>
        <Link to="/events">
          <Button variant="outline">بازگشت به فهرست میزها</Button>
        </Link>
      </div>
    );
  }

  // Calculate pricing
  const unitPrice = event.price;
  const totalPrice = unitPrice * seats;
  let onlineRequired = 0;
  let venueDue = 0;

  if (event.payType === 'venue' || totalPrice === 0) {
    onlineRequired = 0;
    venueDue = totalPrice;
  } else if (event.payType === 'deposit') {
    const unitDeposit = event.depositAmount > 0 ? event.depositAmount : Math.round(unitPrice * 0.3);
    onlineRequired = unitDeposit * seats;
    venueDue = totalPrice - onlineRequired;
  } else {
    onlineRequired = totalPrice;
    venueDue = 0;
  }

  const hasEnoughWallet = user ? user.walletBalance >= onlineRequired : false;

  // Gender check
  const isGenderMismatch =
    user &&
    ((event.targetGender === 'boys' && user.gender !== 'boy') ||
      (event.targetGender === 'girls' && user.gender !== 'girl'));

  const handleReserve = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (isGenderMismatch) {
      setError(`این میز اختصاصی ${event.targetGender === 'boys' ? 'پسران' : 'دختران'} است.`);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await api.createReservation({
        eventId: event.id,
        seats,
      });

      if (res.requiresSandbox) {
        await api.payReservationSandbox(res.reservation.id);
      }

      await refreshMe();
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      setSuccessData(res);
      const updated = await api.getEvent(event.id);
      setEvent(updated);
    } catch (err: any) {
      setError(err.message || 'خطا در ثبت رزرو.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8 py-4 sm:py-6 max-w-4xl mx-auto">
      {/* Back button */}
      <div>
        <Link to="/events" className="inline-flex items-center gap-1.5 text-body-sm font-bold text-[#64748B] hover:text-[#59BBAF] transition-colors">
          <ArrowRight size={16} />
          <span>بازگشت به لابی میزهای کلاب</span>
        </Link>
      </div>

      {/* Main Card */}
      <div className="bg-[#0E1420] rounded-3xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] overflow-hidden p-5 sm:p-8 flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#1E293B]">
          <div className="flex items-center gap-2">
            <GenderBadge targetGender={event.targetGender} />
            <span className="text-caption font-bold px-2.5 py-0.5 rounded-full bg-[#141C2C] border border-[#1E293B] text-[#59BBAF]">
              {event.category?.name || 'شب‌های مافیا'}
            </span>
          </div>

          <span className="text-body-sm font-black text-emerald-400 bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-500/40">
            {toPersianDigits(event.remainingSeats || 0)} صندلی خالی باقی‌مانده
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-2xl sm:text-4xl font-black text-white">{event.title}</h1>
          <p className="text-body-sm sm:text-body text-[#94A3B8] leading-relaxed">{event.description}</p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#0A0E17] rounded-2xl border border-[#1E293B]">
          <div className="flex items-center gap-3">
            <Clock size={20} className="text-[#59BBAF] shrink-0" />
            <div className="flex flex-col">
              <span className="text-caption text-[#64748B] font-bold">زمان شروع مسابقه:</span>
              <span className="text-body-sm font-bold text-white">{formatShamsiDate(event.startTime)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin size={20} className="text-[#59BBAF] shrink-0" />
            <div className="flex flex-col">
              <span className="text-caption text-[#64748B] font-bold">سالن باشگاه:</span>
              <span className="text-body-sm font-bold text-white">{event.venueAddress}</span>
            </div>
          </div>
        </div>

        {/* Host Info */}
        {event.host && (
          <div className="flex items-center gap-3 p-4 bg-[#141C2C] rounded-xl border border-[#1E293B]">
            <div className="w-10 h-10 rounded-xl bg-[#59BBAF] text-[#080B11] font-black flex items-center justify-center shadow-sm">
              {event.host.displayName.slice(0, 1)}
            </div>
            <div className="flex flex-col">
              <span className="text-caption text-[#64748B] font-bold">گرداننده و خدای بازی:</span>
              <span className="text-body-sm font-black text-white">{event.host.displayName}</span>
            </div>
          </div>
        )}

        {/* Reservation Box */}
        <div className="p-5 sm:p-6 bg-[#0A0E17] rounded-2xl border-1.5 border-[#59BBAF]/50 shadow-[0_0_20px_rgba(89,187,175,0.1)] flex flex-col gap-5">
          <h3 className="text-title font-black text-white flex items-center gap-2">
            <Zap size={18} className="text-[#59BBAF]" />
            <span>رزرو صندلی و تسویه آنلاین</span>
          </h3>

          {/* Seat count selector */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-body-sm font-bold text-[#94A3B8]">تعداد صندلی مورد نیاز:</span>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setSeats(n)}
                  className={`w-10 h-10 rounded-xl font-black text-body-sm border-1.5 transition-all btn-tactile cursor-pointer ${
                    seats === n
                      ? 'bg-[#59BBAF] text-[#080B11] border-black shadow-[1.5px_1.5px_0_#000000]'
                      : 'bg-[#0E1420] text-[#94A3B8] border-[#1E293B] hover:text-white hover:border-[#59BBAF]'
                  }`}
                >
                  {toPersianDigits(n)}
                </button>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="flex flex-col gap-2 pt-3 border-t border-[#1E293B] text-body-sm">
            <div className="flex items-center justify-between text-[#94A3B8]">
              <span>ورودی هر صندلی:</span>
              <span>{formatTomans(unitPrice)}</span>
            </div>
            <div className="flex items-center justify-between text-[#94A3B8]">
              <span>مبلغ کل ({toPersianDigits(seats)} صندلی):</span>
              <span className="font-bold text-white">{formatTomans(totalPrice)}</span>
            </div>
            <div className="flex items-center justify-between font-bold text-[#59BBAF]">
              <span>مبلغ قابل پرداخت آنلاین {event.payType === 'deposit' ? '(پیش‌پرداخت رزرو)' : ''}:</span>
              <span className="text-title font-black">{formatTomans(onlineRequired)}</span>
            </div>
            {venueDue > 0 && (
              <div className="flex items-center justify-between text-amber-400 font-bold">
                <span>باقی‌مانده قابل تسویه هنگام ورود به کلاب:</span>
                <span>{formatTomans(venueDue)}</span>
              </div>
            )}
          </div>

          {/* Wallet indicator */}
          {user && (
            <div className="p-3 rounded-xl bg-[#0E1420] border border-[#1E293B] flex items-center justify-between text-caption font-bold">
              <span className="flex items-center gap-1.5 text-[#64748B]">
                <Wallet size={16} className="text-[#59BBAF]" />
                <span>موجودی کیف پول شما:</span>
              </span>
              <span className="text-[#59BBAF] font-black">{formatTomans(user.walletBalance)}</span>
            </div>
          )}

          {/* Gender warning */}
          {isGenderMismatch && (
            <div className="p-3 bg-red-950/40 border-1.5 border-red-500 rounded-xl flex items-center gap-2 text-caption font-bold text-red-300">
              <AlertTriangle size={18} className="shrink-0" />
              <span>این میز اختصاصی {event.targetGender === 'boys' ? 'پسران' : 'دختران'} است و با جنسیت حساب شما تطابق ندارد.</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-950/40 border-1.5 border-red-500 rounded-xl text-caption font-bold text-red-300">
              {error}
            </div>
          )}

          {/* CTA Button */}
          {user ? (
            <Button
              variant="primary"
              size="lg"
              onClick={handleReserve}
              isLoading={submitting}
              disabled={isGenderMismatch || (event.remainingSeats || 0) < seats}
              className="w-full"
            >
              {hasEnoughWallet ? (
                <span className="flex items-center justify-center gap-2">
                  <Wallet size={18} />
                  <span>تأیید و پرداخت مستقیم از کیف پول ({formatTomans(onlineRequired)})</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <CreditCard size={18} />
                  <span>تأیید و پرداخت از درگاه زرین‌پال سندباکس ({formatTomans(onlineRequired)})</span>
                </span>
              )}
            </Button>
          ) : (
            <Link to="/login" className="w-full">
              <Button variant="primary" size="lg" className="w-full">
                ورود به حساب کاربری جهت رزرو صندلی
              </Button>
            </Link>
          )}
        </div>

        {/* Attended / Confirmed Participants */}
        {event.reservations && event.reservations.length > 0 && (
          <div className="flex flex-col gap-3 pt-5 border-t border-[#1E293B]">
            <h3 className="text-body-sm font-bold text-[#94A3B8]">بازیکنان حاضر روی این میز:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {event.reservations.map((r: any) => (
                <div key={r.id} className="p-2.5 bg-[#0A0E17] rounded-xl border border-[#1E293B] flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#59BBAF] text-[#080B11] font-black flex items-center justify-center text-caption shrink-0">
                    {r.userDisplayName.slice(0, 1)}
                  </div>
                  <div className="flex flex-col truncate text-right">
                    <span className="text-caption font-black text-white truncate">{r.userDisplayName}</span>
                    <span className="text-[11px] text-[#64748B]">
                      {toPersianDigits(r.seats)} صندلی {r.attended ? '• نشسته بر میز' : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={!!successData}
        onClose={() => setSuccessData(null)}
        title="صندلی شما رزرو شد!"
        maxWidth="sm"
      >
        <div className="flex flex-col items-center text-center gap-4 py-2">
          <div className="w-16 h-16 rounded-2xl bg-[#59BBAF] text-[#080B11] border-2 border-black flex items-center justify-center shadow-lg">
            <CheckCircle2 size={36} />
          </div>
          <h3 className="text-h2 font-black text-white">آماده نبرد باشید</h3>
          <p className="text-body-sm text-[#94A3B8] leading-relaxed">
            رزرو شما برای {toPersianDigits(seats)} صندلی در میز «{event.title}» با موفقیت نهایی شد. راس ساعت در سالن کلاب حاضر باشید.
          </p>
          <div className="flex items-center gap-2 w-full pt-2">
            <Link to="/account" className="w-full">
              <Button variant="primary" size="md" className="w-full">
                مشاهده در حساب من
              </Button>
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  );
};
