import React, { useState, useMemo } from 'react';
import { Search, Filter, Sparkles, ArrowUpDown } from 'lucide-react';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';

interface ProductsPageProps {
  products: Product[];
  categories: Category[];
  navigate: (route: string, param?: string) => void;
  onAskAI: (product?: Product | null, initialPrompt?: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  products,
  categories,
  navigate,
  onAskAI
}) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch = !searchQuery || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchSize = selectedSize === 'all' || p.variants.some(v => v.size.toLowerCase() === selectedSize.toLowerCase());

      return matchCat && matchSearch && matchSize;
    }).sort((a, b) => {
      const minPriceA = Math.min(...a.variants.map(v => v.priceRwf));
      const minPriceB = Math.min(...b.variants.map(v => v.priceRwf));
      if (sortBy === 'price-asc') return minPriceA - minPriceB;
      if (sortBy === 'price-desc') return minPriceB - minPriceA;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, selectedCategory, searchQuery, selectedSize, sortBy]);

  const sizes = ['all', '500 ml', '1 L', '5 L', '20 L'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            Factory Direct Catalog · Rwanda
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-heading">
            Liquid Soap Products
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-xl">
            Browse our full manufacturing range of certified cleaning liquids with live inventory and direct wholesale volume pricing in Rwandan Francs (RWF).
          </p>
        </div>

        <button
          onClick={() => onAskAI(null, "Help me choose the most economical soap for my cleaning requirements")}
          className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shrink-0 self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4 text-emerald-700" />
          <span>Ask AI to Recommend Soap</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search products by name, grease-cutting, disinfectant, laundry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700 focus:bg-white transition-colors"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative flex items-center">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="text-xs pl-8 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-emerald-700 cursor-pointer appearance-none"
              >
                <option value="featured">Sort: Featured First</option>
                <option value="price-asc">Sort: Price (Low to High)</option>
                <option value="price-desc">Sort: Price (High to Low)</option>
              </select>
            </div>
          </div>

        </div>

        {/* Category Filters (Clean Segmented Tabs) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-medium text-[11px] mr-1 shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Category:
          </span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-md font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3 py-1.5 rounded-md font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.slug
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Size Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-medium text-[11px] mr-1 shrink-0">
            Packaging Size:
          </span>
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSize(s)}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedSize === s
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s === 'all' ? 'All Sizes' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Product Results */}
      <div>
        <div className="text-xs text-slate-500 mb-4 font-mono-nums">
          Showing {filteredProducts.length} of {products.length} products
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200 space-y-3">
            <p className="text-sm text-slate-600 font-medium">
              No products found matching your current search or filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedSize('all');
              }}
              className="text-xs font-semibold text-emerald-800 hover:underline cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(p) => navigate('product-detail', p.slug)}
                onAskAI={(p) => onAskAI(p, `What are the benefits and usage instructions for ${p.name}?`)}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
