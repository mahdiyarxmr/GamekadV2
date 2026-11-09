import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { toPersianDigits } from '../../utils/formatters';

interface CountdownTimerProps {
  initialSeconds?: number;
  onFinish?: () => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialSeconds = 180,
  onFinish,
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0 && isActive) {
      setIsActive(false);
      if (onFinish) onFinish();
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, onFinish]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(initialSeconds);
  };

  const setPreset = (s: number) => {
    setIsActive(false);
    setSeconds(s);
  };

  const minutes = Math.floor(seconds / 60);
  const remainingSecs = seconds % 60;
  const formattedTime = `${toPersianDigits(minutes)}:${toPersianDigits(remainingSecs.toString().padStart(2, '0'))}`;

  const isLow = seconds <= 30 && seconds > 0;
  const isZero = seconds === 0;

  return (
    <div className="flex flex-col items-center gap-3 p-4 bg-ui-surface rounded-2xl border-1.5 border-ui-border-default shadow-hard-md select-none">
      <div className="flex items-center gap-2 text-ui-text-muted text-caption font-bold">
        <Clock size={16} />
        <span>تایمر نطق و فاز بازی</span>
      </div>

      <div
        className={`text-4xl font-black tracking-widest font-mono px-6 py-2 rounded-xl border-1.5 transition-colors ${
          isZero
            ? 'bg-red-500/20 text-red-500 border-red-500 animate-pulse'
            : isLow
            ? 'bg-amber-500/20 text-amber-500 border-amber-500'
            : 'bg-ui-surface-sunken text-ui-text-primary border-ui-border-default'
        }`}
      >
        {formattedTime}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleTimer}
          className={`h-9 px-4 rounded-xl font-bold text-caption flex items-center gap-1.5 btn-tactile border-1.5 ${
            isActive
              ? 'bg-amber-500 text-white border-amber-700 shadow-hard-xs'
              : 'bg-[var(--theme-primary)] text-white border-[var(--theme-shadow-color)] shadow-hard-xs'
          }`}
        >
          {isActive ? <Pause size={14} /> : <Play size={14} />}
          <span>{isActive ? 'توقف' : 'شروع'}</span>
        </button>

        <button
          type="button"
          onClick={resetTimer}
          className="h-9 w-9 rounded-xl font-bold bg-ui-surface text-ui-text-muted border-1.5 border-ui-border-default hover:text-ui-text-primary hover:border-ui-text-primary flex items-center justify-center btn-tactile shadow-hard-xs"
          title="بازنشانی"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Shortcuts */}
      <div className="flex items-center gap-1 pt-1">
        <button
          type="button"
          onClick={() => setPreset(60)}
          className="px-2 py-0.5 text-caption rounded-lg bg-ui-surface-sunken border border-ui-border-default hover:border-ui-text-primary text-ui-text-secondary"
        >
          ۱ دقیقه
        </button>
        <button
          type="button"
          onClick={() => setPreset(120)}
          className="px-2 py-0.5 text-caption rounded-lg bg-ui-surface-sunken border border-ui-border-default hover:border-ui-text-primary text-ui-text-secondary"
        >
          ۲ دقیقه
        </button>
        <button
          type="button"
          onClick={() => setPreset(180)}
          className="px-2 py-0.5 text-caption rounded-lg bg-ui-surface-sunken border border-ui-border-default hover:border-ui-text-primary text-ui-text-secondary"
        >
          ۳ دقیقه
        </button>
      </div>
    </div>
  );
};
