import React from 'react';
import { Factory, ShieldCheck, Heart, Leaf, MapPin, Award } from 'lucide-react';

export const AboutPage: React.FC<{ navigate: (route: string) => void }> = ({ navigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Intro */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
          Our Kigali Manufacturing Journey
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
          High-Standard Cleaning Formulations, Proudly Made in Rwanda
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Founded in Kigali with a vision to deliver premium, reliable, and skin-friendly liquid soap alternatives to imported detergents, Isuku Pure Cleaners manufactures concentrated cleaning chemistry for Rwandan homes, institutions, and hospitality leaders.
        </p>
      </div>

      {/* Facility Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
            <Factory className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-heading">Kigali SEZ Production</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Located in Masoro, Gasabo District, our blending and automated filling lines process tens of thousands of liters weekly under strict quality batch monitoring.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
            <Leaf className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-heading">Biodegradable Chemistry</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We avoid harsh phosphates, non-biodegradable fillers, and synthetic abrasives. Our formulas break down naturally in drainage ecosystems without harming soil or municipal water tables.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-heading">Quality Batch Assurance</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every batch undergoes active-matter density testing, viscosity checks, and pH balance verification (neutral 6.5–7.5 for hand soaps) to guarantee consistent performance.
          </p>
        </div>
      </div>

      {/* Company Details & Tour CTA */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <h2 className="text-2xl font-bold font-heading">Commercial Partner Visits</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            We regularly host procurement officers from hotels, hospitals, and educational facilities to inspect our production standards and discuss custom batch contracts.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400 pt-1">
            <MapPin className="w-4 h-4 shrink-0" />
            <span>Kigali Special Economic Zone (KSEZ), Masoro, Gasabo</span>
          </div>
        </div>
        <button
          onClick={() => navigate('wholesale')}
          className="px-6 py-3 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shrink-0"
        >
          Book Facility Inquiry
        </button>
      </div>

    </div>
  );
};
