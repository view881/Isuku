import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  navigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand & Factory Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-base">
                I
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-heading">
                Isuku Pure Cleaners
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Rwanda's trusted manufacturer and wholesale distributor of high-foaming dishwashing liquids, antibacterial hand soaps, laundry detergents, and heavy-duty institutional surface degreasers.
            </p>
            <div className="pt-2 text-xs text-emerald-400 font-medium">
              Made with pride in Kigali Special Economic Zone (KSEZ), Masoro.
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Products
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => navigate('products')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Dishwashing Liquids
                </button>
              </li>
              <li>
                <button onClick={() => navigate('products')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Antibacterial Hand Soaps
                </button>
              </li>
              <li>
                <button onClick={() => navigate('products')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Liquid Laundry Detergents
                </button>
              </li>
              <li>
                <button onClick={() => navigate('products')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Commercial 20L Jerrycans
                </button>
              </li>
            </ul>
          </div>

          {/* Business & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Customer & B2B
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => navigate('wholesale')} className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1">
                  Wholesale Bulk Orders <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </button>
              </li>
              <li>
                <button onClick={() => navigate('track')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Order Tracking
                </button>
              </li>
              <li>
                <button onClick={() => navigate('about')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Quality Standards & Lab
                </button>
              </li>
              <li>
                <button onClick={() => navigate('delivery-returns')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Delivery & Returns Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('privacy')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Privacy Policy & Data Safety
                </button>
              </li>
              <li>
                <button onClick={() => navigate('terms')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Contact & Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Kigali Factory Office
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Kigali Special Economic Zone (KSEZ), Masoro, Gasabo, Rwanda</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>+250 788 123 456</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>sales@isukupure.rw</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Mon - Sat: 8:00 AM - 6:00 PM CAT</span>
              </div>
              <div className="pt-2">
                <a
                  href="https://wa.me/250788123456?text=Hello%20Isuku%20Pure%20Sales%20Team"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-800 hover:bg-emerald-700 text-white font-medium text-xs transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Isuku Pure Cleaners Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Currency: RWF (Rwandan Franc)</span>
            <span aria-hidden="true">·</span>
            <button onClick={() => navigate('admin')} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
              Staff Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
