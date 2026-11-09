import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { formatTomans, toPersianDigits, formatShamsiDate } from '../../utils/formatters';
import {
  Users,
  Calendar,
  CheckCircle2,
  BookOpen,
  DollarSign,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Shield,
  FileText,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [homepageBlocks, setHomepageBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [blocksSaving, setBlocksSaving] = useState(false);

  const fetchDashboard = async () => {
    try {
      const [dash, hp] = await Promise.all([
        api.getAdminDashboard(),
        api.getHomepage(),
      ]);
      setStats(dash);
      setHomepageBlocks(hp.blocks || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleToggleBlockVisibility = (index: number) => {
    const updated = [...homepageBlocks];
    updated[index].isVisible = !updated[index].isVisible;
    setHomepageBlocks(updated);
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === homepageBlocks.length - 1)
    ) {
      return;
    }

    const updated = [...homepageBlocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // re-assign sortOrder
    updated.forEach((b, idx) => {
      b.sortOrder = idx + 1;
    });

    setHomepageBlocks(updated);
  };

  const handleSaveBlocks = async () => {
    setBlocksSaving(true);
    try {
      await api.reorderHomepage(homepageBlocks);
      alert('چینش بلوک‌های صفحه اصلی با موفقیت ذخیره شد.');
    } finally {
      setBlocksSaving(false);
    }
  };

  const handleResetBlocks = async () => {
    if (!confirm('آیا از بازنشانی چینش بلوک‌ها به حالت پیش‌فرض اطمینان دارید؟')) return;
    const res = await api.resetHomepage();
    setHomepageBlocks(res);
  };

  if (loading) {
    return <div className="p-12 text-center text-ui-text-muted font-bold">در حال بارگذاری داشبورد...</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="تعداد کل بازیکنان"
          value={stats?.totalPlayers || 0}
          icon={<Users size={22} />}
        />
        <StatCard
          label="نشست‌های پیش‌رو"
          value={stats?.upcomingSessions || 0}
          icon={<Calendar size={22} className="text-blue-500" />}
        />
        <StatCard
          label="رزروهای پرداخت‌شده"
          value={stats?.paidReservations || 0}
          icon={<CheckCircle2 size={22} className="text-emerald-500" />}
        />
        <StatCard
          label="مجموع درآمدهای آنلاین"
          value={formatTomans(stats?.totalRevenue || 0)}
          icon={<DollarSign size={22} className="text-amber-500" />}
        />
        <StatCard
          label="تعداد مقالات آموزش"
          value={stats?.tutorialsCount || 0}
          icon={<BookOpen size={22} className="text-purple-500" />}
        />
      </div>

      {/* Homepage Layout Builder (China-ye Khaneh) */}
      <div className="bg-ui-surface rounded-3xl border-1.5 border-ui-border-default shadow-hard-md p-6 sm:p-8 flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b-1.5 border-ui-border-subtle">
          <div>
            <h2 className="text-h2 font-black text-ui-text-primary">مدیریت و چینش بلوک‌های صفحه اصلی</h2>
            <p className="text-body-sm text-ui-text-muted">
              با کلیدهای بالا/پایین ترتیب نمایش بلوک‌ها را تنظیم کرده و با کلیک روی آیکون چشم نمایش را خاموش/روشن کنید.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleResetBlocks}>
              <RotateCcw size={15} />
              <span>بازنشانی به پیش‌فرض</span>
            </Button>
            <Button variant="persona" size="sm" onClick={handleSaveBlocks} isLoading={blocksSaving}>
              ذخیره تغییرات چینش
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {homepageBlocks.map((block, idx) => (
            <div
              key={block.blockKey}
              className={`p-4 rounded-xl border-1.5 flex items-center justify-between transition-all ${
                block.isVisible
                  ? 'bg-ui-surface border-ui-border-default shadow-hard-xs'
                  : 'bg-ui-surface-sunken border-ui-border-subtle opacity-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-ui-surface-sunken border border-ui-border-default flex items-center justify-center font-black text-caption">
                  {toPersianDigits(idx + 1)}
                </span>
                <span className="font-bold text-body-sm text-ui-text-primary">{block.title}</span>
                <span className="text-caption text-ui-text-muted font-mono dir-ltr">
                  ({block.blockKey})
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Visibility Toggle */}
                <button
                  type="button"
                  onClick={() => handleToggleBlockVisibility(idx)}
                  className={`p-2 rounded-lg border transition-colors ${
                    block.isVisible
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-gray-100 text-gray-500 border-gray-300'
                  }`}
                  title={block.isVisible ? 'مخفی کردن' : 'نمایش در سایت'}
                >
                  {block.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>

                {/* Move Up */}
                <button
                  type="button"
                  onClick={() => handleMoveBlock(idx, 'up')}
                  disabled={idx === 0}
                  className="p-2 rounded-lg border border-ui-border-default bg-ui-surface-sunken hover:border-ui-text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                  title="انتقال به بالا"
                >
                  <ArrowUp size={16} />
                </button>

                {/* Move Down */}
                <button
                  type="button"
                  onClick={() => handleMoveBlock(idx, 'down')}
                  disabled={idx === homepageBlocks.length - 1}
                  className="p-2 rounded-lg border border-ui-border-default bg-ui-surface-sunken hover:border-ui-text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                  title="انتقال به پایین"
                >
                  <ArrowDown size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Audit Activity */}
      <div className="bg-ui-surface rounded-3xl border-1.5 border-ui-border-default shadow-hard-md p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2 font-bold text-title text-ui-text-primary border-b-1.5 border-ui-border-subtle pb-3">
          <FileText size={18} className="text-[var(--theme-primary)]" />
          <span>آخرین فعالیت‌های ثبت شده در لاگ سیستم</span>
        </div>

        <div className="divide-y divide-ui-border-subtle">
          {stats?.recentLogs?.map((log: any) => (
            <div key={log.id} className="py-3 flex items-center justify-between text-caption">
              <div className="flex items-center gap-2">
                <span className="font-black px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-300">
                  {log.action}
                </span>
                <span className="font-medium text-ui-text-primary">{log.details}</span>
              </div>
              <span className="text-ui-text-muted">{formatShamsiDate(log.createdAt)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
