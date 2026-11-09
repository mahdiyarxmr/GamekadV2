import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, MapPin, Phone, Clock, ShieldCheck, Flame } from 'lucide-react';
import { toPersianDigits } from '../../utils/formatters';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#05070B] border-t-1.5 border-[#1E293B] mt-16 pb-24 lg:pb-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#0E1420] border-1.5 border-[#59BBAF]/50 flex items-center justify-center p-2 shadow-hard-xs">
                <img src="/logos/Sign-01.svg" alt="رُکاد" className="w-full h-full object-contain filter invert" />
              </div>
              <div>
                <span className="text-h2 font-black text-white tracking-tight">کلاب گیمینگ گیم‌کاد</span>
                <span className="block text-caption text-[#59BBAF] font-black">
                  باشگاه بازی‌های حضوری، شب‌های مافیا و تورنمنت‌های کنسولی مشهد
                </span>
              </div>
            </div>
            <p className="text-body-sm text-[#94A3B8] leading-relaxed max-w-md">
              گیم‌کاد میدان رقابت زنده و آدرنالین گیمرهای مشهد است. میزهای تخصصی مافیا با کارت‌های فیزیکی نئوبروتالیسم، مسابقات حرفه‌ای پلی‌استیشن ۵ و رقابت برای صعود در رنکینگ لیدربورد.
            </p>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-3">
            <h4 className="text-body font-black text-white border-b border-[#1E293B] pb-2">
              لوکیشن و شماره تماس
            </h4>
            <div className="flex items-start gap-2 text-body-sm text-[#94A3B8] leading-relaxed">
              <MapPin size={18} className="text-[#59BBAF] shrink-0 mt-0.5" />
              <span>مشهد، فرامرز عباسی، رسالت ۳۲، بین ۴۵ و ۴۷، پلاک ۲۳</span>
            </div>
            <div className="flex items-center gap-2 text-body-sm text-[#94A3B8]">
              <Phone size={18} className="text-[#59BBAF] shrink-0" />
              <span className="font-mono text-white font-bold">{toPersianDigits('09332881180')}</span>
            </div>
            <div className="flex items-center gap-2 text-body-sm text-[#94A3B8]">
              <Clock size={18} className="text-[#59BBAF] shrink-0" />
              <span>هر روز عصرها از ساعت ۱۶:۰۰ تا پاسی از شب</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-body font-black text-white border-b border-[#1E293B] pb-2">
              دسترسی سریع
            </h4>
            <div className="grid grid-cols-2 gap-2 text-body-sm font-bold">
              <Link to="/events" className="text-[#94A3B8] hover:text-[#59BBAF] transition-colors">
                رزرو میز بازی
              </Link>
              <Link to="/guide" className="text-[#94A3B8] hover:text-[#59BBAF] transition-colors">
                کارت‌های نقش مافیا
              </Link>
              <Link to="/leaderboard" className="text-[#94A3B8] hover:text-[#59BBAF] transition-colors">
                رنکینگ لیدربورد
              </Link>
              <Link to="/players" className="text-[#94A3B8] hover:text-[#59BBAF] transition-colors">
                پروفایل پلیرها
              </Link>
              <Link to="/games" className="text-[#94A3B8] hover:text-[#59BBAF] transition-colors">
                بازی‌های کنسولی
              </Link>
              <Link to="/host/god-game" className="text-[#94A3B8] hover:text-[#59BBAF] transition-colors">
                میز خدای بازی
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-4 text-caption text-[#64748B] font-bold">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#59BBAF]" />
            <span>پلتفرم مسابقاتی گیم‌کاد — هویت سایبری و دارک نئوبروتالیسم رُکاد</span>
          </div>
          <div>
            © {toPersianDigits(1405)} گیم‌کاد کلاب مشهد
          </div>
        </div>
      </div>
    </footer>
  );
};
