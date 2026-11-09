import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leadingIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leadingIcon,
  showPasswordToggle = false,
  type = 'text',
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full flex flex-col gap-1.5 text-right">
      {label && (
        <label className="text-body-sm font-bold text-ui-text-primary">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leadingIcon && (
          <span className="absolute right-3.5 text-ui-text-muted pointer-events-none flex items-center">
            {leadingIcon}
          </span>
        )}
        <input
          type={inputType}
          className={`w-full h-11 bg-ui-surface text-ui-text-primary text-body-sm rounded-xl border-1.5 transition-all outline-none placeholder:text-ui-text-muted ${
            error
              ? 'border-semantic-danger focus:ring-2 focus:ring-semantic-danger/20'
              : 'border-ui-border-default focus:border-[var(--theme-primary)] focus:shadow-hard-xs'
          } ${leadingIcon ? 'pr-11 pl-4' : 'px-4'} ${
            showPasswordToggle ? 'pl-11' : ''
          } ${className}`}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3.5 text-ui-text-muted hover:text-ui-text-primary transition-colors cursor-pointer"
            aria-label="تغییر نمایش رمز عبور"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <span className="text-caption text-semantic-danger font-medium">{error}</span>}
    </div>
  );
};
