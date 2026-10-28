import React from 'react';

interface LegalPageProps {
  type: 'privacy' | 'terms' | 'delivery-returns';
  navigate: (route: string) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ type, navigate }) => {
  if (type === 'privacy') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 text-slate-700 text-xs leading-relaxed">
        <h1 className="text-2xl font-bold text-slate-900 font-heading">Privacy Policy</h1>
        <p className="text-slate-500">Last updated: October 2026</p>
        <div className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <h2 className="text-sm font-bold text-slate-900">1. Information We Collect</h2>
          <p>
            When placing orders or requesting wholesale quotations, we collect essential delivery data including your full name, telephone number, email, business affiliation, and delivery address in Rwanda.
          </p>
          <h2 className="text-sm font-bold text-slate-900">2. How Information is Used</h2>
          <p>
            We use your contact details solely for dispatch coordination, sending SMS/WhatsApp order updates, generating commercial receipts, and customer service. We do not sell or lease personal data.
          </p>
          <h2 className="text-sm font-bold text-slate-900">3. AI Sales Agent Data Handling</h2>
          <p>
            Conversations with our virtual sales assistant are used to generate quotations and improve customer assistance. No confidential credit credentials or unverified financial details are stored.
          </p>
        </div>
      </div>
    );
  }

  if (type === 'delivery-returns') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 text-slate-700 text-xs leading-relaxed">
        <h1 className="text-2xl font-bold text-slate-900 font-heading">Delivery & Returns Policy</h1>
        <p className="text-slate-500">Last updated: October 2026</p>
        <div className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <h2 className="text-sm font-bold text-slate-900">1. Delivery Zones & Timelines (Rwanda)</h2>
          <p>
            Kigali deliveries across Gasabo, Kicukiro, and Nyarugenge are fulfilled same-day or next business morning. Orders equal to or exceeding 30,000 RWF qualify for complimentary delivery. Smaller orders carry a flat 2,000 RWF courier charge.
          </p>
          <h2 className="text-sm font-bold text-slate-900">2. Inspection on Delivery</h2>
          <p>
            Customers are invited to inspect all containers and tamper-evident cap seals upon receipt before issuing payment to our delivery personnel.
          </p>
          <h2 className="text-sm font-bold text-slate-900">3. Replacement & Quality Returns</h2>
          <p>
            If any container arrives damaged, leaking, or fails our verified quality standard, we provide an immediate no-hassle replacement within 24 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 text-slate-700 text-xs leading-relaxed">
      <h1 className="text-2xl font-bold text-slate-900 font-heading">Terms & Conditions</h1>
      <p className="text-slate-500">Last updated: October 2026</p>
      <div className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <h2 className="text-sm font-bold text-slate-900">1. Ordering & Prices</h2>
        <p>
          All listed prices are displayed in Rwandan Francs (RWF) and include applicable taxes. Volume discounts trigger automatically when thresholds are met.
        </p>
        <h2 className="text-sm font-bold text-slate-900">2. Payment Terms</h2>
        <p>
          We support payment upon delivery via Cash, MTN MoMo, Airtel Money, or direct bank transfer for corporate procurement accounts.
        </p>
        <h2 className="text-sm font-bold text-slate-900">3. Commercial Invoices</h2>
        <p>
          Official commercial invoices bearing company TIN and VAT breakdown are generated with every confirmed order.
        </p>
      </div>
    </div>
  );
};
