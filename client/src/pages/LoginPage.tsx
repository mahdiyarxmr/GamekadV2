import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { User, Lock, Crown, Shield, Users, Flame } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, quickLogin } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError('لطفاً نام کاربری و رمز عبور را وارد فرمایید.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await login(identifier, password, rememberMe);
      navigate('/account');
    } catch (err: any) {
      setError(err.message || 'نام کاربری یا رمز عبور اشتباه است.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role: 'admin' | 'player' | 'host') => {
    setLoading(true);
    try {
      await quickLogin(role);
      navigate('/account');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-6 sm:py-10 px-4">
      <div className="w-full max-w-md bg-[#0E1420] rounded-3xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] p-6 sm:p-8 flex flex-col gap-6 animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center gap-2">
          {/* Official Rokad Emblem */}
          <div className="w-16 h-16 rounded-2xl bg-[#080B11] border-1.5 border-[#59BBAF] flex items-center justify-center p-3 shadow-[0_0_20px_rgba(89,187,175,0.3)]">
            <img src="/logos/Sign-01.svg" alt="رُکاد" className="w-full h-full object-contain filter invert drop-shadow-[0_0_8px_rgba(89,187,175,0.8)]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">ورود به گیم‌کاد</h1>
          <p className="text-body-sm text-[#94A3B8]">
            ورود به لابی باشگاه برای رزرو صندلی مسابقات و لیدربورد.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/40 border-1.5 border-red-500 text-caption font-bold text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="نام کاربری یا ایمیل"
            placeholder="مثال: player یا admin"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            leadingIcon={<User size={18} />}
            required
          />

          <Input
            label="رمز عبور"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leadingIcon={<Lock size={18} />}
            showPasswordToggle
            required
          />

          <div className="flex items-center justify-between text-caption font-bold text-[#94A3B8]">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-[#1E293B] bg-[#0A0E17] text-[#59BBAF] focus:ring-0"
              />
              <span>مرا به خاطر بسپار</span>
            </label>
          </div>

          <Button variant="primary" size="lg" type="submit" isLoading={loading} className="w-full mt-2">
            ورود به کلاب
          </Button>
        </form>

        {/* Demo Fast Login Pills */}
        <div className="flex flex-col gap-2.5 pt-4 border-t border-[#1E293B]">
          <span className="text-caption font-bold text-[#64748B] text-center">
            ورود سریع آزمایشی (بدون نیاز به تایپ رمز):
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemo('admin')}
              className="py-2 px-2 bg-[#0A0E17] border border-[#1E293B] hover:border-amber-400 rounded-xl text-caption font-bold flex flex-col items-center gap-1 transition-all btn-tactile text-[#94A3B8] hover:text-white"
            >
              <Crown size={16} className="text-amber-400" />
              <span>مدیر کل</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemo('host')}
              className="py-2 px-2 bg-[#0A0E17] border border-[#1E293B] hover:border-blue-400 rounded-xl text-caption font-bold flex flex-col items-center gap-1 transition-all btn-tactile text-[#94A3B8] hover:text-white"
            >
              <Shield size={16} className="text-blue-400" />
              <span>خدای بازی</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemo('player')}
              className="py-2 px-2 bg-[#0A0E17] border border-[#1E293B] hover:border-[#59BBAF] rounded-xl text-caption font-bold flex flex-col items-center gap-1 transition-all btn-tactile text-[#94A3B8] hover:text-white"
            >
              <Flame size={16} className="text-[#59BBAF]" />
              <span>بازیکن</span>
            </button>
          </div>
        </div>

        <div className="text-center text-body-sm text-[#64748B]">
          هنوز عضو نشده‌اید؟{' '}
          <Link to="/register" className="font-bold text-[#59BBAF] hover:underline">
            ثبت‌نام سریع در باشگاه
          </Link>
        </div>
      </div>
    </div>
  );
};
