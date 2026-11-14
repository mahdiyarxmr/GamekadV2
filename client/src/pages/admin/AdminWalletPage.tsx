import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { User } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { formatTomans, toPersianDigits } from '../../utils/formatters';
import { Wallet, ArrowDownLeft, ArrowUpRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const AdminWalletPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [amount, setAmount] = useState<string>('50000');
  const [reason, setReason] = useState('');
  const [isCredit, setIsCredit] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    api.getAdminUsers().then((res) => {
      setUsers(res);
      if (res.length > 0) setSelectedUserId(res[0].id);
    });
  }, []);

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(amount);
    if (isNaN(amt) || amt <= 0) {
      alert('مبلغ نامعتبر است.');
      return;
    }
    if (!reason.trim()) {
      alert('درج دلیل تعدیل برای ثبت در لاگ حسابرسی الزامی است.');
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const finalAmount = isCredit ? amt : -amt;
      await api.adminAdjustWallet({
        userId: selectedUserId,
        amount: finalAmount,
        reason: reason.trim(),
      });
      setMessage('تعدیل موجودی با موفقیت اعمال شد.');
      setReason('');
      const updatedUsers = await api.getAdminUsers();
      setUsers(updatedUsers);
    } catch (err: any) {
      alert(err.message || 'خطا در تعدیل کیف پول');
    } finally {
      setLoading(false);
    }
  };

  const selectedUser = users.find((u) => u.id === selectedUserId);

  return (
    <div className="flex flex-col gap-5 sm:gap-6 max-w-2xl w-full">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white">تعدیل کیف پول و حسابرسی مالی</h1>
        <p className="text-body-sm text-[#94A3B8]">
          افزایش یا کسر موجودی کاربران با ثبت دلیل در لاگ‌های حسابرسی رسمی سامانه.
        </p>
      </div>

      <div className="bg-[#0E1420] rounded-2xl sm:rounded-3xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] p-4 sm:p-7 flex flex-col gap-5">
        {message && (
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-caption font-bold text-emerald-300 flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleAdjust} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 text-right">
            <label className="text-body-sm font-bold text-white">انتخاب کاربر</label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="h-11 px-3 bg-[#0A0E17] text-white text-body-sm rounded-xl border border-[#1E293B] outline-none focus:border-[#59BBAF]"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.displayName} (@{u.username}) — موجودی: {formatTomans(u.walletBalance || 0)}
                </option>
              ))}
            </select>
          </div>

          {selectedUser && (
            <div className="p-3 bg-[#0A0E17] rounded-xl border border-[#1E293B] flex items-center justify-between text-body-sm font-bold">
              <span className="text-[#64748B]">موجودی فعلی کاربر:</span>
              <span className="text-[#59BBAF] font-black">{formatTomans(selectedUser.walletBalance || 0)}</span>
            </div>
          )}

          {/* Type: Credit or Debit */}
          <div className="flex flex-col gap-1.5 text-right">
            <label className="text-body-sm font-bold text-white">نوع عملیات تعدیل</label>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setIsCredit(true)}
                className={`h-11 rounded-xl font-black text-caption sm:text-body-sm border-1.5 flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isCredit
                    ? 'bg-emerald-500 text-black border-emerald-400 shadow-sm'
                    : 'bg-[#0A0E17] text-[#94A3B8] border-[#1E293B] hover:text-white'
                }`}
              >
                <ArrowDownLeft size={16} />
                <span>افزایش موجودی (واریز)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCredit(false)}
                className={`h-11 rounded-xl font-black text-caption sm:text-body-sm border-1.5 flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  !isCredit
                    ? 'bg-red-500 text-white border-red-400 shadow-sm'
                    : 'bg-[#0A0E17] text-[#94A3B8] border-[#1E293B] hover:text-white'
                }`}
              >
                <ArrowUpRight size={16} />
                <span>کسر موجودی (برداشت)</span>
              </button>
            </div>
          </div>

          <Input
            label="مبلغ تعدیل (تومان)"
            type="number"
            min="1000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <Input
            label="دلیل و شرح حسابرسی (اجباری)"
            placeholder="مثال: جایزه نفر اول تورنمنت / تصحیح مغایرت واریز کارت به کارت"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />

          <Button
            variant="primary"
            size="lg"
            type="submit"
            isLoading={loading}
            className="w-full mt-2 justify-center"
          >
            ثبت تعدیل مالی در سامانه
          </Button>
        </form>
      </div>
    </div>
  );
};
