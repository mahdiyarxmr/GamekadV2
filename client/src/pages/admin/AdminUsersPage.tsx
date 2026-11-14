import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { User } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { RokadBadge } from '../../components/ui/Badge';
import { formatTomans, toPersianDigits, formatShamsiDate } from '../../utils/formatters';
import { Users, Search, Plus, Shield, ShieldCheck, Ban, CheckCircle, Wallet } from 'lucide-react';

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
    <div className="flex flex-col gap-5 sm:gap-6 w-full max-w-full overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">مدیریت کاربران و دسترسی‌ها</h1>
          <p className="text-body-sm text-[#94A3B8]">
            کنترل دسترسی خدای بازی، نشان رسمی رکاد، وضعیت تعلیق و مدیریت کاربران کلاب.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsCreateOpen(true)}
          className="w-full sm:w-auto justify-center"
        >
          <Plus size={18} />
          <span>ایجاد کاربر جدید</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="p-3.5 sm:p-4 bg-[#0E1420] rounded-2xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000]">
        <div className="relative w-full sm:w-80">
          <Search size={18} className="absolute right-3.5 top-3 text-[#64748B]" />
          <input
            type="text"
            placeholder="جستجوی نام، نام کاربری یا ایمیل..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pr-10 pl-4 bg-[#0A0E17] text-body-sm rounded-xl border border-[#1E293B] outline-none focus:border-[#59BBAF] text-white placeholder-[#64748B]"
          />
        </div>
      </div>

      {/* MOBILE CARD VIEW: Shown on screens smaller than md */}
      <div className="flex flex-col gap-3.5 md:hidden">
        {users.map((u) => (
          <div
            key={u.id}
            className="p-4 bg-[#0E1420] rounded-2xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] flex flex-col gap-3.5"
          >
            {/* Top row: Avatar & Identity */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={u.avatar || '/profiles/Boy.png'}
                  alt={u.displayName}
                  className="w-11 h-11 rounded-full object-cover border border-[#1E293B] shrink-0"
                />
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-body-sm text-white truncate">
                      {u.displayName}
                    </span>
                    <RokadBadge membership={u.membership} size="xs" />
                  </div>
                  <span className="text-[11px] text-[#64748B] truncate">
                    @{u.username} • {u.email}
                  </span>
                </div>
              </div>

              {/* Role Chip */}
              <span
                className={`text-[11px] font-black px-2 py-0.5 rounded-full shrink-0 border ${
                  u.role === 'admin'
                    ? 'bg-amber-950/60 text-amber-400 border-amber-500/40'
                    : 'bg-[#141C2C] text-[#94A3B8] border-[#1E293B]'
                }`}
              >
                {u.role === 'admin' ? 'مدیر کل' : 'کاربر'}
              </span>
            </div>

            {/* Wallet Row */}
            <div className="p-2.5 bg-[#0A0E17] rounded-xl border border-[#1E293B] flex items-center justify-between text-caption font-bold">
              <span className="text-[#64748B] flex items-center gap-1">
                <Wallet size={14} className="text-[#59BBAF]" />
                موجودی کیف پول:
              </span>
              <span className="text-[#59BBAF] font-black">{formatTomans(u.walletBalance || 0)}</span>
            </div>

            {/* 3 Mobile Action Toggle Pills */}
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {/* God Game Toggle */}
              <button
                type="button"
                onClick={() => handleToggleGodGame(u)}
                className={`h-10 px-2 rounded-xl text-[11px] font-black flex flex-col items-center justify-center gap-0.5 border transition-all ${
                  u.godGameAllowed
                    ? 'bg-blue-950/60 text-blue-400 border-blue-500/50 shadow-sm'
                    : 'bg-[#0A0E17] text-[#64748B] border-[#1E293B]'
                }`}
              >
                <Shield size={14} />
                <span>{u.godGameAllowed ? 'گاد: فعال' : 'گاد: غیرفعال'}</span>
              </button>

              {/* Rokad Membership Toggle */}
              <button
                type="button"
                onClick={() => handleToggleMembership(u)}
                className={`h-10 px-2 rounded-xl text-[11px] font-black flex flex-col items-center justify-center gap-0.5 border transition-all ${
                  u.membership === 'ROKAD'
                    ? 'bg-[#59BBAF]/20 text-[#59BBAF] border-[#59BBAF]/50 shadow-sm'
                    : 'bg-[#0A0E17] text-[#64748B] border-[#1E293B]'
                }`}
              >
                <ShieldCheck size={14} />
                <span>{u.membership === 'ROKAD' ? 'رُکادی' : 'عضو آزاد'}</span>
              </button>

              {/* Suspend Status Toggle */}
              <button
                type="button"
                onClick={() => handleToggleSuspend(u)}
                className={`h-10 px-2 rounded-xl text-[11px] font-black flex flex-col items-center justify-center gap-0.5 border transition-all ${
                  u.isSuspended
                    ? 'bg-red-950/60 text-red-400 border-red-500/50 shadow-sm'
                    : 'bg-emerald-950/50 text-emerald-400 border-emerald-500/40'
                }`}
              >
                {u.isSuspended ? <Ban size={14} /> : <CheckCircle size={14} />}
                <span>{u.isSuspended ? 'مسدود' : 'فعال'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE VIEW: Shown on md and larger */}
      <div className="hidden md:block bg-[#0E1420] rounded-3xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-[#1E293B] bg-[#0A0E17] text-caption font-black text-[#64748B]">
                <th className="py-3.5 px-5">کاربر</th>
                <th className="py-3.5 px-5">نقش</th>
                <th className="py-3.5 px-5">نشان رُکاد</th>
                <th className="py-3.5 px-5 text-center">مجوز خدای بازی</th>
                <th className="py-3.5 px-5 text-center">موجودی</th>
                <th className="py-3.5 px-5 text-center">وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B] text-body-sm">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[#141C2C] transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={u.avatar || '/profiles/Boy.png'}
                        alt={u.displayName}
                        className="w-9 h-9 rounded-full object-cover border border-[#1E293B]"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-white">{u.displayName}</span>
                        <span className="text-[11px] text-[#64748B]">@{u.username}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-5">
                    <span
                      className={`text-caption font-bold px-2 py-0.5 rounded border ${
                        u.role === 'admin'
                          ? 'bg-amber-950/60 text-amber-400 border-amber-500/40'
                          : 'bg-[#141C2C] text-[#94A3B8] border-[#1E293B]'
                      }`}
                    >
                      {u.role === 'admin' ? 'مدیر کل' : 'کاربر'}
                    </span>
                  </td>

                  <td className="py-4 px-5">
                    <button
                      type="button"
                      onClick={() => handleToggleMembership(u)}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      {u.membership === 'ROKAD' ? (
                        <RokadBadge membership="ROKAD" size="sm" />
                      ) : (
                        <span className="text-caption text-[#64748B] hover:text-[#59BBAF]">
                          + تبدیل به رُکادی
                        </span>
                      )}
                    </button>
                  </td>

                  <td className="py-4 px-5 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleGodGame(u)}
                      className={`px-3 py-1 rounded-xl text-caption font-bold border transition-colors cursor-pointer ${
                        u.godGameAllowed
                          ? 'bg-blue-950/60 text-blue-400 border-blue-500/50'
                          : 'bg-[#141C2C] text-[#64748B] border-[#1E293B]'
                      }`}
                    >
                      {u.godGameAllowed ? 'مجوز فعال' : 'غیرفعال'}
                    </button>
                  </td>

                  <td className="py-4 px-5 text-center font-black text-[#59BBAF]">
                    {formatTomans(u.walletBalance || 0)}
                  </td>

                  <td className="py-4 px-5 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleSuspend(u)}
                      className={`px-3 py-1 rounded-xl text-caption font-bold border transition-colors cursor-pointer ${
                        u.isSuspended
                          ? 'bg-red-950/60 text-red-400 border-red-500/50'
                          : 'bg-emerald-950/50 text-emerald-400 border-emerald-500/40'
                      }`}
                    >
                      {u.isSuspended ? 'مسدود شده' : 'فعال'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="ایجاد کاربر جدید در سیستم"
        maxWidth="md"
      >
        <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
          <Input
            label="نام و نام خانوادگی"
            placeholder="مثال: کیان بهرامی"
            value={createForm.displayName}
            onChange={(e) => setCreateForm({ ...createForm, displayName: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="نام کاربری (لاتین)"
              placeholder="kian_b"
              value={createForm.username}
              onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
              required
            />
            <Input
              label="آدرس ایمیل"
              type="email"
              placeholder="kian@example.com"
              value={createForm.email}
              onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
              required
            />
          </div>

          <Input
            label="رمز عبور اولیه"
            type="password"
            value={createForm.password}
            onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5 text-right">
              <label className="text-body-sm font-bold text-white">جنسیت</label>
              <select
                value={createForm.gender}
                onChange={(e) => setCreateForm({ ...createForm, gender: e.target.value })}
                className="h-11 px-3 bg-[#0A0E17] text-white text-body-sm rounded-xl border border-[#1E293B] outline-none focus:border-[#59BBAF]"
              >
                <option value="boy">پسر (آقا)</option>
                <option value="girl">دختر (خانم)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 text-right">
              <label className="text-body-sm font-bold text-white">سطح دسترسی</label>
              <select
                value={createForm.role}
                onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                className="h-11 px-3 bg-[#0A0E17] text-white text-body-sm rounded-xl border border-[#1E293B] outline-none focus:border-[#59BBAF]"
              >
                <option value="user">کاربر عادی</option>
                <option value="admin">مدیر سیستم</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="md" type="button" onClick={() => setIsCreateOpen(false)}>
              انصراف
            </Button>
            <Button variant="primary" size="md" type="submit">
              ایجاد کاربر
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
