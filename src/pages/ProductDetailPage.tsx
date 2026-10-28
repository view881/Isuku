import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShoppingBag, 
  MessageSquare, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Layers, 
  Check, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  navigate: (route: string, param?: string) => void;
  onAskAI: (product?: Product | null, initialPrompt?: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  navigate,
  onAskAI
}) => {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  const currentVariant = product.variants[selectedVariantIdx] || product.variants[0];

  const handleAddToCart = () => {
    if (!currentVariant) return;
    addToCart({
      productId: product.id,
      productSlug: product.slug,
      name: product.name,
      category: product.category,
      size: currentVariant.size,
      sku: currentVariant.sku,
      unitPriceRwf: currentVariant.priceRwf,
      image: product.images[selectedImageIdx] || product.images[0]
    }, quantity);

    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleWhatsApp = () => {
    const msg = `Hello Isuku Pure! I am interested in ordering ${quantity}x ${product.name} (${currentVariant.size}) for ${(currentVariant.priceRwf * quantity).toLocaleString()} RWF.`;
    window.location.href = `https://wa.me/250788123456?text=${encodeURIComponent(msg)}`;
  };

  const relatedProducts = allProducts.filter(p => p.id !== product.id).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumb / Back button */}
      <div>
        <button
          onClick={() => navigate('products')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </button>
      </div>

      {/* Main Grid: Gallery Left, Sticky Contiguous Purchase Module Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Gallery Module (Cols 1-7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs relative">
            <img
              src={product.images[selectedImageIdx] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs text-xs font-bold text-emerald-900 px-3 py-1 rounded shadow-2xs uppercase tracking-wider">
              {product.category}
            </div>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImageIdx === idx ? 'border-emerald-700 shadow-xs' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Deep Specifications & Usage Tabs */}
          <div className="pt-6 space-y-6 border-t border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 font-heading">
                Product Overview
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {product.fullDescription}
              </p>
            </div>

            {/* Verified Benefits */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 font-heading">
                Performance Benefits
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                {product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Directions & Dosage */}
            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 space-y-1.5">
              <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                Usage Instructions & Recommended Dilution
              </h3>
              <p className="text-xs text-emerald-900 leading-relaxed">
                {product.usageInstructions}
              </p>
            </div>

            {/* Ingredients & Safety */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1.5 uppercase tracking-wider text-[11px]">
                  Formula Ingredients
                </h4>
                <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                  {product.ingredients.map((ing, i) => (
                    <li key={i}>{ing}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1.5 uppercase tracking-wider text-[11px] flex items-center gap-1 text-amber-800">
                  <AlertCircle className="w-3.5 h-3.5" /> Safety & Storage
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  {product.safetyInstructions}
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Contiguous Purchase Module (Cols 8-12, Sticky) */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-md space-y-6">
            
            {/* Title & Metadata */}
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                <span className="uppercase tracking-wider font-semibold text-emerald-800">
                  {product.category}
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>SKU: {currentVariant.sku}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Price Display */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Unit Price (RWF)</span>
                <span className="text-2xl sm:text-3xl font-bold font-mono-nums text-slate-900">
                  {currentVariant.priceRwf.toLocaleString()} RWF
                </span>
              </div>
              {currentVariant.wholesalePriceRwf > 0 && (
                <div className="text-right">
                  <span className="text-[11px] text-emerald-700 font-semibold block">
                    Wholesale ({currentVariant.wholesaleMinQty}+ units):
                  </span>
                  <span className="text-base font-bold font-mono-nums text-emerald-800">
                    {currentVariant.wholesalePriceRwf.toLocaleString()} RWF
                  </span>
                </div>
              )}
            </div>

            {/* Packaging Variant Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Select Packaging Size:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {product.variants.map((v, idx) => (
                  <button
                    key={v.size}
                    onClick={() => setSelectedVariantIdx(idx)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedVariantIdx === idx
                        ? 'border-emerald-700 bg-emerald-50/60 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="font-bold text-xs text-slate-900">{v.size}</div>
                    <div className="font-mono-nums text-xs font-semibold text-emerald-800 mt-0.5">
                      {v.priceRwf.toLocaleString()} RWF
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Availability */}
            <div className="flex items-center justify-between text-xs py-1 border-y border-slate-100">
              <span className="text-slate-500">Stock Availability:</span>
              <span className="font-semibold text-emerald-800 flex items-center gap-1 font-mono-nums">
                <Check className="w-3.5 h-3.5" />
                {currentVariant.stockQuantity} units ready in Kigali factory
              </span>
            </div>

            {/* Quantity Stepper & Buy Action */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-slate-600">Quantity:</span>
                <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-slate-700 hover:bg-slate-200 transition-colors font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-mono-nums font-bold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-slate-700 hover:bg-slate-200 transition-colors font-bold"
                  >
                    +
                  </button>
                </div>
                <div className="text-right flex-1 text-xs font-bold font-mono-nums text-slate-900">
                  Total: {(currentVariant.priceRwf * quantity).toLocaleString()} RWF
                </div>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                {t.addToCart}
              </button>

              {addedNotice && (
                <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-semibold text-center animate-in fade-in">
                  ✓ Added {quantity}x {product.name} ({currentVariant.size}) to cart!
                </div>
              )}

              {/* WhatsApp instant checkout */}
              <button
                onClick={handleWhatsApp}
                className="w-full py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-emerald-700" />
                Order on WhatsApp (Instant Agent)
              </button>

              {/* Ask AI button */}
              <button
                onClick={() => onAskAI(product, `Please calculate an order for ${quantity}x ${product.name} (${currentVariant.size}) including delivery to Kigali.`)}
                className="w-full py-2 text-xs font-semibold text-slate-600 hover:text-emerald-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Ask AI to calculate custom delivery quote
              </button>
            </div>

            {/* Delivery & Payment Guarantee */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Free delivery across Kigali for orders over 30,000 RWF</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pay on Delivery · MTN MoMo · Airtel Money</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-slate-200 space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
            Related Cleaning Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onSelect={(prod) => navigate('product-detail', prod.slug)}
                onAskAI={(prod) => onAskAI(prod, `Tell me more about ${prod.name}`)}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
