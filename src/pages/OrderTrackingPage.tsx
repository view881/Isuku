import React, { useState } from 'react';
import { Search, PackageCheck, Clock, MapPin, Truck, AlertCircle } from 'lucide-react';
import { Order } from '../types';

export const OrderTrackingPage: React.FC<{ navigate: (route: string, param?: string) => void }> = ({ navigate }) => {
  const [orderQuery, setOrderQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/${orderQuery.trim()}`);
      if (!res.ok) {
        throw new Error('Order number not found. Please verify your invoice number (e.g. ISP-2026-1041).');
      }
      const data = await res.json();
      setOrder(data.order);
    } catch (err: any) {
      setError(err.message || 'Failed to locate order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
          Real-Time Dispatch Logistics
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 font-heading">
          Track Your Liquid Soap Order
        </h1>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          Enter your order reference number from your confirmation SMS, receipt, or email to check preparation and rider dispatch status.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-lg mx-auto flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="e.g. ISP-2026-1041"
            value={orderQuery}
            onChange={(e) => setOrderQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-700 uppercase font-mono-nums"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !orderQuery.trim()}
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl disabled:opacity-50 transition-colors cursor-pointer"
        >
          {loading ? 'Searching...' : 'Track Order'}
        </button>
      </form>

      {/* Helpful demo chips */}
      <div className="text-center text-xs text-slate-400 space-x-2">
        <span>Try demo order numbers:</span>
        <button onClick={() => { setOrderQuery('ISP-2026-1041'); }} className="text-emerald-700 font-mono-nums font-semibold hover:underline cursor-pointer">
          ISP-2026-1041
        </button>
        <span>·</span>
        <button onClick={() => { setOrderQuery('ISP-2026-1042'); }} className="text-emerald-700 font-mono-nums font-semibold hover:underline cursor-pointer">
          ISP-2026-1042
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 max-w-lg mx-auto">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Order Status Display */}
      {order && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-slate-100 gap-2">
            <div>
              <span className="text-xs text-slate-400 font-mono-nums">Order Reference</span>
              <h3 className="text-lg font-bold font-mono-nums text-slate-900">#{order.orderNumber}</h3>
            </div>
            <div className="text-xs font-bold px-3 py-1 rounded bg-emerald-100 text-emerald-900 capitalize self-start sm:self-auto">
              Status: {order.fulfillmentStatus.replace(/_/g, ' ')}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block font-semibold mb-0.5">Customer</span>
              <div className="font-bold text-slate-800">{order.customer.fullName}</div>
              <div className="text-slate-500">{order.customer.deliveryAddress}, {order.customer.district}</div>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold mb-0.5">Payment</span>
              <div className="font-semibold text-slate-800 capitalize">{order.paymentMethod.replace(/_/g, ' ')} ({order.paymentStatus})</div>
              <div className="font-mono-nums font-bold text-emerald-800 text-sm">{order.totalRwf.toLocaleString()} RWF</div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading">
              Tracking Events
            </h4>
            <div className="space-y-3">
              {order.timeline.map((evt, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <span className="font-bold text-slate-900 capitalize mr-2">
                      {evt.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-slate-600">{evt.note}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 font-mono-nums">
                    {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => navigate('order-confirmation', order.orderNumber)}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
            >
              View Full Printable Invoice →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
