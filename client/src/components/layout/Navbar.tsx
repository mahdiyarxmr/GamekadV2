import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { RokadBadge } from '../ui/Badge';
import { formatTomans } from '../../utils/formatters';
import {
  Gamepad2,
  Calendar,
  BookOpen,
  Trophy,
  Users,
  Wallet,
  Shield,
  Crown,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Flame,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, quickLogin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  const navLinks = [
    { to: '/', label: 'کلاب' },
    { to: '/events', label: 'میزهای بازی' },
    { to: '/games', label: 'بازی‌ها' },
    { to: '/guide', label: 'کارت‌های نقش' },
    { to: '/leaderboard', label: 'لیدربورد' },
    { to: '/players', label: 'بازیکنان' },
    { to: '/learn', label: 'اتاق تاکتیک' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080B11]/95 backdrop-blur-md border-b-1.5 border-[#1E293B] shadow-lg transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Logo and Brand */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link to="/" className="flex items-center gap-2.5 select-none group">
            {/* Official Rokad Emblem */}
            <div className="w-10 h-10 rounded-xl bg-[#0E1420] border-1.5 border-[#59BBAF]/50 flex items-center justify-center p-1.5 shadow-hard-xs group-hover:border-[#59BBAF] transition-all">
              <img src="/logos/Sign-01.svg" alt="رُکاد" className="w-full h-full object-contain filter invert drop-shadow-[0_0_8px_rgba(89,187,175,0.6)]" />
            </div>

            <div className="flex flex-col text-right">
              <div className="flex items-center gap-1.5">
                <span className="text-h2 font-black text-white tracking-tight">گیم‌کاد</span>
                <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-[#59BBAF]/15 text-[#59BBAF] border border-[#59BBAF]/40">
                  رُکاد
                </span>
              </div>
              <span className="hidden sm:block text-[10px] font-bold text-[#64748B] -mt-1">
                باشگاه بازی و رویدادهای حضوری
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-1.5 rounded-xl text-body-sm font-bold transition-all ${
                    isActive
                      ? 'bg-[#141C2C] text-[#59BBAF] border-1.5 border-[#59BBAF]/40 shadow-hard-xs'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#0E1420]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Demo Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDemoMenu(!showDemoMenu)}
              className="h-9 px-2.5 rounded-xl bg-[#0E1420] text-caption font-bold border-1.5 border-[#1E293B] hover:border-[#59BBAF] text-[#94A3B8] hover:text-white flex items-center gap-1.5 btn-tactile shadow-hard-xs"
              title="ورود سریع تستی با اکانت‌های دمو"
            >
              <Users size={14} className="text-[#59BBAF]" />
              <span className="text-[11px]">دمو</span>
              <ChevronDown size={12} />
            </button>
            {showDemoMenu && (
              <div className="absolute left-0 mt-2 w-48 bg-[#0E1420] rounded-xl border-1.5 border-[#1E293B] shadow-2xl py-1.5 z-50 animate-in zoom-in-95">
                <div className="px-3 py-1 text-caption text-[#64748B] font-bold border-b border-[#1E293B]">
                  اکانت‌های دمو (یک کلیک):
                </div>
                <button
                  type="button"
                  onClick={() => {
                    quickLogin('admin');
                    setShowDemoMenu(false);
                  }}
                  className="w-full px-3 py-2 text-right text-caption font-bold text-white hover:bg-[#141C2C] flex items-center gap-2"
                >
                  <Crown size={14} className="text-amber-400" />
                  <span>مدیر کل (admin)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    quickLogin('host');
                    setShowDemoMenu(false);
                  }}
                  className="w-full px-3 py-2 text-right text-caption font-bold text-white hover:bg-[#141C2C] flex items-center gap-2"
                >
                  <Shield size={14} className="text-blue-400" />
                  <span>خدای بازی (host)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    quickLogin('player');
                    setShowDemoMenu(false);
                  }}
                  className="w-full px-3 py-2 text-right text-caption font-bold text-white hover:bg-[#141C2C] flex items-center gap-2"
                >
                  <Flame size={14} className="text-[#59BBAF]" />
                  <span>بازیکن (player)</span>
                </button>
              </div>
            )}
          </div>

          {/* User Auth Info / Login */}
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl bg-[#0E1420] border-1.5 border-[#1E293B] hover:border-[#59BBAF] btn-tactile shadow-hard-xs"
              >
                <div className="w-7 h-7 rounded-lg bg-[#59BBAF] text-[#080B11] font-black flex items-center justify-center text-caption overflow-hidden shrink-0 border border-black/40">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.displayName} className="w-full h-full object-cover" />
                  ) : (
                    user.displayName.slice(0, 1)
                  )}
                </div>
                <div className="flex flex-col text-right">
                  <div className="flex items-center gap-1">
                    <span className="text-body-sm font-bold text-white max-w-[85px] sm:max-w-[120px] truncate">
                      {user.displayName}
                    </span>
                    <RokadBadge membership={user.membership} size="sm" />
                  </div>
                  <span className="text-[11px] font-black text-[#59BBAF]">
                    {formatTomans(user.walletBalance)}
                  </span>
                </div>
                <ChevronDown size={14} className="text-[#64748B]" />
              </button>

              {showUserMenu && (
                <div className="absolute left-0 mt-2 w-56 bg-[#0E1420] rounded-xl border-1.5 border-[#1E293B] shadow-2xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-[#1E293B] mb-1">
                    <span className="text-body-sm font-bold block text-white">{user.displayName}</span>
                    <span className="text-caption text-[#64748B] dir-ltr text-right block">@{user.username}</span>
                  </div>

                  <Link
                    to="/account"
                    onClick={() => setShowUserMenu(false)}
                    className="px-4 py-2 text-body-sm font-medium hover:bg-[#141C2C] flex items-center gap-2.5 text-white"
                  >
                    <UserIcon size={16} />
                    <span>حساب کاربری من</span>
                  </Link>

                  <Link
                    to="/account/wallet"
                    onClick={() => setShowUserMenu(false)}
                    className="px-4 py-2 text-body-sm font-medium hover:bg-[#141C2C] flex items-center justify-between text-white"
                  >
                    <span className="flex items-center gap-2.5">
                      <Wallet size={16} className="text-[#59BBAF]" />
                      <span>کیف پول</span>
                    </span>
                    <span className="text-caption font-black text-[#59BBAF] bg-[#59BBAF]/10 px-2 py-0.5 rounded">
                      {formatTomans(user.walletBalance)}
                    </span>
                  </Link>

                  {/* God Game Host shortcut (only if allowed or admin) */}
                  {(user.godGameAllowed || user.role === 'admin') && (
                    <Link
                      to="/host/god-game"
                      onClick={() => setShowUserMenu(false)}
                      className="px-4 py-2 text-body-sm font-bold text-blue-400 hover:bg-blue-950/40 flex items-center gap-2.5"
                    >
                      <Shield size={16} />
                      <span>میز خدای بازی</span>
                    </Link>
                  )}

                  {/* Admin panel shortcut (only if admin) */}
                  {user.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setShowUserMenu(false)}
                      className="px-4 py-2 text-body-sm font-bold text-amber-400 hover:bg-amber-950/40 flex items-center gap-2.5"
                    >
                      <Crown size={16} />
                      <span>پنل مدیریت ادمین</span>
                    </Link>
                  )}

                  <div className="border-t border-[#1E293B] my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                      navigate('/');
                    }}
                    className="w-full px-4 py-2 text-right text-body-sm font-bold text-red-400 hover:bg-red-950/30 flex items-center gap-2.5 cursor-pointer"
                  >
                    <LogOut size={16} />
                    <span>خروج از حساب</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" size="sm">
                  ورود
                </Button>
              </Link>
              <Link to="/register" className="hidden sm:inline-block">
                <Button variant="primary" size="sm">
                  ثبت‌نام
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
