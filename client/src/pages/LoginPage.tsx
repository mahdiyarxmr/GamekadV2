import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import {
  User,
  Lock,
  Crown,
  Shield,
  Users,
  Flame,
  Sparkles,
  Target,
  Award,
  Dices,
  Eye,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const DEMO_ACCOUNTS = [
  {
    username: 'admin',
    name: 'مدیر کل گیم‌کاد',
    roleDesc: 'دسترسی کامل پنل مدیریت، رویدادها و گزارش‌ها',
    roleTag: 'مدیریت کل',
    avatar: '/profiles/Game Club.jpg',
    score: '۱۹۵۰',
    icon: Crown,
    color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  },
  {
    username: 'host',
    name: 'بهزاد مهدوی',
    roleDesc: 'خدای بازی و گرداننده ارشد لیگ مافیا (+۵۰۰ بازی)',
    roleTag: 'گرداننده',
    avatar: '/profiles/Boy.png',
    score: '۲۰۵۰',
    icon: Shield,
    color: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
  },
  {
    username: 'player',
    name: 'مهدیار شریفی',
    roleDesc: 'کاپیتان مافیا، MVP اول ماه، مدال الماس ذهن برتر',
    roleTag: 'VIP طلایی',
    avatar: '/profiles/Studio.jpg',
    score: '۲۱۵۰',
    icon: Flame,
    color: 'text-[#59BBAF] border-[#59BBAF]/30 bg-[#59BBAF]/10',
  },
  {
    username: 'sara_art',
    name: 'سارا رضایی',
    roleDesc: 'استراتژیست ماه، تحلیلگر زبان بدن و رکورددار سیو شهر',
    roleTag: 'رُکادی VIP',
    avatar: '/profiles/Girl.jpg',
    score: '۱۹۸۰',
    icon: Sparkles,
    color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
  },
  {
    username: 'ali_k',
    name: 'علی کاظمی',
    roleDesc: 'تک‌تیرانداز نترس و پدیده مسابقات هفتگی مشهد',
    roleTag: 'آزاد',
    avatar: '/profiles/Academy.jpg',
    score: '۱۸۴۰',
    icon: Target,
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  },
  {
    username: 'yasaman_m',
    name: 'یاسمن موسوی',
    roleDesc: 'ملکه استدلال، تارگت‌های بدون خطا بر پایه منطق',
    roleTag: 'VIP',
    avatar: '/profiles/School.jpg',
    score: '۱۷۹۰',
    icon: Award,
    color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
  },
  {
    username: 'arash_r',
    name: 'آرش رستمی',
    roleDesc: 'نینجای بوردگیم، قهرمان کاتان و بازیکن سکرت هیتلر',
    roleTag: 'VIP',
    avatar: '/profiles/Institute.jpg',
    score: '۱۷۲۰',
    icon: Dices,
    color: 'text-amber-300 border-amber-400/30 bg-amber-400/10',
  },
  {
    username: 'niloofar_p',
    name: 'نیلوفر پاکزاد',
    roleDesc: 'کارآگاه نخبه، استعلام مثبت شب اول و آرامش میز',
    roleTag: 'رُکادی',
    avatar: '/profiles/Girl.jpg',
    score: '۱۶۸۰',
    icon: Eye,
    color: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
  },
  {
    username: 'amir_tehrani',
    name: 'امیرحسین تهرانی',
    roleDesc: 'گادفادر خونسرد و استاد بلف و فریب دفاعیه',
    roleTag: 'آزاد',
    avatar: '/profiles/Boy.png',
    score: '۱۶۱۰',
    icon: Flame,
    color: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
  },
  {
    username: 'rojan_afshar',
    name: 'روژان افشار',
    roleDesc: 'پزشک معتمد باشگاه، سیوهای نجات‌بخش فاز شب',
    roleTag: 'VIP',
    avatar: '/profiles/Studio.jpg',
    score: '۱۵۴۰',
    icon: Shield,
    color: 'text-teal-400 border-teal-500/30 bg-teal-500/10',
  },
  {
    username: 'kian_bahrami',
    name: 'کیان بهرامی',
    roleDesc: 'مسابقه‌دهنده EA FC 25 کنسولی و شلیک‌زن مافیا',
    roleTag: 'آزاد',
    avatar: '/profiles/Academy.jpg',
    score: '۱۴۹۰',
    icon: Target,
    color: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
  },
  {
    username: 'mahsa_yazdani',
    name: 'مهسا یزدانی',
    roleDesc: 'روانشناس کلاب و تحلیلگر رفتار غیرکلامی بازیکنان',
    roleTag: 'رُکادی',
    avatar: '/profiles/School.jpg',
    score: '۱۴۲۰',
    icon: Users,
    color: 'text-pink-400 border-pink-500/30 bg-pink-500/10',
  },
];

export const LoginPage: React.FC = () => {
  const { login, quickLogin } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAllDemos, setShowAllDemos] = useState(false);

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

  const handleFastLogin = async (username: string) => {
    setLoading(true);
    setError(null);
    try {
      await quickLogin(username);
      navigate('/account');
    } catch (err: any) {
      setError(err.message || 'خطا در ورود به حساب کاربری نمونه.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-6 sm:py-10 px-4">
      <div className="w-full max-w-xl bg-[#0E1420] rounded-3xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] p-6 sm:p-8 flex flex-col gap-6 animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center gap-2">
          {/* Official Rokad Emblem */}
          <div className="w-16 h-16 rounded-2xl bg-[#080B11] border-1.5 border-[#59BBAF] flex items-center justify-center p-3 shadow-[0_0_20px_rgba(89,187,175,0.3)]">
            <img
              src="/logos/Sign-01.svg"
              alt="رُکاد"
              className="w-full h-full object-contain filter invert drop-shadow-[0_0_8px_rgba(89,187,175,0.8)]"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">ورود به گیم‌کاد</h1>
          <p className="text-body-sm text-[#94A3B8]">
            ورود به لابی باشگاه برای مشاهده آمار، نمودار مهارت، رزرو صندلی و لیدربورد.
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
            placeholder="مثال: player یا sara_art یا admin"
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
            <span className="text-[#64748B]">رمز اکانت‌های تستی: 123456</span>
          </div>

          <Button variant="primary" size="lg" type="submit" isLoading={loading} className="w-full mt-2">
            ورود به کلاب
          </Button>
        </form>

        {/* Demo Fast Login Section */}
        <div className="flex flex-col gap-3 pt-5 border-t border-[#1E293B]">
          <div className="flex items-center justify-between">
            <span className="text-caption font-black text-[#59BBAF] flex items-center gap-1.5">
              <Users size={16} />
              ورود سریع با ۱۰+ اکانت نمونه فعال (تست کامل سیستم):
            </span>
            <button
              type="button"
              onClick={() => setShowAllDemos(!showAllDemos)}
              className="text-caption font-bold text-[#94A3B8] hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>{showAllDemos ? 'بستن لیست کامل' : 'مشاهده همه (۱۲ اکانت)'}</span>
              {showAllDemos ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          {/* Top 3 Quick Pills */}
          <div className="grid grid-cols-3 gap-2">
            {DEMO_ACCOUNTS.slice(0, 3).map((acc) => {
              const Icon = acc.icon;
              return (
                <button
                  key={acc.username}
                  type="button"
                  onClick={() => handleFastLogin(acc.username)}
                  disabled={loading}
                  className="p-2 bg-[#0A0E17] border border-[#1E293B] hover:border-[#59BBAF] rounded-xl text-caption font-bold flex flex-col items-center gap-1.5 transition-all btn-tactile text-[#94A3B8] hover:text-white text-center"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-[#1E293B] bg-[#1E293B] flex items-center justify-center">
                    <img src={acc.avatar} alt={acc.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="font-black text-white text-caption truncate w-full">{acc.name}</span>
                  <span className="text-[11px] text-[#64748B] flex items-center gap-1">
                    <Icon size={12} className={acc.color.split(' ')[0]} />
                    {acc.roleTag}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Full Grid of All 12 Accounts when expanded */}
          {showAllDemos && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-[#1E293B]/60 max-h-72 overflow-y-auto pr-1">
              {DEMO_ACCOUNTS.map((acc) => {
                const Icon = acc.icon;
                return (
                  <button
                    key={acc.username}
                    type="button"
                    onClick={() => handleFastLogin(acc.username)}
                    disabled={loading}
                    className="p-2.5 bg-[#0A0E17] border border-[#1E293B] hover:border-[#59BBAF] rounded-xl text-right flex items-center justify-between gap-3 transition-all hover:bg-[#121A2A]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={acc.avatar}
                        alt={acc.name}
                        className="w-9 h-9 rounded-full object-cover border border-[#1E293B] shrink-0"
                      />
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-caption font-black text-white truncate">{acc.name}</span>
                          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded border ${acc.color}`}>
                            {acc.roleTag}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#94A3B8] truncate">{acc.roleDesc}</span>
                      </div>
                    </div>
                    <div className="text-left shrink-0">
                      <span className="text-[11px] font-black text-[#59BBAF]">امتیاز {acc.score}</span>
                      <span className="block text-[10px] text-[#64748B]">@{acc.username}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
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
