import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Role, Scenario } from '../types';
import { FlipRoleCard } from '../components/ui/FlipRoleCard';
import { Shield, Search, BookOpen, Skull, Users, Sparkles } from 'lucide-react';
import { toPersianDigits } from '../utils/formatters';

export const RolesPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sideFilter, setSideFilter] = useState<'ALL' | 'CITIZEN' | 'MAFIA'>('ALL');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('ALL');

  useEffect(() => {
    Promise.all([api.getRoles(), api.getScenarios()])
      .then(([rolesRes, scenariosRes]) => {
        setRoles(rolesRes);
        setScenarios(scenariosRes);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredRoles = roles.filter((r) => {
    if (sideFilter !== 'ALL' && r.side !== sideFilter) return false;
    if (selectedScenarioId !== 'ALL' && r.scenarioId !== selectedScenarioId) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      const matchName = r.name.toLowerCase().includes(q);
      const matchDesc = r.description?.toLowerCase().includes(q);
      const matchAbil = r.abilities?.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchAbil) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-6 sm:gap-8 py-4 sm:py-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#59BBAF]/15 text-[#59BBAF] border border-[#59BBAF]/30 w-fit text-caption font-black">
            <Sparkles size={14} className="text-[#59BBAF]" />
            <span>دانشنامه و کارت‌های رسمی نقش‌های مافیا</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">کارت‌های ۳ بعدی نقش‌ها</h1>
          <p className="text-body-sm sm:text-body text-[#94A3B8]">
            شناخت توانایی‌ها، نوبت بیدار شدن در شب و ترفندهای تاکتیکی تمامی نقش‌های رسمی کلاب گیم‌کاد
          </p>
        </div>
      </div>

      {/* Scenario Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          type="button"
          onClick={() => setSelectedScenarioId('ALL')}
          className={`px-3.5 py-1.5 rounded-xl text-caption font-black border-1.5 transition-all shrink-0 ${
            selectedScenarioId === 'ALL'
              ? 'bg-[#59BBAF] text-[#080B11] border-black shadow-[2px_2px_0_#000000]'
              : 'bg-[#0E1420] text-[#94A3B8] border-[#1E293B] hover:text-white'
          }`}
        >
          همه سناریوها ({toPersianDigits(roles.length)})
        </button>

        {scenarios.map((sc) => {
          const count = roles.filter((r) => r.scenarioId === sc.id).length;
          return (
            <button
              key={sc.id}
              type="button"
              onClick={() => setSelectedScenarioId(sc.id)}
              className={`px-3.5 py-1.5 rounded-xl text-caption font-black border-1.5 transition-all shrink-0 ${
                selectedScenarioId === sc.id
                  ? 'bg-[#59BBAF] text-[#080B11] border-black shadow-[2px_2px_0_#000000]'
                  : 'bg-[#0E1420] text-[#94A3B8] border-[#1E293B] hover:text-white'
              }`}
            >
              {sc.title} ({toPersianDigits(count)})
            </button>
          );
        })}
      </div>

      {/* Search and Side Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0E1420] p-3 rounded-2xl border-1.5 border-[#1E293B]">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی نام نقش، ابیلیتی یا کلمه کلیدی (مثلاً بازپرس، زهر، هکر...)"
            className="w-full pr-10 pl-3 py-2 bg-[#080B11] rounded-xl border border-[#1E293B] text-white text-body-sm outline-none focus:border-[#59BBAF] transition-all"
          />
        </div>

        {/* Side filter pills */}
        <div className="flex items-center gap-1.5 shrink-0 bg-[#080B11] p-1 rounded-xl border border-[#1E293B]">
          <button
            type="button"
            onClick={() => setSideFilter('ALL')}
            className={`px-3 py-1.5 text-caption font-black rounded-lg transition-all ${
              sideFilter === 'ALL'
                ? 'bg-[#59BBAF] text-[#080B11]'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            همه سایدها
          </button>
          <button
            type="button"
            onClick={() => setSideFilter('CITIZEN')}
            className={`px-3 py-1.5 text-caption font-black rounded-lg transition-all ${
              sideFilter === 'CITIZEN'
                ? 'bg-emerald-500 text-black'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            شهروندان
          </button>
          <button
            type="button"
            onClick={() => setSideFilter('MAFIA')}
            className={`px-3 py-1.5 text-caption font-black rounded-lg transition-all ${
              sideFilter === 'MAFIA'
                ? 'bg-red-500 text-white'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            مافیا
          </button>
        </div>
      </div>

      {/* Grid of roles */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center text-[#64748B] font-bold">
          در حال بارگذاری دانشنامه نقش‌ها...
        </div>
      ) : filteredRoles.length === 0 ? (
        <div className="p-12 text-center bg-[#0E1420] rounded-2xl border-1.5 border-[#1E293B] flex flex-col items-center gap-3">
          <BookOpen size={36} className="text-[#64748B]" />
          <h3 className="text-title font-black text-white">نقشی با این مشخصات یافت نشد!</h3>
          <p className="text-body-sm text-[#94A3B8]">
            عبارت جستجو یا فیلترهای ساید و سناریو را تغییر دهید.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoles.map((role) => (
            <FlipRoleCard key={role.id} role={role} />
          ))}
        </div>
      )}
    </div>
  );
};
