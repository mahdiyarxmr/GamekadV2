import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Wallet,
  Settings,
  Shield,
  ArrowRight,
  LogOut,
  Crown,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center gap-4">
        <h2 className="text-h2 font-black text-white">دسترسی غیرمجاز</h2>
        <p className="text-body-sm text-[#94A3B8]">این بخش مخصوص مدیران کل گیم‌کاد است.</p>
        <Link to="/" className="text-[#59BBAF] font-bold">
          بازگشت به صفحه اصلی
        </Link>
      </div>
    );
  }

  const menuItems = [
    { to: '/admin/dashboard', label: 'داشبورد و بلوک‌ها', icon: <LayoutDashboard size={18} /> },
    { to: '/admin/events', label: 'رویدادها و حضور', icon: <Calendar size={18} /> },
    { to: '/admin/users', label: 'کاربران و اعضا', icon: <Users size={18} /> },
    { to: '/admin/wallet', label: 'تعدیل مالی کیف پول', icon: <Wallet size={18} /> },
    { to: '/admin/settings', label: 'تنظیمات کلاب', icon: <Settings size={18} /> },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 py-6 min-h-[80vh]">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#0E1420] rounded-3xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] p-5 flex flex-col justify-between shrink-0 h-fit">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#1E293B]">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-black font-black flex items-center justify-center text-caption">
              <Crown size={16} />
            </div>
            <div>
              <span className="text-body-sm font-black text-white block">پنل مدیریت کلاب</span>
              <span className="text-[11px] text-[#64748B]">گیم‌کاد / رُکاد مشهد</span>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3 py-2.5 rounded-xl text-body-sm font-bold flex items-center gap-2.5 transition-all ${
                    isActive
                      ? 'bg-[#59BBAF] text-[#080B11] border-1.5 border-black shadow-[1.5px_1.5px_0_#000000]'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#141C2C]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-[#1E293B] flex flex-col gap-2 mt-6">
          <Link
            to="/host/god-game"
            className="px-3 py-2 rounded-xl text-caption font-bold text-blue-400 hover:bg-blue-950/40 flex items-center gap-2"
          >
            <Shield size={16} />
            <span>کنسول زنده خدای بازی</span>
          </Link>

          <Link
            to="/"
            className="px-3 py-2 rounded-xl text-caption font-bold text-[#64748B] hover:text-[#59BBAF] flex items-center gap-2"
          >
            <ArrowRight size={16} />
            <span>مشاهده لابی عمومی کلاب</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Content Canvas */}
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
};
