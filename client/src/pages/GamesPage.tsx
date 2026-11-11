import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { GameCategory, Scenario, ElectronicGame } from '../types';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { Gamepad2, ShieldAlert, Crown, ArrowLeft, Play, Skull, Flame } from 'lucide-react';
import { toPersianDigits } from '../utils/formatters';

export const GamesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'table' | 'electronic'>('table');
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [electronicGames, setElectronicGames] = useState<ElectronicGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getScenarios(), api.getElectronicGames()])
      .then(([scs, egs]) => {
        setScenarios(scs);
        setElectronicGames(egs);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-6 sm:gap-8 py-4 sm:py-6">
      {/* Centered Header */}
      <div className="flex flex-col items-center text-center gap-3 max-w-2xl mx-auto w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#59BBAF]/15 text-[#59BBAF] border border-[#59BBAF]/30 text-caption font-black">
          <Flame size={14} className="text-amber-400" />
          <span>کاتالوگ مسابقات و بازی‌های کلاب</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white">بازی‌های رومیزی، سناریوها و رقابت‌های PS5</h1>
        <p className="text-body-sm sm:text-body text-[#94A3B8]">
          انتخاب بین سناریوهای مافیای کلاسیک، کاپو، بازپرس و دوئل‌های کنسولی EA FC 25 و مورتال کامبت.
        </p>

        <div className="mt-2 w-full flex justify-center">
          <Tabs
            items={[
              { id: 'table', label: 'سناریوهای رومیزی و مافیا' },
              { id: 'electronic', label: 'رقابت‌های کنسولی PS5' },
            ]}
            activeId={activeTab}
            onChange={(id) => setActiveTab(id as any)}
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-[#64748B] font-bold">در حال بارگذاری کاتالوگ مسابقات...</div>
      ) : activeTab === 'table' ? (
        /* TABLE GAMES */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {scenarios.map((sc) => (
            <div
              key={sc.id}
              className="bg-[#0E1420] rounded-2xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] hover:border-[#59BBAF] transition-all p-5 sm:p-6 flex flex-col justify-between gap-4 group"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-caption font-bold px-2 py-0.5 rounded-full bg-[#141C2C] text-[#59BBAF] border border-[#1E293B]">
                    {sc.category?.name || 'شب‌های مافیا'}
                  </span>
                  <span className="text-caption font-black text-[#94A3B8]">
                    {toPersianDigits(sc.minPlayers)} الی {toPersianDigits(sc.maxPlayers)} بازیکن
                  </span>
                </div>

                <h3 className="text-title sm:text-h2 font-black text-white group-hover:text-[#59BBAF] transition-colors">
                  {sc.title}
                </h3>
                <p className="text-body-sm text-[#94A3B8] leading-relaxed line-clamp-3">
                  {sc.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between">
                <span className="text-caption text-[#64748B] font-bold">
                  تعداد نقش‌ها: {toPersianDigits((sc as any).rolesCount || 8)}
                </span>
                <Link to={`/guide/scenarios/${sc.slug}`}>
                  <Button variant="outline" size="sm" className="gap-1">
                    <span>کارت‌های نقش و فلیپ</span>
                    <ArrowLeft size={14} />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ELECTRONIC CONSOLE GAMES */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {electronicGames.map((game) => (
            <div
              key={game.id}
              className="bg-[#0E1420] rounded-2xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] overflow-hidden flex flex-col sm:flex-row gap-4 p-5 hover:border-[#59BBAF] transition-all"
            >
              <div className="w-full sm:w-44 h-44 rounded-xl overflow-hidden bg-[#0A0E17] shrink-0 border border-[#1E293B]">
                <img src={game.coverImage} alt={game.title} className="w-full h-full object-cover" />
              </div>

              <div className="flex flex-col justify-between gap-3 text-right flex-1">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-caption font-black px-2 py-0.5 rounded bg-blue-950/70 text-blue-400 border border-blue-500/40">
                      {game.platform}
                    </span>
                    <span className="text-caption font-bold text-[#64748B]">
                      {game.mode}
                    </span>
                  </div>

                  <h3 className="text-title sm:text-h2 font-black text-white">{game.title}</h3>
                  <p className="text-body-sm text-[#94A3B8] line-clamp-2 leading-relaxed">
                    {game.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#1E293B]">
                  <span className="text-caption font-black text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                    استند فعال کلاب
                  </span>
                  <Link to="/events">
                    <Button variant="primary" size="sm" className="gap-1">
                      <span>رزرو استند بازی</span>
                      <ArrowLeft size={14} />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
