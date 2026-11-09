import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { Article } from '../types';
import { Button } from '../components/ui/Button';
import { ArrowRight, BookOpen, Clock, User, Flame, Zap, Shield } from 'lucide-react';
import { formatShamsiDate } from '../utils/formatters';

export const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    api
      .getArticleBySlug(slug)
      .then((res) => setArticle(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="p-12 text-center text-[#64748B] font-bold">در حال فراخوانی تحلیل تاکتیکی...</div>;
  }

  if (!article) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-h2 font-black text-white mb-4">تاکتیک یا گزارش مورد نظر یافت نشد.</h2>
        <Link to="/learn">
          <Button variant="outline">بازگشت به اتاق تاکتیک و متاروم</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-6 max-w-3xl mx-auto">
      <div>
        <Link to="/learn" className="inline-flex items-center gap-1.5 text-body-sm font-bold text-[#64748B] hover:text-[#59BBAF] transition-colors">
          <ArrowRight size={16} />
          <span>بازگشت به اتاق تاکتیک و ترفندهای گیمینگ</span>
        </Link>
      </div>

      <article className="bg-[#0E1420] rounded-3xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] p-6 sm:p-10 flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-3 text-caption font-bold text-[#64748B] border-b border-[#1E293B] pb-4">
          <span className="px-3 py-1 rounded-full bg-[#59BBAF]/15 text-[#59BBAF] border border-[#59BBAF]/30 flex items-center gap-1 font-black">
            <Flame size={12} className="text-amber-400" />
            <span>{article.type === 'guide' ? 'تاکتیک برد و متای بازی' : 'گزارش تورنمنت و مسابقه'}</span>
          </span>
          <span className="flex items-center gap-1 text-[#94A3B8]">
            <User size={14} className="text-[#59BBAF]" />
            <span>{article.authorName}</span>
          </span>
          <span className="flex items-center gap-1 text-[#64748B]">
            <Clock size={14} />
            <span>{formatShamsiDate(article.createdAt)}</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
          {article.title}
        </h1>

        <div className="p-4 sm:p-5 bg-[#0A0E17] rounded-2xl border border-[#1E293B] text-body-sm sm:text-body text-[#94A3B8] leading-relaxed font-medium">
          {article.summary}
        </div>

        <div className="text-body sm:text-title text-[#E2E8F0] leading-loose space-y-4 whitespace-pre-line pt-2">
          {article.content}
        </div>

        <div className="pt-6 border-t border-[#1E293B] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-caption text-[#64748B]">
            <Shield size={16} className="text-[#59BBAF]" />
            <span>تایید شده توسط داوران رسمی باشگاه گیم‌کاد مشهد</span>
          </div>

          <Link to="/events">
            <Button variant="primary" size="sm">
              <Zap size={14} />
              <span>اجرای تاکتیک روی میز امشب</span>
            </Button>
          </Link>
        </div>
      </article>
    </div>
  );
};
