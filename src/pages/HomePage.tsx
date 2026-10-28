import React, { useState } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  Layers, 
  Factory, 
  Building2, 
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';

interface HomePageProps {
  products: Product[];
  categories: Category[];
  navigate: (route: string, param?: string) => void;
  onAskAI: (product?: Product | null, initialPrompt?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ 
  products, 
  categories, 
  navigate, 
  onAskAI 
}) => {
  const { t } = useLanguage();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const featuredProducts = products.filter(p => p.featured);

  const faqs = [
    {
      q: 'What packaging sizes do you supply for homes and businesses?',
      a: 'We manufacture retail sizes (500 ml pump bottle and 1 L bottle) as well as commercial high-efficiency refill containers (5 L jugs and reinforced 20 L stacking jerrycans designed for hotels, restaurants, schools, and hospitals).'
    },
    {
      q: 'How does delivery work in Kigali and across Rwanda?',
      a: 'We provide free delivery across all Kigali districts (Gasabo, Kicukiro, Nyarugenge) for orders of 30,000 RWF or more. For smaller orders, our standard Kigali delivery fee is 2,000 RWF. We also coordinate reliable scheduled dispatch across Rwanda via regional transport logistics.'
    },
    {
      q: 'Do you offer special wholesale prices for bulk buyers?',
      a: 'Yes! Commercial clients (cleaning companies, restaurants, schools, and wholesalers) receive automatic volume tier pricing starting from 2+ units on 20L jerrycans and 4+ units on 5L containers. You can also request a customized monthly contract via our Wholesale B2B portal.'
    },
    {
      q: 'What payment methods are supported?',
      a: 'We support Payment on Delivery (Cash or Mobile Money upon inspection), MTN Mobile Money, Airtel Money, and direct bank transfers for corporate accounts.'
    },
    {
      q: 'Where is your factory located in Rwanda?',
      a: 'Our modern manufacturing facility is located in the Kigali Special Economic Zone (KSEZ), Masoro, Gasabo District. Visitors and commercial partners are welcome by appointment.'
    }
  ];

  const testimonials = [
    {
      quote: 'Switching our restaurant kitchen to Isuku Lime 20L jerrycans cut our monthly dishwashing detergent costs by 22% while completely eliminating oily film on our glassware.',
      author: 'Jean-Paul Mugisha',
      role: 'Operations & Kitchen Manager',
      org: 'Kigali Heights Bistro'
    },
    {
      quote: 'We supply Isuku Antibacterial Hand Soap across 14 campus washrooms. It foams richly, is gentle on students’ skin, and the 20L refills make refilling dispensers effortless.',
      author: 'Clarisse Mukamana',
      role: 'Facilities Director',
      org: 'Green Hills Academy'
    },
    {
      quote: 'Their customer service is outstanding. We ordered at 9:00 AM on WhatsApp and the 6 jerrycans were delivered to our hotel in Kicukiro by 1:30 PM with receipt in hand.',
      author: 'David Kayitare',
      role: 'Housekeeping Supervisor',
      org: 'Serene City Hotel'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Value Proposition & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Unboxed natural editorial kicker */}
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 tracking-wide">
                <span>Made in Rwanda</span>
                <span aria-hidden="true" className="text-emerald-400">·</span>
                <span>Kigali Special Economic Zone</span>
                <span aria-hidden="true" className="text-emerald-400">·</span>
                <span>Eco-Friendly Formula</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 font-heading leading-tight text-balance">
                Powerful Cleaning. Lasting Freshness. Exceptional Value.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Discover Rwandan-manufactured liquid soap solutions engineered for spotless dishes, gentle hand hygiene, vibrant laundry, and heavy-duty institutional floor degreasing.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => navigate('products')}
                  className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {t.shopProducts} <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate('wholesale')}
                  className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {t.requestWholesale}
                </button>

                <button
                  onClick={() => onAskAI(null, "I need product and pricing recommendations for my facility")}
                  className="px-4 py-3.5 text-emerald-900 bg-emerald-100/70 hover:bg-emerald-100 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  Ask AI Sales Assistant
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-slate-200/80 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Biodegradable & pH-balanced</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Free delivery over 30K RWF</span>
                </div>
                <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Pay on Delivery in Kigali</span>
                </div>
              </div>

            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-lg bg-white">
                <img
                  src="/src/assets/images/hero_liquid_soap_lineup_1793189044482.jpg"
                  alt="Isuku Pure Liquid Soap Lineup - 500ml, 1L, 5L, and 20L packaging"
                  className="w-full h-auto object-cover aspect-16/10"
                  referrerPolicy="no-referrer"
                />
                <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold block">
                      Commercial & Household Refills
                    </span>
                    <span className="text-sm font-bold font-heading">
                      From 500 ml to 20 Liter Jerrycans
                    </span>
                  </div>
                  <button
                    onClick={() => navigate('wholesale')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-md transition-colors"
                  >
                    View Rates
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Product Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
              Manufacturing Categories
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
              {t.categoriesTitle}
            </h2>
          </div>
          <button 
            onClick={() => navigate('products')}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 mt-2 md:mt-0 cursor-pointer"
          >
            Explore all categories <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate('products')}
              className="p-5 rounded-xl border border-slate-200/90 bg-white hover:border-emerald-600 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold mb-3 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 font-heading group-hover:text-emerald-800 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {cat.description}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-800">
                <span>View Products</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
              Top Selling Formulas
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
              {t.featuredTitle}
            </h2>
          </div>
          <button 
            onClick={() => navigate('products')}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 mt-2 sm:mt-0 cursor-pointer"
          >
            View Complete Catalog ({products.length} Products) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={(p) => navigate('product-detail', p.slug)}
              onAskAI={(p) => onAskAI(p, `Tell me more about ${p.name} and recommend the best size for my needs.`)}
            />
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-slate-900 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2">
              Factory Integrity & Quality Assurance
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading">
              {t.whyUsTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 leading-relaxed">
              We engineer our liquid soaps locally in Kigali to deliver optimal cleaning power at prices that make economic sense for both families and commercial organizations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-900/60 text-emerald-400 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-heading">{t.why1Title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{t.why1Desc}</p>
            </div>

            <div className="p-6 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-900/60 text-emerald-400 flex items-center justify-center font-bold">
                <Factory className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-heading">{t.why2Title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{t.why2Desc}</p>
            </div>

            <div className="p-6 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-900/60 text-emerald-400 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-heading">{t.why3Title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{t.why3Desc}</p>
            </div>

            <div className="p-6 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-900/60 text-emerald-400 flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-heading">{t.why4Title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{t.why4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
            Simple 3-Step Ordering
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
            {t.howItWorks}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-3 p-6 rounded-xl bg-white border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 font-bold text-base flex items-center justify-center mx-auto">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900 font-heading">{t.step1Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t.step1Desc}</p>
          </div>

          <div className="text-center space-y-3 p-6 rounded-xl bg-white border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 font-bold text-base flex items-center justify-center mx-auto">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900 font-heading">{t.step2Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t.step2Desc}</p>
          </div>

          <div className="text-center space-y-3 p-6 rounded-xl bg-white border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 font-bold text-base flex items-center justify-center mx-auto">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900 font-heading">{t.step3Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t.step3Desc}</p>
          </div>
        </div>
      </section>

      {/* B2B & Wholesale Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-emerald-950 text-white p-8 sm:p-12 border border-emerald-900/80 relative overflow-hidden">
          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Building2 className="w-4 h-4" />
              <span>For Hotels, Restaurants, Schools & Cleaning Contractors</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading">
              Need Regular Bulk Supply of 20L Jerrycans?
            </h2>
            <p className="text-sm text-emerald-200/90 leading-relaxed">
              We provide volume-based discounts up to 20% off retail prices, dedicated credit terms for qualified institutions, and scheduled recurring weekly delivery across Kigali.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => navigate('wholesale')}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Access Wholesale Portal
              </button>
              <a
                href="https://wa.me/250788123456?text=Hello%20Isuku%20Pure%2C%20I%20would%20like%20to%20inquire%20about%20a%20commercial%20B2B%20supply%20agreement"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Inquire on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
            Proven Industry Feedback
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
            {t.testimonialsTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-xl border border-slate-200 bg-white flex flex-col justify-between shadow-xs"
            >
              <p className="text-xs text-slate-600 leading-relaxed italic mb-4">
                "{item.quote}"
              </p>
              <div className="pt-3 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-900">{item.author}</div>
                <div className="text-[11px] text-slate-500">{item.role} · <span className="text-emerald-800 font-medium">{item.org}</span></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
            Help & Guidance
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
            {t.faqsTitle}
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <HelpCircle className="w-4 h-4 text-emerald-700 shrink-0" />
              </button>
              {activeFaq === idx && (
                <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
