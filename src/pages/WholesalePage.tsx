import React, { useState } from 'react';
import { 
  Building2, 
  Calculator, 
  Send, 
  CheckCircle2, 
  Truck, 
  Layers, 
  FileText, 
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { CustomerType } from '../types';

export const WholesalePage: React.FC<{ onAskAI: (initialPrompt: string) => void }> = ({ onAskAI }) => {
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    phone: '',
    email: '',
    customerType: 'hotel' as CustomerType,
    estimatedVolume: '5x 20L Jerrycans / Month',
    interestProduct: 'Isuku Green Gleam & Lime Dishwashing',
    notes: ''
  });

  const [calcJerrycans, setCalcJerrycans] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Volume calculator math
  const retailPricePer20L = 36000;
  let wholesaleDiscountPercent = 10;
  if (calcJerrycans >= 10) wholesaleDiscountPercent = 20;
  else if (calcJerrycans >= 5) wholesaleDiscountPercent = 15;

  const unitWholesalePrice = Math.round(retailPricePer20L * (1 - wholesaleDiscountPercent / 100));
  const totalWholesale = unitWholesalePrice * calcJerrycans;
  const totalRetail = retailPricePer20L * calcJerrycans;
  const totalSavings = totalRetail - totalWholesale;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'wholesale_form'
        })
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error('Failed to submit wholesale inquiry', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header Banner */}
      <div className="bg-emerald-950 text-white p-8 sm:p-12 rounded-3xl border border-emerald-900 shadow-md">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Building2 className="w-4 h-4" />
            <span>Commercial Supply & Institutional Distribution</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading">
            B2B Wholesale Liquid Soap Supply
          </h1>
          <p className="text-sm sm:text-base text-emerald-200/90 leading-relaxed">
            Direct-from-factory liquid soap solutions engineered for hotels, restaurants, schools, universities, medical centers, cleaning contractors, and regional wholesalers across Rwanda.
          </p>
          <div className="flex flex-wrap gap-4 pt-2 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Free Kigali Scheduled Dispatch
            </div>
            <div className="flex items-center gap-1.5 text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Formal Commercial Invoices & Tax Receipts
            </div>
            <div className="flex items-center gap-1.5 text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Quality Batch Certificates
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Section: Interactive Volume Calculator & Wholesale Inquiry Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Calculator & Tiers (Cols 1-6) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-700" />
                <h2 className="text-base font-bold text-slate-900 font-heading">
                  Interactive Bulk Savings Calculator
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded">
                20L Commercial Jerrycans
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Estimate your monthly facility savings on 20L heavy-duty jerrycans based on our tiered manufacturing volume discounts.
            </p>

            {/* Slider / Counter */}
            <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">Estimated Monthly Units:</span>
                <span className="font-mono-nums font-bold text-base text-slate-900">{calcJerrycans} Jerrycans (20L)</span>
              </div>
              <input
                type="range"
                min={2}
                max={50}
                value={calcJerrycans}
                onChange={(e) => setCalcJerrycans(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono-nums">
                <span>2 units (Min Tier)</span>
                <span>25 units</span>
                <span>50+ units (Custom Contract)</span>
              </div>
            </div>

            {/* Breakdown Card */}
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Retail List Value:</span>
                <span className="font-mono-nums line-through">{totalRetail.toLocaleString()} RWF</span>
              </div>
              <div className="flex justify-between text-emerald-800 font-semibold">
                <span>Wholesale Tier Discount ({wholesaleDiscountPercent}% OFF):</span>
                <span className="font-mono-nums">-{totalSavings.toLocaleString()} RWF</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Unit Price per 20L Jerrycan:</span>
                <span className="font-mono-nums font-bold text-slate-900">{unitWholesalePrice.toLocaleString()} RWF</span>
              </div>
              <div className="pt-2 border-t border-emerald-200 flex justify-between text-sm font-bold text-emerald-950">
                <span>Estimated Bulk Order Total:</span>
                <span className="font-mono-nums text-base">{totalWholesale.toLocaleString()} RWF</span>
              </div>
            </div>

            <button
              onClick={() => onAskAI(`I would like to place a wholesale order for ${calcJerrycans} 20L jerrycans. Can you give me an official price breakdown?`)}
              className="w-full py-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              Quote This Volume with AI Sales Agent
            </button>
          </div>

          {/* Tier Table */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading">
              Official Volume Discount Tiers
            </h3>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-[11px]">
                    <th className="py-2 font-semibold">Tier</th>
                    <th className="py-2 font-semibold">Quantity</th>
                    <th className="py-2 font-semibold">Discount</th>
                    <th className="py-2 font-semibold">Kigali Delivery</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono-nums text-slate-700">
                  <tr>
                    <td className="py-2.5 font-medium text-slate-900">Standard Wholesale</td>
                    <td className="py-2.5">2 – 4 Jerrycans</td>
                    <td className="py-2.5 font-semibold text-emerald-800">10% Off</td>
                    <td className="py-2.5 text-slate-600">Complimentary</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-medium text-slate-900">Commercial Facility</td>
                    <td className="py-2.5">5 – 9 Jerrycans</td>
                    <td className="py-2.5 font-semibold text-emerald-800">15% Off</td>
                    <td className="py-2.5 text-slate-600">Complimentary</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-medium text-slate-900">Enterprise & Institutional</td>
                    <td className="py-2.5">10+ Jerrycans</td>
                    <td className="py-2.5 font-semibold text-emerald-800">20% Off</td>
                    <td className="py-2.5 text-slate-600">Complimentary Priority</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column: Wholesale Inquiry Form (Cols 7-12) */}
        <div className="lg:col-span-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div>
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                Corporate & Institutional Registration
              </span>
              <h2 className="text-xl font-bold text-slate-900 font-heading">
                Request a Custom Commercial Quotation
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Fill in your company details. Our commercial sales manager will review your required volume and provide an official pro-forma rate card within 2 business hours.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 text-center bg-emerald-50 rounded-xl border border-emerald-200 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
                <h3 className="text-base font-bold text-emerald-950 font-heading">
                  Inquiry Received!
                </h3>
                <p className="text-xs text-emerald-900 leading-relaxed max-w-sm mx-auto">
                  Thank you, {formData.name}. Our commercial sales desk has received your request for {formData.organization || 'your organization'}. A sales representative will call you on {formData.phone} shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-3 px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jean-Paul Mugisha"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Business or Institution Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hôtel des Mille Collines"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number (Rwanda) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+250 78... / 078..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="purchasing@company.rw"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Facility / Customer Type
                    </label>
                    <select
                      value={formData.customerType}
                      onChange={(e: any) => setFormData({ ...formData, customerType: e.target.value })}
                      className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700 focus:bg-white cursor-pointer"
                    >
                      <option value="hotel">Hotel & Hospitality</option>
                      <option value="restaurant">Restaurant / Commercial Kitchen</option>
                      <option value="school">School / University Campus</option>
                      <option value="hospital">Hospital / Healthcare Clinic</option>
                      <option value="cleaning_company">Professional Cleaning Company</option>
                      <option value="wholesaler">Wholesale Distributor / Retailer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Estimated Volume
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 10x 20L jerrycans per month"
                      value={formData.estimatedVolume}
                      onChange={(e) => setFormData({ ...formData, estimatedVolume: e.target.value })}
                      className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Products of Interest
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 20L Dishwashing, 20L Floor Cleaner, Handwash Refills"
                    value={formData.interestProduct}
                    onChange={(e) => setFormData({ ...formData, interestProduct: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Additional Notes / Delivery Address in Rwanda
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Specify delivery district (e.g. Gasabo, Kicukiro) or recurring weekly requirement..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700 focus:bg-white"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    {isSubmitting ? 'Sending Request...' : 'Submit Commercial Quote Request'}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-1">
                  <span>Or contact commercial sales directly via</span>
                  <a
                    href="https://wa.me/250788123456?text=Hello%20Isuku%20Pure%20Sales%2C%20I%20am%20inquiring%20about%20a%20B2B%20commercial%20quotation."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-emerald-800 hover:underline flex items-center gap-1"
                  >
                    <MessageSquare className="w-3 h-3 text-emerald-700" />
                    WhatsApp (+250 788 123 456)
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
