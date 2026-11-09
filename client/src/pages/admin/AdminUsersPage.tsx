import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { User } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { RokadBadge } from '../../components/ui/Badge';
import { formatTomans, toPersianDigits, formatShamsiDate } from '../../utils/formatters';
import { Users, Search, Plus, Shield, ShieldCheck, Ban, CheckCircle } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [createForm, setCreateForm] = useState({
    username: '',
    email: '',
    displayName: '',
    password: 'password123',
    gender: 'boy',
    role: 'user',
    membership: 'EXTERNAL',
    godGameAllowed: false,
    walletBalance: 0,
  });

  const fetchUsers = async () => {
    try {
      const data = await api.getAdminUsers(search);
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const handleToggleGodGame = async (user: User) => {
    await api.updateAdminUser(user.id, { godGameAllowed: !user.godGameAllowed });
    fetchUsers();
  };

  const handleToggleMembership = async (user: User) => {
    const next = user.membership === 'ROKAD' ? 'EXTERNAL' : 'ROKAD';
    await api.updateAdminUser(user.id, { membership: next });
    fetchUsers();
  };

  const handleToggleSuspend = async (user: User) => {
    await api.updateAdminUser(user.id, { isSuspended: !user.isSuspended });
    fetchUsers();
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createAdminUser(createForm);
      setIsCreateOpen(false);
      fetchUsers();
    } catch (err: any) {
      alert(err.message || 'خطا در ساخت کاربر');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h1 font-black text-ui-text-primary">مدیریت کاربران و دسترسی‌ها</h1>
          <p className="text-body-sm text-ui-text-secondary">
            کنترل مجوز خدای بازی، نشان رسمی رکاد، وضعیت تعلیق و ایجاد کاربر جدید.
          </p>
        </div>

        <Button variant="persona" size="md" onClick={() => setIsCreateOpen(true)}>
          <Plus size={18} />
          <span>ایجاد کاربر جدید</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-ui-surface rounded-2xl border-1.5 border-ui-border-default shadow-hard-xs">
        <div className="relative w-full sm:w-80">
          <Search size={18} className="absolute right-3.5 top-3 text-ui-text-muted" />
          <input
            type="text"
            placeholder="جستجوی نام، نام کاربری یا ایمیل..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pr-10 pl-4 bg-ui-surface-sunken text-body-sm rounded-xl border border-ui-border-default outline-none text-ui-text-primary"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-ui-surface rounded-3xl border-1.5 border-ui-border-default shadow-hard-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b-1.5 border-ui-border-subtle bg-ui-surface-sunken/60 text-caption font-black text-ui-text-muted">
                <th className="py-3.5 px-6">کاربر</th>
                <th className="py-3.5 px-6 text-center">عضویت رکاد</th>
                <th className="py-3.5 px-6 text-center">مجوز خدای بازی</th>
                <th className="py-3.5 px-6 text-center">نقش</th>
                <th className="py-3.5 px-6 text-center">موجودی کیف</th>
                <th className="py-3.5 px-6 text-left">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y-1.5 divide-ui-border-subtle text-body-sm">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-ui-surface-sunken transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[var(--theme-primary)] text-white font-bold flex items-center justify-center text-body-sm">
                        {u.displayName.slice(0, 1)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-ui-text-primary">{u.displayName}</span>
                        <span className="text-caption text-ui-text-muted dir-ltr text-right">@{u.username}</span>
                      </div>
                    </div>
                  </td>

                  {/* Membership Toggle */}
                  <td className="py-4 px-6 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleMembership(u)}
                      className={`px-2.5 py-1 rounded-full text-caption font-bold border cursor-pointer ${
                        u.membership === 'ROKAD'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-400'
                          : 'bg-gray-100 text-gray-600 border-gray-300'
                      }`}
                      title="کلیک جهت تغییر وضعیت"
                    >
                      {u.membership === 'ROKAD' ? 'رُکادی' : 'خارج از رکاد'}
                    </button>
                  </td>

                  {/* God Game Allowed Toggle */}
                  <td className="py-4 px-6 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleGodGame(u)}
                      className={`px-2.5 py-1 rounded-full text-caption font-bold border cursor-pointer ${
                        u.godGameAllowed
                          ? 'bg-blue-50 text-blue-700 border-blue-400'
                          : 'bg-gray-100 text-gray-500 border-gray-300'
                      }`}
                      title="کلیک جهت اعطا یا لغو مجوز"
                    >
                      {u.godGameAllowed ? 'مجاز' : 'غیرمجاز'}
                    </button>
                  </td>

                  {/* Role */}
                  <td className="py-4 px-6 text-center font-bold">
                    <span className="px-2 py-0.5 rounded bg-ui-surface-sunken border border-ui-border-default text-caption">
                      {u.role === 'admin' ? 'مدیر کل' : 'کاربر عادی'}
                    </span>
                  </td>

                  {/* Wallet Balance */}
                  <td className="py-4 px-6 text-center font-bold text-emerald-600">
                    {formatTomans(u.walletBalance)}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-left">
                    <button
                      type="button"
                      onClick={() => handleToggleSuspend(u)}
                      className={`px-3 py-1 rounded-xl text-caption font-bold border transition-colors cursor-pointer ${
                        u.isSuspended
                          ? 'bg-red-600 text-white border-red-800'
                          : 'bg-ui-surface-sunken text-ui-text-muted hover:text-semantic-danger border-ui-border-default'
                      }`}
                    >
                      {u.isSuspended ? 'حساب مسدود' : 'تعلیق'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE USER MODAL */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="ایجاد کاربر جدید"
        maxWidth="md"
      >
        <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
          <Input
            label="نام و نام خانوادگی"
            value={createForm.displayName}
            onChange={(e) => setCreateForm({ ...createForm, displayName: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="نام کاربری"
              value={createForm.username}
              onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
              required
            />
            <Input
              label="ایمیل"
              type="email"
              value={createForm.email}
              onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="رمز عبور اولیه"
              value={createForm.password}
              onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
              required
            />
            <Input
              label="موجودی اولیه کیف (تومان)"
              type="number"
              value={createForm.walletBalance}
              onChange={(e) => setCreateForm({ ...createForm, walletBalance: Number(e.target.value) })}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t-1.5 border-ui-border-subtle">
            <Button variant="ghost" size="md" type="button" onClick={() => setIsCreateOpen(false)}>
              انصراف
            </Button>
            <Button variant="persona" size="md" type="submit">
              ثبت کاربر
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
