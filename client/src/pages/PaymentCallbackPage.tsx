import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { formatTomans, formatShamsiDate } from '../utils/formatters';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, Wallet, ArrowLeft, ShieldCheck, RefreshCw } from 'lucide-react';

export const PaymentCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshMe } = useAuth();

  const authority = searchParams.get('Authority') || searchParams.get('authority') || '';
  const status = searchParams.get('Status') || searchParams.get('status') || '';

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authority) {
      setError('شناسه پرداخت نامعتبر است.');
      setLoading(false);
      return;
    }

    if (status && status.toUpperCase() === 'NOK') {
      setError('پرداخت توسط کاربر در درگاه زرین‌پال لغو شد.');
      setLoading(false);
      return;
    }

    // Verify with backend
    api
      .verifyZarinpal({ authority, status })
      .then(async (res) => {
        setData(res);
        setSuccess(true);
        await refreshMe();
        confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
      })
      .catch((err) => {
        setError(err.message || 'خطا در اعتبارسنجی پرداخت زرین‌پال');
      })
      .finally(() => setLoading(false));
  }, [authority, status]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-lg bg-[#0E1420] rounded-3xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] p-6 sm:p-8 flex flex-col items-center text-center gap-6">
        {loading ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <RefreshCw size={40} className="text-[#59BBAF] animate-spin" />
            <h2 className="text-h2 font-black text-white">در حال استعلام نتیجه از زرین‌پال...</h2>
            <p className="text-body-sm text-[#94A3B8]">لطفاً چند لحظه شکیبا باشید.</p>
          </div>
        ) : success ? (
          <>
            <div className="w-20 h-20 rounded-3xl bg-[#59BBAF] text-[#080B11] border-2 border-black flex items-center justify-center shadow-[0_0_25px_rgba(89,187,175,0.4)]">
              <CheckCircle2 size={44} />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-caption font-black px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 w-fit mx-auto">
                زرین‌پال سندباکس (ZarinPal Sandbox)
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white">تراکنش با موفقیت تأیید شد</h1>
              <p className="text-body-sm text-[#94A3B8]">
                مبلغ پرداختی بلافاصله به کیف پول شما در باشگاه گیم‌کاد افزوده شد.
              </p>
            </div>

            {/* Receipt Box */}
            <div className="w-full p-4 bg-[#0A0E17] rounded-2xl border border-[#1E293B] flex flex-col gap-2.5 text-body-sm">
              <div className="flex items-center justify-between text-[#94A3B8]">
                <span>مبلغ شارژ شده:</span>
                <span className="font-black text-[#59BBAF] text-title">{formatTomans(data?.amount || 0)}</span>
              </div>
              <div className="flex items-center justify-between text-[#94A3B8]">
                <span>کد رهگیری تراکنش:</span>
                <span className="font-mono text-white font-bold dir-ltr">{data?.refId}</span>
              </div>
              <div className="flex items-center justify-between text-[#94A3B8]">
                <span>موجودی جدید کیف پول:</span>
                <span className="font-black text-emerald-400">{formatTomans(data?.newBalance || 0)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-2">
              <Link to="/events" className="w-full">
                <Button variant="primary" size="md" className="w-full gap-2">
                  <Wallet size={16} />
                  <span>رزرو صندلی میزهای مسابقه</span>
                </Button>
              </Link>
              <Link to="/account/wallet" className="w-full">
                <Button variant="outline" size="md" className="w-full">
                  مشاهده کیف پول
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="w-20 h-20 rounded-3xl bg-red-950/60 text-red-400 border-2 border-red-500/50 flex items-center justify-center shadow-lg">
              <XCircle size={44} />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-caption font-black px-3 py-1 rounded-full bg-red-950/60 text-red-400 border border-red-500/30 w-fit mx-auto">
                پرداخت ناموفق
              </span>
              <h1 className="text-2xl font-black text-white">تراکنش نهایی نشد</h1>
              <p className="text-body-sm text-red-300">
                {error || 'فرآیند پرداخت با خطا مواجه شد یا توسط کاربر لغو گردید.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-2">
              <Link to="/account/wallet" className="w-full">
                <Button variant="primary" size="md" className="w-full">
                  تلاش مجدد در کیف پول
                </Button>
              </Link>
              <Link to="/" className="w-full">
                <Button variant="outline" size="md" className="w-full">
                  بازگشت به خانه
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
