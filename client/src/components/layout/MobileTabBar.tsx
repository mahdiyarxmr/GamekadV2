import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Calendar, BookOpen, Trophy, User, Gamepad2 } from 'lucide-react';

export const MobileTabBar: React.FC = () => {
  const { user } = useAuth();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080B11]/95 backdrop-blur-xl border-t-1.5 border-[#1E293B] shadow-[0_-8px_30px_rgba(0,0,0,0.6)]">
      <div className="grid grid-cols-5 h-16 max-w-md mx-auto items-center px-1">
        {/* 1. Events */}
        <NavLink
          to="/events"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 transition-all select-none ${
              isActive ? 'text-[#59BBAF] font-black' : 'text-[#64748B] hover:text-[#94A3B8]'
            }`
          }
        >
          <Calendar size={20} />
          <span className="text-[10px] font-bold">میزها</span>
        </NavLink>

        {/* 2. Guide */}
        <NavLink
          to="/guide"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 transition-all select-none ${
              isActive ? 'text-[#59BBAF] font-black' : 'text-[#64748B] hover:text-[#94A3B8]'
            }`
          }
        >
          <BookOpen size={20} />
          <span className="text-[10px] font-bold">نقش‌ها</span>
        </NavLink>

        {/* 3. CENTER ELEVATED GLOWING BUTTON (GAMING HOME) */}
        <div className="flex items-center justify-center -mt-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `w-14 h-14 rounded-2xl bg-[#59BBAF] text-[#080B11] border-2 border-black flex items-center justify-center shadow-[0_0_20px_rgba(89,187,175,0.4)] transition-transform btn-tactile ${
                isActive ? 'scale-110 ring-4 ring-[#59BBAF]/20' : ''
              }`
            }
          >
            <Gamepad2 size={28} />
          </NavLink>
        </div>

        {/* 4. Leaderboard */}
        <NavLink
          to="/leaderboard"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 transition-all select-none ${
              isActive ? 'text-[#59BBAF] font-black' : 'text-[#64748B] hover:text-[#94A3B8]'
            }`
          }
        >
          <Trophy size={20} />
          <span className="text-[10px] font-bold">رنکینگ</span>
        </NavLink>

        {/* 5. Account / Login */}
        <NavLink
          to={user ? '/account' : '/login'}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 transition-all select-none ${
              isActive ? 'text-[#59BBAF] font-black' : 'text-[#64748B] hover:text-[#94A3B8]'
            }`
          }
        >
          <User size={20} />
          <span className="text-[10px] font-bold">{user ? 'پروفایل' : 'ورود'}</span>
        </NavLink>
      </div>
    </nav>
  );
};
