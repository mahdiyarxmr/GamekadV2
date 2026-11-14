import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Settings, Save, CheckCircle2 } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({
    tagline: '',
    address: '',
    phone: '',
    hours: '',
    phoneRequired: 'false',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    api.getAdminSettings().then((res) => {
      setSettings((prev) => ({ ...prev, ...res }));
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedMessage(false);
    try {
      await api.updateAdminSettings(settings);
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 4000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-[#94A3B8] font-bold">
        در حال بارگذاری تنظیمات کلاب...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 sm:gap-6 max-w-2xl w-full">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white">تنظیمات عمومی گیم‌کاد و رکاد</h1>
        <p className="text-body-sm text-[#94A3B8]">
          مدیریت آدرس، تلفن تماس باشگاه، ساعات کاری و شعار اصلی سامانه.
        </p>
      </div>

      <div className="bg-[#0E1420] rounded-2xl sm:rounded-3xl border-1.5 border-[#1E293B] shadow-[2px_2px_0_#000000] p-4 sm:p-7 flex flex-col gap-4">
        {savedMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-caption font-bold text-emerald-300 flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>تنظیمات باشگاه با موفقیت ذخیره شد.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Input
            label="شعار و تگ‌لاین سایت"
            value={settings.tagline}
            onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
            required
          />

          <Input
            label="نشانی فیزیکی باشگاه در مشهد"
            value={settings.address}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Input
              label="تلفن پشتیبانی"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              required
            />
            <Input
              label="ساعات کاری باشگاه"
              value={settings.hours}
              onChange={(e) => setSettings({ ...settings, hours: e.target.value })}
              required
            />
          </div>

          <div className="pt-2">
            <Button
              variant="primary"
              size="lg"
              type="submit"
              isLoading={saving}
              className="w-full sm:w-auto justify-center"
            >
              <Save size={18} />
              <span>ذخیره تنظیمات سایت</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
