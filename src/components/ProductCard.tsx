import React, { useState } from 'react';
import { ShoppingBag, Sparkles, MessageSquare, Check } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAskAI: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onAskAI }) => {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const currentVariant = product.variants[selectedVariantIdx] || product.variants[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentVariant) return;
    addToCart({
      productId: product.id,
      productSlug: product.slug,
      name: product.name,
      category: product.category,
      size: currentVariant.size,
      sku: currentVariant.sku,
      unitPriceRwf: currentVariant.priceRwf,
      image: product.images[0]
    });
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = `Hello Isuku Pure! I would like to order: ${product.name} (${currentVariant.size}) priced at ${currentVariant.priceRwf.toLocaleString()} RWF.`;
    window.location.href = `https://wa.me/250788123456?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div 
      onClick={() => onSelect(product)}
      className="group bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col cursor-pointer"
    >
      {/* Product Image Frame */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        {/* Subtle, unboxed clean availability indicator */}
        <div className="absolute top-2.5 right-2.5 text-[11px] font-semibold text-emerald-900 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded shadow-2xs">
          {currentVariant.stockQuantity > 0 ? t.inStock : t.outOfStock}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed clean metadata with typographic separator */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="uppercase tracking-wider font-semibold text-[11px] text-emerald-800">
              {product.category}
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Kigali Factory Direct</span>
          </div>

          <h3 className="text-base font-bold text-slate-900 font-heading leading-snug group-hover:text-emerald-800 transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Size Selectors (Functional Tab Buttons) */}
          <div className="mt-3.5">
            <div className="text-[11px] font-medium text-slate-500 mb-1.5">Select Packaging:</div>
            <div className="flex flex-wrap gap-1.5" onClick={(e) => e.stopPropagation()}>
              {product.variants.map((v, idx) => (
                <button
                  key={v.size}
                  onClick={() => setSelectedVariantIdx(idx)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap cursor-pointer ${
                    selectedVariantIdx === idx
                      ? 'bg-emerald-800 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {v.size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-4 mt-3 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-xs text-slate-400 block -mb-0.5">Price</span>
              <span className="text-lg font-bold font-mono-nums text-slate-900">
                {currentVariant.priceRwf.toLocaleString()} RWF
              </span>
            </div>
            {currentVariant.wholesalePriceRwf > 0 && (
              <div className="text-right">
                <span className="text-[10px] text-emerald-700 font-semibold block">
                  Bulk from {currentVariant.wholesaleMinQty}+ units:
                </span>
                <span className="text-xs font-bold font-mono-nums text-emerald-800">
                  {currentVariant.wholesalePriceRwf.toLocaleString()} RWF
                </span>
              </div>
            )}
          </div>

          {/* Primary Action Buttons */}
          <div className="grid grid-cols-2 gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handleAddToCart}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                addedAnimation 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Added!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" /> {t.addToCart}
                </>
              )}
            </button>

            <button
              onClick={handleWhatsAppOrder}
              className="py-2 px-2 rounded-lg text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center justify-center gap-1 cursor-pointer truncate"
              title="Order directly on WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="truncate">WhatsApp</span>
            </button>
          </div>

          {/* Ask AI Trigger */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAskAI(product);
            }}
            className="w-full mt-2 py-1.5 text-center text-[11px] font-semibold text-slate-500 hover:text-emerald-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>Ask AI Sales Agent about this soap</span>
          </button>
        </div>
      </div>
    </div>
  );
};
