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
  FileText,
  Save,
  Layers,
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
    return (
      <div className="p-12 text-center text-[#94A3B8] font-bold">
        در حال بارگذاری داشبورد مدیریت...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 sm:gap-8 w-full max-w-full overflow-hidden">
      {/* KPI Cards: 2-cols on mobile, 5 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard
          label="کل بازیکنان"
          value={stats?.totalPlayers || 0}
          icon={<Users size={20} className="text-[#59BBAF]" />}
        />
        <StatCard
          label="نشست‌های باز"
          value={stats?.upcomingSessions || 0}
          icon={<Calendar size={20} className="text-blue-400" />}
        />
        <StatCard
          label="رزروهای تاییدشده"
          value={stats?.paidReservations || 0}
          icon={<CheckCircle2 size={20} className="text-emerald-400" />}
        />
        <StatCard
          label="مجموع درآمدهای کلاب"
          value={formatTomans(stats?.totalRevenue || 0)}
          icon={<DollarSign size={20} className="text-amber-400" />}
        />
        <div className="col-span-2 sm:col-span-1 lg:col-span-1">
          <StatCard
            label="مقالات و آموزش‌ها"
            value={stats?.tutorialsCount || 0}
            icon={<BookOpen size={20} className="text-purple-400" />}
          />
        </div>
      </div>

      {/* Homepage Layout Builder */}
      <div className="bg-[#0E1420] rounded-2xl sm:rounded-3xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] p-4 sm:p-7 flex flex-col gap-5 w-full max-w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <Layers size={18} className="text-[#59BBAF]" />
              <span>مدیریت و چینش بلوک‌های صفحه اصلی</span>
            </h2>
            <p className="text-body-sm text-[#94A3B8]">
              با کلیدهای بالا/پایین ترتیب نمایش بلوک‌ها را تنظیم کرده و وضعیت نمایش را تغییر دهید.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetBlocks}
              className="flex-1 sm:flex-none justify-center"
            >
              <RotateCcw size={14} />
              <span>پیش‌فرض</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveBlocks}
              isLoading={blocksSaving}
              className="flex-1 sm:flex-none justify-center"
            >
              <Save size={14} />
              <span>ذخیره چینش</span>
            </Button>
          </div>
        </div>

        {/* Blocks List */}
        <div className="flex flex-col gap-2.5">
          {homepageBlocks.map((block, idx) => (
            <div
              key={block.blockKey}
              className={`p-3 sm:p-4 rounded-xl border-1.5 flex items-center justify-between gap-3 transition-all ${
                block.isVisible
                  ? 'bg-[#0A0E17] border-[#1E293B] shadow-sm'
                  : 'bg-[#0A0E17]/50 border-[#1E293B]/50 opacity-50'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#141C2C] border border-[#1E293B] flex items-center justify-center font-black text-caption text-[#59BBAF] shrink-0">
                  {toPersianDigits(idx + 1)}
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-caption sm:text-body-sm text-white truncate">
                    {block.title}
                  </span>
                  <span className="text-[10px] text-[#64748B] font-mono dir-ltr truncate">
                    {block.blockKey}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {/* Visibility Toggle */}
                <button
                  type="button"
                  onClick={() => handleToggleBlockVisibility(idx)}
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-colors ${
                    block.isVisible
                      ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40 hover:bg-emerald-900/60'
                      : 'bg-gray-800 text-gray-400 border-gray-700'
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
                  className="w-9 h-9 rounded-lg border border-[#1E293B] bg-[#141C2C] text-[#94A3B8] hover:text-white hover:border-[#59BBAF] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                  title="انتقال به بالا"
                >
                  <ArrowUp size={16} />
                </button>

                {/* Move Down */}
                <button
                  type="button"
                  onClick={() => handleMoveBlock(idx, 'down')}
                  disabled={idx === homepageBlocks.length - 1}
                  className="w-9 h-9 rounded-lg border border-[#1E293B] bg-[#141C2C] text-[#94A3B8] hover:text-white hover:border-[#59BBAF] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
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
      <div className="bg-[#0E1420] rounded-2xl sm:rounded-3xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] p-4 sm:p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2 font-bold text-body-sm sm:text-title text-white border-b border-[#1E293B] pb-3">
          <FileText size={18} className="text-[#59BBAF]" />
          <span>آخرین فعالیت‌های ثبت شده در لاگ سیستم</span>
        </div>

        <div className="divide-y divide-[#1E293B]">
          {stats?.recentLogs && stats.recentLogs.length > 0 ? (
            stats.recentLogs.map((log: any) => (
              <div
                key={log.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-caption"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-black px-2 py-0.5 rounded bg-blue-950/60 text-blue-400 border border-blue-500/40 shrink-0">
                    {log.action}
                  </span>
                  <span className="font-medium text-[#94A3B8] truncate">{log.details}</span>
                </div>
                <span className="text-[#64748B] text-[11px] shrink-0">
                  {formatShamsiDate(log.createdAt)}
                </span>
              </div>
            ))
          ) : (
            <div className="py-4 text-center text-caption text-[#64748B]">
              هنوز فعالیتی در لاگ سیستم ثبت نشده است.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
