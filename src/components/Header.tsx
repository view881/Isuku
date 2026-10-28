import React, { useState } from 'react';
import { ShoppingBag, Globe, Menu, X, Shield, PhoneCall } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Language } from '../types';

interface HeaderProps {
  currentRoute: string;
  navigate: (route: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, navigate }) => {
  const { language, setLanguage, t } = useLanguage();
  const { totalItems, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  const navLinks = [
    { label: t.navHome, route: 'home' },
    { label: t.navProducts, route: 'products' },
    { label: t.navWholesale, route: 'wholesale' },
    { label: t.navAbout, route: 'about' },
    { label: t.navOrderLookup, route: 'track' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Announcement Bar */}
      {showAnnouncement && (
        <div className="bg-emerald-950 text-emerald-100 text-xs px-4 py-2 flex items-center justify-between border-b border-emerald-900/60">
          <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-hidden text-center truncate">
            <span className="font-medium text-emerald-300">Rwanda Factory Direct</span>
            <span aria-hidden="true" className="text-emerald-500">·</span>
            <span className="truncate">{t.announcement}</span>
          </div>
          <button 
            onClick={() => setShowAnnouncement(false)}
            className="text-emerald-400 hover:text-white p-0.5 ml-2 shrink-0 transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Navigation - Strict 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          
          {/* Zone 1: Brand Wordmark (Single Text Element) */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => { navigate('home'); setMobileMenuOpen(false); }}
              className="group text-left flex items-center gap-2.5 cursor-pointer focus:outline-none"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-emerald-800 transition-colors">
                I
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 font-heading whitespace-nowrap block">
                  Isuku Pure
                </span>
                <span className="text-[10px] tracking-wider text-emerald-800 font-medium block uppercase -mt-1">
                  Cleaners Rwanda
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 4-5 Concise Single-Line Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            {navLinks.map((link) => {
              const active = currentRoute === link.route;
              return (
                <button
                  key={link.route}
                  onClick={() => navigate(link.route)}
                  className={`cursor-pointer whitespace-nowrap shrink-0 py-1 border-b-2 transition-all ${
                    active 
                      ? 'border-emerald-600 text-emerald-800 font-semibold' 
                      : 'border-transparent hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions (Language Switcher, Cart, and 1 Primary CTA Button) */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Language Selector */}
            <div className="relative inline-flex items-center text-xs font-medium text-slate-700 bg-slate-100 rounded-md p-1 border border-slate-200">
              <Globe className="w-3.5 h-3.5 text-slate-500 ml-1 mr-1 shrink-0" />
              {(['en', 'rw', 'fr'] as Language[]).map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-semibold cursor-pointer uppercase transition-colors ${
                    language === lang 
                      ? 'bg-white text-emerald-800 shadow-xs' 
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-lg text-slate-700 hover:text-emerald-800 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center font-mono-nums shadow-xs">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Admin shortcut if logged in or small discreet link */}
            {user ? (
              <button
                onClick={() => navigate('admin')}
                className="hidden lg:flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-700" />
                <span className="truncate max-w-[90px]">{user.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('admin')}
                className="hidden lg:inline-block text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
                title="Staff & Management Login"
              >
                {t.admin}
              </button>
            )}

            {/* Primary Action Button */}
            <button
              onClick={() => navigate('products')}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t.orderNow}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.route}
                onClick={() => {
                  navigate(link.route);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentRoute === link.route 
                    ? 'bg-emerald-50 text-emerald-800 font-semibold' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={() => {
                navigate('admin');
                setMobileMenuOpen(false);
              }}
              className="text-xs font-medium text-slate-600 flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              Staff Dashboard
            </button>
            <a
              href="tel:+250788123456"
              className="text-xs font-semibold text-emerald-700 flex items-center gap-1"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              +250 788 123 456
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
