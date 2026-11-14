import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Wallet,
  Settings,
  Shield,
  ArrowRight,
  Crown,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 sm:p-8 text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-red-950/40 border-1.5 border-red-500/50 flex items-center justify-center text-red-400">
          <Shield size={32} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">دسترسی غیرمجاز</h2>
        <p className="text-body-sm text-[#94A3B8]">
          این بخش اختصاصی مدیران کل و ارشد باشگاه بازی گیم‌کاد است.
        </p>
        <Link
          to="/"
          className="h-10 px-5 rounded-xl bg-[#59BBAF] text-[#080B11] font-black text-body-sm flex items-center gap-2 hover:bg-[#48D1B2] transition-colors"
        >
          <ArrowRight size={16} />
          <span>بازگشت به لابی کلاب</span>
        </Link>
      </div>
    );
  }

  const menuItems = [
    { to: '/admin/dashboard', label: 'داشبورد', icon: <LayoutDashboard size={17} /> },
    { to: '/admin/events', label: 'میزها و رویدادها', icon: <Calendar size={17} /> },
    { to: '/admin/users', label: 'کاربران و اعضا', icon: <Users size={17} /> },
    { to: '/admin/wallet', label: 'تعدیل کیف پول', icon: <Wallet size={17} /> },
    { to: '/admin/settings', label: 'تنظیمات کلاب', icon: <Settings size={17} /> },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-5 sm:gap-6 py-4 sm:py-6 min-h-[80vh] w-full max-w-full">
      {/* Admin Navigation Sidebar (Desktop) / Horizontal Bar (Mobile) */}
      <aside className="w-full md:w-64 bg-[#0E1420] rounded-2xl sm:rounded-3xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] p-3.5 sm:p-5 flex flex-col justify-between shrink-0 h-fit">
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Header Title */}
          <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-black font-black flex items-center justify-center shrink-0 shadow-sm">
                <Crown size={18} />
              </div>
              <div>
                <span className="text-body-sm sm:text-title font-black text-white block">
                  پنل مدیریت گیم‌کاد
                </span>
                <span className="text-[11px] text-[#64748B]">اکوسیستم بازی‌های رُکاد</span>
              </div>
            </div>

            {/* Quick exit to client on mobile */}
            <Link
              to="/"
              className="md:hidden text-caption font-bold text-[#59BBAF] hover:underline flex items-center gap-1"
            >
              <span>لابی</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Nav Items: Horizontal on mobile, vertical on desktop */}
          <nav className="flex md:flex-col overflow-x-auto no-scrollbar gap-1.5 pb-1 md:pb-0 -mx-1 px-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3 py-2 sm:py-2.5 rounded-xl text-caption sm:text-body-sm font-bold flex items-center gap-2 shrink-0 transition-all ${
                    isActive
                      ? 'bg-[#59BBAF] text-[#080B11] border-1.5 border-black shadow-[1.5px_1.5px_0_#000000]'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#141C2C] bg-[#0A0E17]/60 md:bg-transparent border md:border-transparent border-[#1E293B]'
                  }`}
                >
                  <span className={isActive ? 'text-[#080B11]' : 'text-[#59BBAF]'}>
                    {item.icon}
                  </span>
                  <span className="whitespace-nowrap">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Shortcuts for Desktop */}
        <div className="hidden md:flex pt-4 border-t border-[#1E293B] flex-col gap-2 mt-6">
          <Link
            to="/host/god-game"
            className="px-3 py-2 rounded-xl text-caption font-bold text-blue-400 hover:bg-blue-950/40 flex items-center gap-2 border border-blue-500/20"
          >
            <Shield size={16} />
            <span>کنسول زنده خدای بازی</span>
          </Link>

          <Link
            to="/"
            className="px-3 py-2 rounded-xl text-caption font-bold text-[#94A3B8] hover:text-[#59BBAF] flex items-center gap-2"
          >
            <ArrowRight size={16} />
            <span>مشاهده لابی کلاب</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Content Canvas */}
      <main className="flex-1 min-w-0 w-full max-w-full overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};
