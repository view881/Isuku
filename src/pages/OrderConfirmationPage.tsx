import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Printer, 
  ArrowRight, 
  MessageSquare, 
  Clock, 
  Truck, 
  MapPin, 
  Phone,
  Building2
} from 'lucide-react';
import { Order } from '../types';

interface OrderConfirmationPageProps {
  orderNumber: string;
  navigate: (route: string, param?: string) => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ 
  orderNumber, 
  navigate 
}) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${orderNumber}`)
      .then(res => res.json())
      .then(data => {
        if (data.order) setOrder(data.order);
      })
      .catch(err => console.error('Failed to load order', err))
      .finally(() => setLoading(false));
  }, [orderNumber]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center text-xs text-slate-500">
        Loading order confirmation #{orderNumber}...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-900 font-heading">Order Not Found</h2>
        <p className="text-xs text-slate-600">Could not locate order details for #{orderNumber}.</p>
        <button
          onClick={() => navigate('home')}
          className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      
      {/* Success Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 text-center space-y-3">
        <div className="w-14 h-14 rounded-full bg-emerald-700 text-white flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
            Order Successfully Placed
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            Order #{order.orderNumber}
          </h1>
        </div>
        <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
          Thank you, <span className="font-semibold text-slate-900">{order.customer.fullName}</span>! Our dispatch desk has logged your order and our logistics team in Masoro is preparing your containers.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" /> Print Official Invoice / Receipt
          </button>
          <a
            href={`https://wa.me/250788123456?text=Hello%20Isuku%20Pure%2C%20following%20up%20on%20my%20Order%20%23${order.orderNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-emerald-800 text-white hover:bg-emerald-900 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" /> Dispatch Status on WhatsApp
          </a>
        </div>
      </div>

      {/* Invoice Snapshot Card (Printable) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 print:border-none print:shadow-none">
        
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between pb-6 border-b border-slate-200 gap-4">
          <div>
            <div className="text-lg font-bold text-slate-900 font-heading">
              Isuku Pure Cleaners Ltd
            </div>
            <div className="text-xs text-slate-500 space-y-0.5 mt-1">
              <div>Kigali Special Economic Zone (KSEZ), Masoro</div>
              <div>Gasabo District, Kigali, Rwanda</div>
              <div>TIN: 108-994-321 · Phone: +250 788 123 456</div>
            </div>
          </div>
          <div className="text-left sm:text-right space-y-1">
            <span className="text-[11px] font-mono-nums text-slate-400 block uppercase">Commercial Invoice</span>
            <span className="text-sm font-bold font-mono-nums text-slate-900 block">#{order.orderNumber}</span>
            <span className="text-xs text-slate-500 block">
              {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Customer & Delivery Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs pb-6 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Deliver To:
            </span>
            <div className="font-bold text-slate-900 text-sm">{order.customer.fullName}</div>
            {order.customer.organizationName && (
              <div className="text-slate-700 font-medium">{order.customer.organizationName}</div>
            )}
            <div className="text-slate-600 mt-1 flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>{order.customer.deliveryAddress}, {order.customer.district}</span>
            </div>
            <div className="text-slate-600 mt-0.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{order.customer.phone}</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Payment & Status:
            </span>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Method:</span>
                <span className="font-semibold text-slate-800 capitalize">{order.paymentMethod.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Status:</span>
                <span className={`font-semibold capitalize ${order.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fulfillment:</span>
                <span className="font-semibold text-emerald-800 capitalize">
                  {order.fulfillmentStatus.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Purchased Items Table */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Purchased Products
          </span>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-[11px]">
                  <th className="py-2">Item Description</th>
                  <th className="py-2">Size</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Unit Price</th>
                  <th className="py-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono-nums text-slate-800">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 font-medium text-slate-900 font-sans">{item.name}</td>
                    <td className="py-2.5 text-slate-600">{item.size}</td>
                    <td className="py-2.5 text-center">{item.quantity}</td>
                    <td className="py-2.5 text-right">{item.unitPriceRwf.toLocaleString()} RWF</td>
                    <td className="py-2.5 text-right font-bold">{item.subtotalRwf.toLocaleString()} RWF</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals Summary */}
        <div className="pt-4 border-t border-slate-200 flex justify-end text-xs">
          <div className="w-full sm:w-64 space-y-1.5 text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-mono-nums font-semibold text-slate-900">{order.subtotalRwf.toLocaleString()} RWF</span>
            </div>
            {order.discountRwf > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Discount ({order.discountCodeApplied || 'Promotion'}):</span>
                <span className="font-mono-nums">-{order.discountRwf.toLocaleString()} RWF</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery ({order.customer.district}):</span>
              <span className="font-mono-nums font-semibold text-slate-900">
                {order.deliveryFeeRwf === 0 ? 'FREE' : `${order.deliveryFeeRwf.toLocaleString()} RWF`}
              </span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>18% VAT included:</span>
              <span className="font-mono-nums">{order.taxRwf.toLocaleString()} RWF</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
              <span>Total Paid / Due:</span>
              <span className="font-mono-nums text-emerald-800 text-base">{order.totalRwf.toLocaleString()} RWF</span>
            </div>
          </div>
        </div>

        {/* Order Event Timeline */}
        <div className="pt-6 border-t border-slate-200 space-y-3 print:hidden">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading">
            Live Order Timeline
          </h3>
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

      </div>

      {/* Footer Navigation */}
      <div className="flex justify-between items-center print:hidden">
        <button
          onClick={() => navigate('track')}
          className="text-xs font-semibold text-slate-600 hover:text-emerald-800"
        >
          Check Order Status Later
        </button>
        <button
          onClick={() => navigate('products')}
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          Continue Shopping <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
