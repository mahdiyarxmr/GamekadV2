import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { User, Mail, Lock, Phone, Shuffle } from 'lucide-react';
import { toPersianDigits } from '../utils/formatters';
import { OFFICIAL_AVATAR_PRESETS, getRandomAvatarPreset } from '../utils/avatars';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    displayName: '',
    password: '',
    confirmPassword: '',
    gender: 'boy' as 'boy' | 'girl',
    phone: '',
    avatar: getRandomAvatarPreset(),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.username.length < 3) {
      setError('نام کاربری باید حداقل ۳ کاراکتر باشد.');
      return;
    }
    if (formData.password.length < 8) {
      setError('رمز عبور باید حداقل ۸ کاراکتر باشد.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('تکرار رمز عبور با رمز وارد شده مطابقت ندارد.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await register({
        username: formData.username,
        email: formData.email,
        displayName: formData.displayName,
        password: formData.password,
        gender: formData.gender,
        phone: formData.phone || undefined,
        avatar: formData.avatar,
      });
      navigate('/account');
    } catch (err: any) {
      setError(err.message || 'خطا در ثبت‌نام.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 sm:py-10 px-4">
      <div className="w-full max-w-lg bg-[#0E1420] rounded-3xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] p-6 sm:p-8 flex flex-col gap-6 animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center gap-2">
          {/* Official Rokad Emblem */}
          <div className="w-16 h-16 rounded-2xl bg-[#080B11] border-1.5 border-[#59BBAF] flex items-center justify-center p-3 shadow-[0_0_20px_rgba(89,187,175,0.3)]">
            <img src="/logos/Sign-01.svg" alt="رُکاد" className="w-full h-full object-contain filter invert drop-shadow-[0_0_8px_rgba(89,187,175,0.8)]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">ثبت‌نام در کلاب گیم‌کاد</h1>
          <p className="text-body-sm text-[#94A3B8]">
            عضویت در باشگاه و آغاز ماجراجویی در لیدربورد مسابقات مشهد.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/40 border-1.5 border-red-500 text-caption font-bold text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="نام و نام خانوادگی نمایشی"
            placeholder="مثال: مهدیار شریفی"
            value={formData.displayName}
            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            leadingIcon={<User size={18} />}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="نام کاربری (حداقل ۳ کاراکتر)"
              placeholder="مثال: mahdiyar"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              leadingIcon={<User size={18} />}
              required
            />

            <Input
              label="ایمیل معتبر"
              type="email"
              placeholder="user@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              leadingIcon={<Mail size={18} />}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="رمز عبور (حداقل ۸ کاراکتر)"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              leadingIcon={<Lock size={18} />}
              showPasswordToggle
              required
            />

            <Input
              label="تکرار رمز عبور"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              leadingIcon={<Lock size={18} />}
              showPasswordToggle
              required
            />
          </div>

          <div>
            <label className="text-caption font-bold text-[#64748B] block mb-1">
              جنسیت (جهت رزرو میزهای اختصاصی):
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'boy', label: 'آقا / پسر' },
                { id: 'girl', label: 'خانم / دختر' },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: g.id as any })}
                  className={`py-2.5 px-4 rounded-xl text-caption font-black border transition-all cursor-pointer btn-tactile ${
                    formData.gender === g.id
                      ? 'bg-[#59BBAF] text-[#080B11] border-black shadow-[1.5px_1.5px_0_#000000]'
                      : 'bg-[#0A0E17] text-[#94A3B8] border-[#1E293B] hover:text-white'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="شماره موبایل (اختیاری)"
            type="tel"
            placeholder="۰۹۱۵۰۰۰۰۰۰۰"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            leadingIcon={<Phone size={18} />}
          />

          {/* Official Avatar Presets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-caption font-bold text-[#64748B]">
                انتخاب تصویر پروفایل رسمی:
              </label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, avatar: getRandomAvatarPreset() })}
                className="text-caption font-bold text-[#59BBAF] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Shuffle size={12} />
                <span>انتخاب تصادفی</span>
              </button>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {OFFICIAL_AVATAR_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, avatar: p.url })}
                  className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                    formData.avatar === p.url
                      ? 'border-[#59BBAF] ring-2 ring-[#59BBAF]/50 scale-105 shadow-[0_0_12px_rgba(89,187,175,0.4)]'
                      : 'border-[#1E293B] opacity-60 hover:opacity-100 hover:border-[#64748B]'
                  }`}
                  title={p.name}
                >
                  <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <Button variant="primary" size="lg" type="submit" isLoading={loading} className="w-full mt-2">
            عضویت و افتتاح حساب در گیم‌کاد
          </Button>
        </form>

        <div className="text-center text-body-sm text-[#64748B]">
          قبلاً عضو شده‌اید؟{' '}
          <Link to="/login" className="font-bold text-[#59BBAF] hover:underline">
            ورود به حساب کاربری
          </Link>
        </div>
      </div>
    </div>
  );
};
