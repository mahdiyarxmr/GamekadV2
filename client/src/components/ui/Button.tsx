import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'persona';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-black select-none cursor-pointer rounded-xl border-1.5 transition-all duration-150 btn-tactile disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none text-center leading-normal';

  const sizeStyles = {
    sm: 'min-h-[36px] px-3 py-1.5 text-caption gap-1.5',
    md: 'min-h-[42px] px-4 py-2 text-body-sm gap-2',
    lg: 'min-h-[48px] px-5 py-2.5 text-body gap-2.5',
    icon: 'h-10 w-10 p-0 justify-center shrink-0',
  }[size];

  const variantStyles = {
    primary:
      'bg-[#59BBAF] text-[#080B11] border-black shadow-[2px_2px_0_#000000] hover:bg-[#48D1B2] active:bg-[#38C2A3]',
    secondary:
      'bg-[#141C2C] text-white border-[#1E293B] shadow-[2px_2px_0_#000000] hover:border-[#59BBAF]/50',
    outline:
      'bg-[#0E1420] text-white border-[#1E293B] shadow-[2px_2px_0_#000000] hover:border-[#59BBAF] hover:text-[#59BBAF]',
    ghost:
      'bg-transparent text-[#94A3B8] border-transparent shadow-none hover:bg-[#0E1420] hover:text-white',
    danger:
      'bg-red-600 text-white border-red-950 shadow-[2px_2px_0_#000000] hover:bg-red-500',
    persona:
      'bg-[#59BBAF] text-[#080B11] border-black shadow-[2px_2px_0_#000000] hover:bg-[#48D1B2]',
  }[variant];

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span>در حال پردازش...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};
