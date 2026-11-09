import React, { useState } from 'react';
import { Role } from '../../types';
import { RoleSideBadge } from './Badge';
import {
  Shield,
  Sparkles,
  Skull,
  HeartPulse,
  Search,
  UserCheck,
  RotateCcw,
  Moon,
  Crosshair,
  Flame,
  Zap,
} from 'lucide-react';
import { toPersianDigits } from '../../utils/formatters';

export const FlipRoleCard: React.FC<{ role: Role }> = ({ role }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const getRoleIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('پدرخوانده') || n.includes('رئیس مافیا') || n.includes('دن مافیا') || n.includes('مافیا') || n.includes('دلال')) {
      return <Skull size={32} className="text-red-500" />;
    }
    if (n.includes('ناتو') || n.includes('تک‌تیرانداز') || n.includes('اسنایپر') || n.includes('جلاد')) {
      return <Crosshair size={32} className="text-red-400" />;
    }
    if (n.includes('یاغی') || n.includes('مین‌گذار')) {
      return <Flame size={32} className="text-amber-500" />;
    }
    if (n.includes('دکتر') || n.includes('پزشک') || n.includes('عطار') || n.includes('زره‌ساز')) {
      return <HeartPulse size={32} className="text-emerald-400" />;
    }
    if (n.includes('کارآگاه') || n.includes('راهنما') || n.includes('محقق')) {
      return <Search size={32} className="text-sky-400" />;
    }
    if (n.includes('بازپرس') || n.includes('محافظ') || n.includes('رویین‌تن') || n.includes('وکیل')) {
      return <Shield size={32} className="text-amber-400" />;
    }
    if (n.includes('جادوگر') || n.includes('شیاد') || n.includes('هکر') || n.includes('هوش مصنوعی')) {
      return <Sparkles size={32} className="text-purple-400" />;
    }
    return <UserCheck size={32} className="text-[#59BBAF]" />;
  };

  return (
    <div
      className="perspective-1000 w-full min-h-[410px] h-[410px] cursor-pointer select-none group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* FRONT OF CARD */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-[#0E1420] rounded-2xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] p-5 sm:p-6 flex flex-col justify-between hover:border-[#59BBAF] hover:shadow-[0_0_20px_rgba(89,187,175,0.15)] transition-all">
          <div className="flex items-center justify-between gap-2">
            <RoleSideBadge side={role.side} />
            {role.nightOrder !== undefined && role.nightOrder !== null && (
              <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-full bg-[#141C2C] border border-[#1E293B] text-[#94A3B8]">
                <Moon size={12} className="text-indigo-400" />
                <span>
                  {role.nightOrder === 0 ? 'بدون اکت شب' : `نوبت شب: ${toPersianDigits(role.nightOrder)}`}
                </span>
              </span>
            )}
          </div>

          <div className="flex flex-col items-center text-center my-auto gap-3 py-2">
            <div className="w-16 h-16 rounded-2xl bg-[#080B11] border-1.5 border-[#1E293B] flex items-center justify-center shadow-hard-xs group-hover:scale-105 group-hover:border-[#59BBAF]/50 transition-all shrink-0">
              {getRoleIcon(role.name)}
            </div>
            <h3 className="text-title sm:text-h2 font-black text-white">{role.name}</h3>
            <p className="text-body-sm text-[#94A3B8] leading-relaxed line-clamp-3 px-1">
              {role.description}
            </p>
          </div>

          <div className="pt-3 border-t border-[#1E293B] flex items-center justify-center gap-1.5 text-caption font-bold text-[#59BBAF]">
            <RotateCcw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
            <span>لمس کارت برای مشاهده جزئیات اختیارات</span>
          </div>
        </div>

        {/* BACK OF CARD */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-[#141C2C] rounded-2xl border-1.5 border-[#59BBAF] shadow-[0_0_25px_rgba(89,187,175,0.2)] p-5 sm:p-6 flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#1E293B] shrink-0">
            <span className="text-body-sm sm:text-title font-black text-white">{role.name}</span>
            <RoleSideBadge side={role.side} />
          </div>

          <div className="flex flex-col gap-3 text-right overflow-y-auto pr-1 my-2">
            <div className="bg-[#080B11]/70 p-3 rounded-xl border border-[#1E293B]">
              <span className="text-caption font-black text-[#59BBAF] flex items-center gap-1.5 mb-1">
                <Zap size={13} />
                <span>اختیارات و توانایی‌ها:</span>
              </span>
              <p className="text-body-sm text-[#CBD5E1] leading-relaxed">
                {role.abilities}
              </p>
            </div>

            {role.tips && (
              <div className="bg-amber-950/20 p-3 rounded-xl border border-amber-500/25">
                <span className="text-caption font-black text-amber-400 block mb-1">
                  💡 ترفند و استراتژی بازی:
                </span>
                <p className="text-[12.5px] text-amber-200/90 leading-relaxed">
                  {role.tips}
                </p>
              </div>
            )}
          </div>

          <div className="pt-2.5 border-t border-[#1E293B] flex items-center justify-center gap-1.5 text-caption font-bold text-[#64748B] shrink-0">
            <RotateCcw size={14} />
            <span>لمس جهت برگشت</span>
          </div>
        </div>
      </div>
    </div>
  );
};
