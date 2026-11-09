import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { User } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { formatTomans, toPersianDigits } from '../../utils/formatters';
import { Wallet, ArrowDownLeft, ArrowUpRight, ShieldAlert } from 'lucide-react';

export const AdminWalletPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [amount, setAmount] = useState<string>('50000');
  const [reason, setReason] = useState('');
  const [isCredit, setIsCredit] = useState(true);
  const [loading, setLoading] = useState(false);

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
    try {
      const finalAmount = isCredit ? amt : -amt;
      await api.adminAdjustWallet({
        userId: selectedUserId,
        amount: finalAmount,
        reason: reason.trim(),
      });
      alert('تعدیل موجودی با موفقیت اعمال و در لاگ حسابرسی ثبت شد.');
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
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-h1 font-black text-ui-text-primary">تعدیل کیف پول و حسابرسی مالی</h1>
        <p className="text-body-sm text-ui-text-secondary">
          افزایش یا کسر موجودی کاربران با ثبت دلیل در لاگ‌های حسابرسی سامانه.
        </p>
      </div>

      <div className="bg-ui-surface rounded-3xl border-1.5 border-ui-border-default shadow-hard-md p-6 sm:p-8 flex flex-col gap-6">
        <form onSubmit={handleAdjust} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 text-right">
            <label className="text-body-sm font-bold text-ui-text-primary">انتخاب کاربر</label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="h-11 px-3 bg-ui-surface text-ui-text-primary text-body-sm rounded-xl border border-ui-border-default outline-none"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.displayName} (@{u.username}) — موجودی: {formatTomans(u.walletBalance)}
                </option>
              ))}
            </select>
          </div>

          {selectedUser && (
            <div className="p-3 bg-ui-surface-sunken rounded-xl border border-ui-border-default flex items-center justify-between text-body-sm font-bold">
              <span className="text-ui-text-muted">موجودی فعلی کاربر:</span>
              <span className="text-emerald-600">{formatTomans(selectedUser.walletBalance)}</span>
            </div>
          )}

          {/* Type: Credit or Debit */}
          <div className="flex flex-col gap-1.5 text-right">
            <label className="text-body-sm font-bold text-ui-text-primary">نوع عملیات تعدیل</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsCredit(true)}
                className={`h-11 rounded-xl font-bold text-body-sm border-1.5 flex items-center justify-center gap-2 cursor-pointer ${
                  isCredit
                    ? 'bg-emerald-600 text-white border-emerald-900 shadow-hard-xs'
                    : 'bg-ui-surface-sunken text-ui-text-secondary border-ui-border-default'
                }`}
              >
                <ArrowDownLeft size={16} />
                <span>افزایش موجودی (بستانکار)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCredit(false)}
                className={`h-11 rounded-xl font-bold text-body-sm border-1.5 flex items-center justify-center gap-2 cursor-pointer ${
                  !isCredit
                    ? 'bg-red-600 text-white border-red-900 shadow-hard-xs'
                    : 'bg-ui-surface-sunken text-ui-text-secondary border-ui-border-default'
                }`}
              >
                <ArrowUpRight size={16} />
                <span>کسر موجودی (بدهکار)</span>
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
            placeholder="مثال: جایزه نفر اول تورنمنت کاپو / تصحیح مغایرت واریز"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />

          <Button variant="persona" size="lg" type="submit" isLoading={loading} className="mt-2">
            ثبت تعدیل مالی و درج در لاگ
          </Button>
        </form>
      </div>
    </div>
  );
};
