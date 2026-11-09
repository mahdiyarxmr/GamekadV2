import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { WalletTransaction } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { formatTomans, formatShamsiDate, toPersianDigits } from '../utils/formatters';
import confetti from 'canvas-confetti';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowRight,
  Zap,
} from 'lucide-react';

export const WalletPage: React.FC = () => {
  const { user, refreshMe } = useAuth();
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [customAmount, setCustomAmount] = useState<string>('100000');
  const [isSandboxModalOpen, setIsSandboxModalOpen] = useState(false);
  const [sandboxTrackingCode, setSandboxTrackingCode] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchWallet = async () => {
    try {
      const data = await api.getMyWallet();
      setTransactions(data.transactions || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const handleStartDeposit = async () => {
    const amt = Number(customAmount);
    if (isNaN(amt) || amt < 1000 || amt > 20000000) {
      alert('مبلغ باید بین ۱٬۰۰۰ تا ۲۰٬۰۰۰٬۰۰۰ تومان باشد.');
      return;
    }

    try {
      const res = await api.createDepositIntent(amt);
      setSandboxTrackingCode(res.trackingCode);
      setIsSandboxModalOpen(true);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleStartZarinpal = async () => {
    const amt = Number(customAmount);
    if (isNaN(amt) || amt < 1000 || amt > 20000000) {
      alert('مبلغ باید بین ۱٬۰۰۰ تا ۲۰٬۰۰۰٬۰۰۰ تومان باشد.');
      return;
    }

    setProcessing(true);
    try {
      const res = await api.requestZarinpal(amt);
      if (res.paymentUrl) {
        window.location.href = res.paymentUrl;
      }
    } catch (err: any) {
      alert(err.message || 'خطا در اتصال به درگاه زرین‌پال سندباکس');
    } finally {
      setProcessing(false);
    }
  };

  const handleConfirmSandbox = async () => {
    setProcessing(true);
    try {
      await api.verifySandboxDeposit({
        trackingCode: sandboxTrackingCode,
        amount: Number(customAmount),
      });

      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      await refreshMe();
      await fetchWallet();
      setIsSandboxModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'خطا در شارژ حساب');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8 py-4 sm:py-6 max-w-4xl mx-auto">
      {/* Back button */}
      <div>
        <Link to="/account" className="inline-flex items-center gap-1.5 text-body-sm font-bold text-[#64748B] hover:text-[#59BBAF] transition-colors">
          <ArrowRight size={16} />
          <span>بازگشت به حساب کاربری من</span>
        </Link>
      </div>

      {/* Balance Card */}
      <div className="bg-[#0E1420] rounded-3xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-950/40 text-emerald-400 border-1.5 border-emerald-500/40 flex items-center justify-center shrink-0">
            <Wallet size={32} />
          </div>
          <div className="flex flex-col text-right">
            <span className="text-body-sm font-bold text-[#64748B]">موجودی در دسترس کیف پول:</span>
            <span className="text-3xl sm:text-5xl font-black text-white">
              {formatTomans(user?.walletBalance || 0)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-caption text-[#64748B] bg-[#0A0E17] px-3.5 py-2 rounded-xl border border-[#1E293B]">
          <ShieldCheck size={18} className="text-[#59BBAF]" />
          <span>مبالغ به تومان، آنی و امن برای رزرو صندلی</span>
        </div>
      </div>

      {/* Deposit Action Card */}
      <div className="bg-[#0E1420] rounded-3xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] p-6 sm:p-8 flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Zap size={22} className="text-[#59BBAF]" />
          <h2 className="text-h2 font-black text-white">افزایش موجودی و شارژ کیف پول</h2>
        </div>

        {/* Preset Amounts */}
        <div className="flex flex-col gap-2">
          <span className="text-caption font-bold text-[#64748B]">مبالغ پیشنهادی:</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[50000, 100000, 200000, 500000].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setCustomAmount(amt.toString())}
                className={`py-3 px-4 rounded-xl text-body-sm font-black border transition-all cursor-pointer btn-tactile ${
                  customAmount === amt.toString()
                    ? 'bg-[#59BBAF] text-[#080B11] border-black shadow-[1.5px_1.5px_0_#000000]'
                    : 'bg-[#0A0E17] text-[#94A3B8] border-[#1E293B] hover:text-white'
                }`}
              >
                {formatTomans(amt)}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Amount Form */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4 pt-2">
          <div className="flex-1">
            <label className="text-caption font-bold text-[#64748B] block mb-1">
              مبلغ دلخواه شارژ (تومان):
            </label>
            <Input
              type="number"
              min="10000"
              max="20000000"
              step="10000"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="مثلا 150000"
              className="text-title font-black"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={handleStartZarinpal}
              isLoading={processing}
              className="gap-2 flex-1"
            >
              <CreditCard size={18} />
              <span>پرداخت با زرین‌پال سندباکس ({formatTomans(Number(customAmount) || 0)})</span>
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={handleStartDeposit}
              className="gap-2"
              title="تست مستقیم بدون خروج از سایت"
            >
              <span>شبیه‌ساز مستقیم</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Transactions History */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Clock size={20} className="text-[#59BBAF]" />
          <h2 className="text-h2 font-black text-white">تاریخچه تراکنش‌های کیف پول</h2>
        </div>

        <div className="bg-[#0E1420] rounded-3xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-[#64748B] font-bold">در حال بارگذاری تراکنش‌ها...</div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center text-[#64748B] font-bold">
              تراکنشی در حساب شما ثبت نشده است.
            </div>
          ) : (
            <div className="divide-y border-[#1E293B]">
              {transactions.map((tx) => (
                <div key={tx.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-[#141C2C] transition-colors">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                        tx.amount >= 0
                          ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                          : 'bg-red-950/40 text-red-400 border-red-500/30'
                      }`}
                    >
                      {tx.amount >= 0 ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                    </div>

                    <div className="flex flex-col text-right">
                      <span className="text-body-sm font-bold text-white">{tx.description}</span>
                      <span className="text-[11px] text-[#64748B] font-mono dir-ltr text-right">
                        کد رهگیری: {tx.referenceCode}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span
                      className={`text-body sm:text-title font-black ${
                        tx.amount >= 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {tx.amount >= 0 ? '+' : ''}
                      {formatTomans(tx.amount)}
                    </span>
                    <span className="text-[11px] text-[#64748B]">{formatShamsiDate(tx.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sandbox Simulator Modal */}
      <Modal
        isOpen={isSandboxModalOpen}
        onClose={() => setIsSandboxModalOpen(false)}
        title="شبیه‌ساز درگاه بانکی شاپرک (Sandbox)"
        maxWidth="md"
      >
        <div className="flex flex-col gap-5 py-2 text-right">
          <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl flex items-center justify-between">
            <span className="text-caption font-bold text-[#94A3B8]">مبلغ تراکنش:</span>
            <span className="text-title font-black text-emerald-400">{formatTomans(Number(customAmount) || 0)}</span>
          </div>

          <div className="flex flex-col gap-2 p-3 bg-[#0A0E17] rounded-xl border border-[#1E293B] text-caption text-[#64748B]">
            <div>• پذیرنده: باشگاه بازی و رویداد گیم‌کاد رُکاد</div>
            <div>• شماره پیگیری پرداخت: {sandboxTrackingCode}</div>
            <div>• این درگاه یک شبیه‌ساز امن تستی برای محیط ارزیابی است.</div>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-[#1E293B]">
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsSandboxModalOpen(false)}
              className="flex-1"
            >
              انصراف از پرداخت
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleConfirmSandbox}
              isLoading={processing}
              className="flex-1"
            >
              تأیید پرداخت تستی
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
