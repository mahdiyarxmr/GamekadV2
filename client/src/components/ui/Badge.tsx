import React from 'react';
import { MembershipType, TargetGender, RoleSide } from '../../types';
import { Users, Skull, ShieldCheck } from 'lucide-react';

export const RokadBadge: React.FC<{
  membership: MembershipType;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}> = ({ membership, size = 'md', showText = true, className = '' }) => {
  if (membership !== 'ROKAD') return null;

  const sizeStyles = {
    xs: 'h-4 px-1 text-[9px] gap-0.5',
    sm: 'h-5 px-1.5 text-[10px] gap-1',
    md: 'h-6 px-2 text-[11px] gap-1.5',
    lg: 'h-7 px-2.5 text-caption gap-1.5',
  }[size];

  const imgSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size];

  return (
    <span
      title="عضو رسمی هنرستان و اکوسیستم استارتاپی رُکاد"
      className={`inline-flex items-center ${sizeStyles} bg-[#59BBAF]/15 text-[#59BBAF] border border-[#59BBAF]/50 font-black rounded-full select-none shrink-0 shadow-[0_0_10px_rgba(89,187,175,0.3)] transition-transform hover:scale-105 ${className}`}
    >
      <img
        src="/logos/rokad-badge-white.png"
        alt="نشان رسمی رُکاد"
        className={`${imgSizes} object-contain filter drop-shadow-[0_0_4px_rgba(89,187,175,0.9)]`}
      />
      {showText && <span>رُکادی</span>}
    </span>
  );
};

export const GenderBadge: React.FC<{ targetGender: TargetGender }> = ({ targetGender }) => {
  const configs = {
    boys: { label: 'پسران', bg: 'bg-blue-950/60 text-blue-400 border-blue-500/40' },
    girls: { label: 'دختران', bg: 'bg-pink-950/60 text-pink-400 border-pink-500/40' },
    mixed: { label: 'عمومی / مختلط', bg: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40' },
  }[targetGender];

  return (
    <span className={`inline-flex items-center gap-1 font-bold rounded-full px-2.5 py-0.5 text-caption border ${configs.bg}`}>
      <Users size={12} />
      <span>{configs.label}</span>
    </span>
  );
};

export const RoleSideBadge: React.FC<{ side: RoleSide }> = ({ side }) => {
  const configs = {
    CITIZEN: { label: 'شهروند', bg: 'bg-emerald-950/70 text-emerald-400 border-emerald-500/50' },
    MAFIA: { label: 'مافیا', bg: 'bg-red-950/70 text-red-400 border-red-500/50' },
    INDEPENDENT: { label: 'مستقل', bg: 'bg-purple-950/70 text-purple-400 border-purple-500/50' },
  }[side];

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-black text-caption border ${configs.bg}`}>
      {configs.label}
    </span>
  );
};
