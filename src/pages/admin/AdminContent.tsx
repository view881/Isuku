import React, { useState, useEffect } from 'react';
import { Save, Check, Building2, Phone, Mail, MapPin, Truck, AlertCircle } from 'lucide-react';
import { WebsiteContent } from '../../types';

export const AdminContent: React.FC = () => {
  const [content, setContent] = useState<WebsiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        if (data.content) setContent(data.content);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;
    try {
      await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      });
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !content) {
    return <div className="text-xs text-slate-400 py-10">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-heading">
            Website Content & Factory Settings
          </h1>
          <p className="text-xs text-slate-500">
            Update marketing banners, Kigali delivery thresholds, and company contact details without modifying code.
          </p>
        </div>
      </div>

      {savedNotice && (
        <div className="p-3 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-700" />
          Settings updated successfully. All visitor pages reflect changes immediately.
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6 text-xs">
        
        {/* Promotional Bar */}
        <div className="space-y-3 pb-6 border-b border-slate-200">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading">
            Top Promotional Announcement
          </h3>
          <div>
            <label className="block text-slate-700 font-medium mb-1">Banner Announcement Text</label>
            <input
              type="text"
              value={content.announcementText}
              onChange={(e) => setContent({ ...content, announcementText: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700"
            />
          </div>
          <div>
            <label className="block text-slate-700 font-medium mb-1">Free Delivery Threshold (RWF)</label>
            <input
              type="number"
              value={content.freeDeliveryThresholdRwf}
              onChange={(e) => setContent({ ...content, freeDeliveryThresholdRwf: parseInt(e.target.value, 10) || 0 })}
              className="w-48 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono-nums focus:outline-none focus:border-emerald-700"
            />
            <span className="text-[11px] text-slate-400 ml-2">Default: 30,000 RWF for free delivery in Kigali</span>
          </div>
        </div>

        {/* Hero Copy */}
        <div className="space-y-3 pb-6 border-b border-slate-200">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading">
            Homepage Hero Headline
          </h3>
          <div>
            <label className="block text-slate-700 font-medium mb-1">Main Headline</label>
            <input
              type="text"
              value={content.heroHeadline}
              onChange={(e) => setContent({ ...content, heroHeadline: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700"
            />
          </div>
          <div>
            <label className="block text-slate-700 font-medium mb-1">Subheadline</label>
            <textarea
              rows={2}
              value={content.heroSubheadline}
              onChange={(e) => setContent({ ...content, heroSubheadline: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700"
            />
          </div>
        </div>

        {/* Company & Support Information */}
        <div className="space-y-3 pb-6 border-b border-slate-200">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading">
            Factory Contact Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Company Legal Name</label>
              <input
                type="text"
                value={content.companyName}
                onChange={(e) => setContent({ ...content, companyName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">WhatsApp Order Line</label>
              <input
                type="text"
                value={content.whatsapp}
                onChange={(e) => setContent({ ...content, whatsapp: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700 font-mono-nums"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Office Telephone</label>
              <input
                type="text"
                value={content.phone}
                onChange={(e) => setContent({ ...content, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700 font-mono-nums"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Support Email</label>
              <input
                type="email"
                value={content.email}
                onChange={(e) => setContent({ ...content, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Manufacturing Address (Rwanda)</label>
            <input
              type="text"
              value={content.companyAddress}
              onChange={(e) => setContent({ ...content, companyAddress: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Business Operating Hours</label>
            <input
              type="text"
              value={content.businessHours}
              onChange={(e) => setContent({ ...content, businessHours: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Content Changes
          </button>
        </div>

      </form>
    </div>
  );
};
