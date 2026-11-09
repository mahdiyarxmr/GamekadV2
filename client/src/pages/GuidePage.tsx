import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { Scenario } from '../types';
import { Button } from '../components/ui/Button';
import { BookOpen, Shield, Users, ArrowLeft, RotateCcw, Skull, Flame } from 'lucide-react';
import { toPersianDigits } from '../utils/formatters';

export const GuidePage: React.FC = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getScenarios()
      .then((res) => setScenarios(res))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-6 sm:gap-8 py-4 sm:py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#59BBAF]/15 text-[#59BBAF] border border-[#59BBAF]/30 w-fit text-caption font-black">
            <Skull size={14} className="text-red-400" />
            <span>راهنمای مسابقاتی مافیا</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">سناریوهای رسمی و کارت‌های نقش مافیا</h1>
          <p className="text-body-sm text-[#94A3B8]">
            ساختار فازهای شب و روز، موازنه‌های استراتژیک، شروط پیروزی و کارت‌های فلیپ ۳ بعدی هر نقش.
          </p>
        </div>

        <Link to="/guide/roles">
          <Button variant="outline" size="md" className="gap-2">
            <BookOpen size={16} />
            <span>فرهنگ‌نامه کامل نقش‌ها</span>
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="p-12 text-center text-[#64748B] font-bold">در حال فراخوانی سناریوها...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {scenarios.map((sc) => (
            <div
              key={sc.id}
              className="bg-[#0E1420] rounded-2xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] hover:border-[#59BBAF] transition-all p-5 sm:p-6 flex flex-col justify-between gap-6 group"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-caption font-black px-2.5 py-0.5 rounded-full bg-[#141C2C] text-[#59BBAF] border border-[#1E293B]">
                    {sc.title}
                  </span>
                  <span className="text-caption font-bold text-[#64748B]">
                    ظرفیت میز: {toPersianDigits(sc.minPlayers)} تا {toPersianDigits(sc.maxPlayers)} بازیکن
                  </span>
                </div>

                <h3 className="text-title sm:text-h2 font-black text-white group-hover:text-[#59BBAF] transition-colors leading-snug break-words">{sc.title}</h3>
                <p className="text-body-sm text-[#94A3B8] leading-relaxed">
                  {sc.description}
                </p>

                <div className="flex flex-col gap-2 pt-3 border-t border-[#1E293B] text-caption">
                  <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-emerald-300">
                    <span className="font-black text-emerald-400">🟢 شرط پیروزی شهروندان: </span>
                    <span>{sc.victoryCitizen}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-red-950/30 border border-red-500/20 text-red-300">
                    <span className="font-black text-red-400">🔴 شرط پیروزی مافیا: </span>
                    <span>{sc.victoryMafia}</span>
                  </div>
                </div>
              </div>

              <Link to={`/guide/scenarios/${sc.slug}`}>
                <Button variant="primary" size="sm" className="w-full justify-between">
                  <span>مشاهده کارت‌های فلیپ و قوانین کامل</span>
                  <ArrowLeft size={16} />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
