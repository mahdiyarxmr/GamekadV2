import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { Article } from '../types';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Flame, Zap, Shield, Trophy } from 'lucide-react';
import { formatShamsiDate } from '../utils/formatters';

export const LearnPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getArticles()
      .then((res) => setArticles(res))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-6 sm:gap-8 py-4 sm:py-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#59BBAF]/15 text-[#59BBAF] border border-[#59BBAF]/30 w-fit text-caption font-black">
          <Flame size={14} className="text-amber-400" />
          <span>اتاق متاروم و تحلیل‌های مسابقاتی</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">تاکتیک‌های بازی، ترفندهای برد و اخبار کلاب</h1>
        <p className="text-body-sm sm:text-body text-[#94A3B8]">
          تحلیل سناریوهای مافیا، اصول نطق و خوانش چشم، ترفندهای روان‌شناختی بلوف، استراتژی‌های کلاچ و گزارش رویدادهای حضوری گیم‌کاد مشهد.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-[#64748B] font-bold">در حال بارگذاری متاروم...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {articles.map((art) => (
            <div
              key={art.id}
              className="bg-[#0E1420] rounded-2xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] hover:border-[#59BBAF] transition-all p-5 sm:p-6 flex flex-col justify-between gap-4 group"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-caption font-bold px-2.5 py-0.5 rounded-full bg-[#141C2C] text-[#59BBAF] border border-[#1E293B]">
                    {art.type === 'guide' ? '⚡ تاکتیک و استراتژی' : '🏆 گزارش رویداد'}
                  </span>
                  <span className="text-[11px] text-[#64748B] font-bold">
                    {formatShamsiDate(art.createdAt)}
                  </span>
                </div>

                <h3 className="text-title font-black text-white group-hover:text-[#59BBAF] transition-colors line-clamp-2">
                  {art.title}
                </h3>
                <p className="text-body-sm text-[#94A3B8] leading-relaxed line-clamp-3">
                  {art.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between">
                <span className="text-caption text-[#64748B] font-bold">{art.authorName}</span>
                <Link to={`/learn/${art.slug}`}>
                  <Button variant="outline" size="sm" className="gap-1">
                    <span>بررسی ترفند</span>
                    <ArrowLeft size={14} />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
