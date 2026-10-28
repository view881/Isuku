import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  ArrowLeft, 
  Check, 
  AlertCircle, 
  PhoneCall, 
  CreditCard, 
  Banknote, 
  Smartphone,
  ShoppingBag
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CustomerType, PaymentMethod } from '../types';

interface CheckoutPageProps {
  navigate: (route: string, param?: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ navigate }) => {
  const { cart, subtotalRwf, couponCode, clearCart } = useCart();

  const [customer, setCustomer] = useState({
    fullName: '',
    phone: '',
    email: '',
    organizationName: '',
    customerType: 'household' as CustomerType,
    district: 'Gasabo',
    deliveryAddress: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash_on_delivery');
  const [customerNotes, setCustomerNotes] = useState('');
  const [confirmedByCustomer, setConfirmedByCustomer] = useState(false);

  // Server-calculated pricing state
  const [calculation, setCalculation] = useState<{
    subtotalRwf: number;
    discountRwf: number;
    deliveryFeeRwf: number;
    taxRwf: number;
    totalRwf: number;
    wholesaleSavingsRwf: number;
    stockErrors: string[];
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Call server to calculate quote whenever cart or district changes
  useEffect(() => {
    if (cart.length === 0) return;

    const rawItems = cart.map(i => ({
      productId: i.productId,
      size: i.size,
      quantity: i.quantity
    }));

    fetch('/api/quote/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: rawItems,
        couponCode,
        district: customer.district
      })
    })
      .then(res => res.json())
      .then(data => {
        setCalculation(data);
      })
      .catch(err => {
        console.error('Error calculating quote:', err);
      });
  }, [cart, couponCode, customer.district]);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!confirmedByCustomer) {
      setErrorMessage('Please check the confirmation box to verify your order details.');
      return;
    }

    if (cart.length === 0) {
      setErrorMessage('Your shopping cart is empty.');
      return;
    }

    setIsSubmitting(true);
    try {
      const rawItems = cart.map(i => ({
        productId: i.productId,
        size: i.size,
        quantity: i.quantity
      }));

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          items: rawItems,
          paymentMethod,
          customerNotes,
          couponCode
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to place order');
      }

      clearCart();
      navigate('order-confirmation', data.order.orderNumber);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error submitting order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 font-heading">
          Your Cart is Empty
        </h2>
        <p className="text-xs text-slate-600">
          Please add liquid soap products to your cart before proceeding to checkout.
        </p>
        <button
          onClick={() => navigate('products')}
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('products')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </button>
      </div>

      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
          Checkout & Order Confirmation
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Review your items and provide your delivery location in Rwanda. Pay comfortably upon delivery or via Mobile Money.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Customer & Delivery Details (Cols 1-7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Customer Information */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">1</span>
              Customer Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Patrick Bizimana"
                  value={customer.fullName}
                  onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number (Rwanda) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+250 78... / 078..."
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="p.bizimana@gmail.com"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer Type
                </label>
                <select
                  value={customer.customerType}
                  onChange={(e: any) => setCustomer({ ...customer, customerType: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700 focus:bg-white cursor-pointer"
                >
                  <option value="household">Household</option>
                  <option value="restaurant">Restaurant / Bar / Kitchen</option>
                  <option value="hotel">Hotel / Guest House</option>
                  <option value="school">School / College</option>
                  <option value="hospital">Hospital / Clinic</option>
                  <option value="cleaning_company">Cleaning Services Contractor</option>
                  <option value="retailer">Retail Shop / Supermarket</option>
                  <option value="wholesaler">Wholesale Distributor</option>
                </select>
              </div>
            </div>

            {customer.customerType !== 'household' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Business / Organization Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kigali Bistro Ltd"
                  value={customer.organizationName}
                  onChange={(e) => setCustomer({ ...customer, organizationName: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700 focus:bg-white"
                />
              </div>
            )}
          </div>

          {/* Delivery Location in Rwanda */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">2</span>
              Delivery Address (Rwanda)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  District *
                </label>
                <select
                  value={customer.district}
                  onChange={(e) => setCustomer({ ...customer, district: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700 focus:bg-white cursor-pointer"
                >
                  <option value="Gasabo">Kigali - Gasabo (Masoro, Kimironko, Kacyiru)</option>
                  <option value="Kicukiro">Kigali - Kicukiro (Niboye, Gahanga, Kanombe)</option>
                  <option value="Nyarugenge">Kigali - Nyarugenge (Nyamirambo, City Center)</option>
                  <option value="Musanze">Northern Province - Musanze</option>
                  <option value="Rubavu">Western Province - Rubavu (Gisenyi)</option>
                  <option value="Huye">Southern Province - Huye</option>
                  <option value="Rwamagana">Eastern Province - Rwamagana</option>
                  <option value="Other Upcountry">Other Upcountry Location</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Specific Street / Gate / Landmark *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KG 11 Ave No. 24, Near Kimironko Market"
                  value={customer.deliveryAddress}
                  onChange={(e) => setCustomer({ ...customer, deliveryAddress: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Delivery Notes (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Call 10 minutes before delivery; leave with security guard..."
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700 focus:bg-white"
              />
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">3</span>
              Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              <label className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                paymentMethod === 'cash_on_delivery' ? 'border-emerald-700 bg-emerald-50/50 shadow-xs' : 'border-slate-200 hover:border-slate-300'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cash_on_delivery'}
                  onChange={() => setPaymentMethod('cash_on_delivery')}
                  className="mt-1 accent-emerald-700"
                />
                <div>
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <Banknote className="w-4 h-4 text-emerald-700" />
                    Payment on Delivery
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Inspect your soap containers upon arrival, then pay cash or phone MoMo to the delivery rider.
                  </p>
                </div>
              </label>

              <label className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                paymentMethod === 'momo_mtn' ? 'border-emerald-700 bg-emerald-50/50 shadow-xs' : 'border-slate-200 hover:border-slate-300'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'momo_mtn'}
                  onChange={() => setPaymentMethod('momo_mtn')}
                  className="mt-1 accent-emerald-700"
                />
                <div>
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-amber-600" />
                    MTN Mobile Money (MoMo)
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Official merchant code will be sent immediately upon confirmation.
                  </p>
                </div>
              </label>

              <label className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                paymentMethod === 'airtel_money' ? 'border-emerald-700 bg-emerald-50/50 shadow-xs' : 'border-slate-200 hover:border-slate-300'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'airtel_money'}
                  onChange={() => setPaymentMethod('airtel_money')}
                  className="mt-1 accent-emerald-700"
                />
                <div>
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-rose-600" />
                    Airtel Money
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Direct merchant number sent for instant transfer.
                  </p>
                </div>
              </label>

              <label className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                paymentMethod === 'bank_transfer' ? 'border-emerald-700 bg-emerald-50/50 shadow-xs' : 'border-slate-200 hover:border-slate-300'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'bank_transfer'}
                  onChange={() => setPaymentMethod('bank_transfer')}
                  className="mt-1 accent-emerald-700"
                />
                <div>
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    Bank Transfer (BOK / Equity)
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    For corporate & institutional invoices. Pro-forma issued immediately.
                  </p>
                </div>
              </label>

            </div>
          </div>

        </div>

        {/* Right Column: Order Summary & Explicit Confirmation (Cols 8-12) */}
        <div className="lg:col-span-5 sticky top-24 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-5">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading pb-3 border-b border-slate-100">
              Order Summary ({cart.length} Products)
            </h2>

            {/* Itemized List */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1 text-xs">
              {cart.map((item) => (
                <div key={item.sku} className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 truncate">{item.name}</div>
                    <div className="text-[11px] text-slate-500">
                      {item.size} · Qty: {item.quantity} × {item.unitPriceRwf.toLocaleString()} RWF
                    </div>
                  </div>
                  <span className="font-mono-nums font-bold text-slate-900 shrink-0">
                    {(item.unitPriceRwf * item.quantity).toLocaleString()} RWF
                  </span>
                </div>
              ))}
            </div>

            {/* Live Pricing Breakdown */}
            <div className="pt-4 border-t border-slate-200 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono-nums font-semibold text-slate-900">
                  {calculation ? calculation.subtotalRwf.toLocaleString() : subtotalRwf.toLocaleString()} RWF
                </span>
              </div>

              {calculation && calculation.wholesaleSavingsRwf > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Wholesale Volume Savings:</span>
                  <span className="font-mono-nums">-{calculation.wholesaleSavingsRwf.toLocaleString()} RWF</span>
                </div>
              )}

              {calculation && calculation.discountRwf > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount:</span>
                  <span className="font-mono-nums">-{calculation.discountRwf.toLocaleString()} RWF</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery ({customer.district})</span>
                <span className="font-mono-nums font-semibold text-slate-900">
                  {calculation?.deliveryFeeRwf === 0 ? (
                    <span className="text-emerald-700 font-bold">FREE</span>
                  ) : (
                    `${calculation?.deliveryFeeRwf?.toLocaleString() || 2000} RWF`
                  )}
                </span>
              </div>

              {calculation && (
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Estimated 18% VAT included:</span>
                  <span className="font-mono-nums">{calculation.taxRwf.toLocaleString()} RWF</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex justify-between text-base font-bold text-slate-900">
                <span>Total Due:</span>
                <span className="font-mono-nums text-emerald-900 text-lg">
                  {calculation ? calculation.totalRwf.toLocaleString() : subtotalRwf.toLocaleString()} RWF
                </span>
              </div>
            </div>

            {/* Explicit Customer Confirmation (Mandatory requirement) */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 text-xs space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={confirmedByCustomer}
                  onChange={(e) => setConfirmedByCustomer(e.target.checked)}
                  className="mt-0.5 accent-emerald-700 rounded cursor-pointer"
                />
                <span className="text-slate-700 leading-snug">
                  I confirm that my product quantities, delivery location in Rwanda, and contact information are accurate.
                </span>
              </label>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isSubmitting || !confirmedByCustomer}
              className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              {isSubmitting ? 'Placing Order...' : 'Confirm & Place Order'}
            </button>

            <div className="text-center text-[11px] text-slate-500">
              No mandatory online credit card payment required · Payment on delivery supported
            </div>

          </div>
        </div>

      </form>

    </div>
  );
};
