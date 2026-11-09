import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Settings, Save } from 'lucide-react';

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

  useEffect(() => {
    api.getAdminSettings().then((res) => {
      setSettings((prev) => ({ ...prev, ...res }));
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateAdminSettings(settings);
      alert('تنظیمات سایت گیم‌کاد با موفقیت ذخیره شد.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-ui-text-muted font-bold">در حال بارگذاری تنظیمات...</div>;
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-h1 font-black text-ui-text-primary">تنظیمات عمومی گیم‌کاد و رکاد</h1>
        <p className="text-body-sm text-ui-text-secondary">
          مدیریت آدرس، تلفن تماس باشگاه، ساعات کاری و شعار اصلی سامانه.
        </p>
      </div>

      <div className="bg-ui-surface rounded-3xl border-1.5 border-ui-border-default shadow-hard-md p-6 sm:p-8">
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

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="تلفن پشتیبانی"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              required
            />
            <Input
              label="ساعات کاری"
              value={settings.hours}
              onChange={(e) => setSettings({ ...settings, hours: e.target.value })}
              required
            />
          </div>

          <div className="pt-2">
            <Button variant="persona" size="lg" type="submit" isLoading={saving}>
              <Save size={18} />
              <span>ذخیره تنظیمات سایت</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
