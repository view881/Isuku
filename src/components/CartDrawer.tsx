import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, ShoppingBag, MessageSquare } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

interface CartDrawerProps {
  navigate: (route: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ navigate }) => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    subtotalRwf,
    couponCode,
    setCouponCode 
  } = useCart();
  const { t } = useLanguage();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponDiscount, setCouponDiscount] = useState<{ code: string; percent: number; amount: number } | null>(null);
  const [validating, setValidating] = useState(false);

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = 30000;
  const progressToFreeDelivery = Math.min(100, Math.round((subtotalRwf / freeDeliveryThreshold) * 100));
  const remainingForFree = Math.max(0, freeDeliveryThreshold - subtotalRwf);

  const discountAmount = couponDiscount ? couponDiscount.amount : 0;
  const estimatedDelivery = subtotalRwf >= freeDeliveryThreshold || subtotalRwf === 0 ? 0 : 2000;
  const estimatedTotal = Math.max(0, subtotalRwf - discountAmount) + estimatedDelivery;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    setValidating(true);
    setCouponError('');

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: inputCoupon.trim(), subtotalRwf })
      });
      const data = await res.json();
      if (data.valid) {
        setCouponDiscount({
          code: data.coupon.code,
          percent: data.discountPercent,
          amount: data.discountAmount
        });
        setCouponCode(data.coupon.code);
        setInputCoupon('');
      } else {
        setCouponError(data.error || 'Invalid discount code');
      }
    } catch {
      setCouponError('Network error validating coupon');
    } finally {
      setValidating(false);
    }
  };

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) return;
    const itemsList = cart.map(i => `• ${i.name} (${i.size}) x${i.quantity} = ${(i.unitPriceRwf * i.quantity).toLocaleString()} RWF`).join('%0A');
    const msg = `Hello Isuku Pure Sales Team! 👋%0AI would like to order the following products:%0A%0A${itemsList}%0A%0ASubtotal: ${subtotalRwf.toLocaleString()} RWF%0APlease confirm delivery details!`;
    window.location.href = `https://wa.me/250788123456?text=${msg}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-700" />
              <h2 className="text-base font-bold text-slate-900 font-heading">
                {t.cart} ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery progress bar */}
          <div className="bg-emerald-50/70 p-3 px-5 border-b border-emerald-100 text-xs">
            <div className="flex justify-between items-center mb-1 text-slate-700">
              <span className="font-medium">
                {remainingForFree === 0 ? '✨ You unlocked Free Delivery in Kigali!' : `Add ${remainingForFree.toLocaleString()} RWF for Free Delivery!`}
              </span>
              <span className="font-mono-nums font-semibold text-emerald-800">{progressToFreeDelivery}%</span>
            </div>
            <div className="w-full bg-emerald-200/60 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progressToFreeDelivery}%` }}
              />
            </div>
          </div>

          {/* Items list */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <p className="text-sm text-slate-500">{t.emptyCart}</p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('products');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  {t.continueShopping} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={item.sku}
                  className="flex gap-3.5 p-3 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-colors bg-white shadow-xs"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-18 h-18 object-cover rounded-lg bg-slate-100 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-slate-900 truncate">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.sku)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Packaging Size: <span className="text-slate-700 font-semibold">{item.size}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-slate-200 rounded-md overflow-hidden bg-slate-50">
                        <button
                          onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                          className="p-1 text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono-nums font-semibold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                          className="p-1 text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-900 font-mono-nums">
                          {(item.unitPriceRwf * item.quantity).toLocaleString()} RWF
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-4">
              
              {/* Promo code form */}
              <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                    <input
                      type="text"
                      placeholder="Promo code (e.g. ISUKU10)"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 uppercase font-mono-nums"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={validating || !inputCoupon.trim()}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-lg disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    {validating ? 'Checking...' : 'Apply'}
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-rose-600">{couponError}</p>}
                {couponDiscount && (
                  <p className="text-[11px] text-emerald-700 font-medium">
                    ✓ Code '{couponDiscount.code}' applied (-{couponDiscount.percent}%)
                  </p>
                )}
              </form>

              {/* Price Calculation */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <div className="flex justify-between">
                  <span>{t.subtotal}</span>
                  <span className="font-mono-nums font-semibold text-slate-900">{subtotalRwf.toLocaleString()} RWF</span>
                </div>
                {couponDiscount && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount ({couponDiscount.code})</span>
                    <span className="font-mono-nums">-{discountAmount.toLocaleString()} RWF</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Kigali Delivery (Estimated)</span>
                  <span className="font-mono-nums font-semibold text-slate-900">
                    {estimatedDelivery === 0 ? 'FREE' : `${estimatedDelivery.toLocaleString()} RWF`}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                  <span>{t.total}</span>
                  <span className="font-mono-nums text-emerald-800 text-base">{estimatedTotal.toLocaleString()} RWF</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('checkout');
                  }}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {t.checkout} <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                  Order on WhatsApp (Instant Agent)
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pay on Delivery · Mobile Money · Bank Transfer</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
