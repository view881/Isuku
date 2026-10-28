import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Check, X, Layers, AlertCircle } from 'lucide-react';
import { Product, ProductVariant } from '../../types';

interface AdminProductsProps {
  products: Product[];
  onRefresh: () => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({ products, onRefresh }) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [stockEditVariant, setStockEditVariant] = useState<{ productId: string; variantIdx: number; stock: number } | null>(null);

  // Form state for create/edit
  const [form, setForm] = useState({
    name: '',
    category: 'dishwashing',
    shortDescription: '',
    fullDescription: '',
    usageInstructions: '',
    ingredients: 'Purified Water, Plant Surfactants, Natural Lime Extract',
    safetyInstructions: 'Keep away from children. External washing use only.',
    features: 'Biodegradable, Gentle on skin, Deep degreasing',
    variants: [
      { size: '500 ml', sku: 'ISU-NEW-500', priceRwf: 1200, wholesalePriceRwf: 950, wholesaleMinQty: 24, stockQuantity: 100, inStock: true },
      { size: '1 L', sku: 'ISU-NEW-1L', priceRwf: 2200, wholesalePriceRwf: 1750, wholesaleMinQty: 12, stockQuantity: 80, inStock: true },
      { size: '5 L', sku: 'ISU-NEW-5L', priceRwf: 9500, wholesalePriceRwf: 7800, wholesaleMinQty: 4, stockQuantity: 40, inStock: true },
      { size: '20 L', sku: 'ISU-NEW-20L', priceRwf: 34000, wholesalePriceRwf: 28500, wholesaleMinQty: 2, stockQuantity: 20, inStock: true }
    ] as ProductVariant[],
    featured: false
  });

  const handleToggleActive = async (product: Product) => {
    try {
      await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !product.active })
      });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveStock = async () => {
    if (!stockEditVariant) return;
    const prod = products.find(p => p.id === stockEditVariant.productId);
    if (!prod) return;

    const newVariants = [...prod.variants];
    newVariants[stockEditVariant.variantIdx].stockQuantity = stockEditVariant.stock;
    newVariants[stockEditVariant.variantIdx].inStock = stockEditVariant.stock > 0;

    try {
      await fetch(`/api/admin/products/${prod.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variants: newVariants })
      });
      setStockEditVariant(null);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        category: form.category,
        shortDescription: form.shortDescription,
        fullDescription: form.fullDescription,
        usageInstructions: form.usageInstructions,
        ingredients: form.ingredients.split(',').map(s => s.trim()).filter(Boolean),
        safetyInstructions: form.safetyInstructions,
        features: form.features.split(',').map(s => s.trim()).filter(Boolean),
        variants: form.variants,
        featured: form.featured
      };

      if (editingProduct) {
        await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      setIsCreating(false);
      setEditingProduct(null);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      category: p.category,
      shortDescription: p.shortDescription,
      fullDescription: p.fullDescription,
      usageInstructions: p.usageInstructions,
      ingredients: p.ingredients.join(', '),
      safetyInstructions: p.safetyInstructions,
      features: p.features.join(', '),
      variants: JSON.parse(JSON.stringify(p.variants)),
      featured: p.featured
    });
    setIsCreating(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-heading">
            Product & Inventory Management
          </h1>
          <p className="text-xs text-slate-500">
            Control factory catalog listings, prices in RWF, wholesale thresholds, and live warehouse inventory counts.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setIsCreating(true);
          }}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Factory Product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px]">
                <th className="py-3 px-4 font-semibold">Product</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Variants & Pricing (RWF)</th>
                <th className="py-3 px-4 font-semibold">Total Stock</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => {
                const totalStock = p.variants.reduce((sum, v) => sum + v.stockQuantity, 0);
                return (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Product Name & Image */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="font-bold text-slate-900 font-sans">{p.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono-nums">ID: {p.id}</div>
                          {p.featured && (
                            <span className="text-[10px] font-semibold text-emerald-800">
                              ★ Featured Product
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="capitalize font-medium text-slate-700">{p.category}</span>
                    </td>

                    {/* Packaging Sizes & Prices */}
                    <td className="py-3 px-4">
                      <div className="space-y-1 font-mono-nums text-[11px]">
                        {p.variants.map((v, vIdx) => (
                          <div key={v.size} className="flex items-center gap-2">
                            <span className="font-semibold text-slate-800 w-14">{v.size}:</span>
                            <span className="text-slate-900">{v.priceRwf.toLocaleString()} RWF</span>
                            <span className="text-[10px] text-emerald-700">
                              (Wholesale: {v.wholesalePriceRwf.toLocaleString()} RWF @ {v.wholesaleMinQty}+)
                            </span>
                            <button
                              onClick={() => setStockEditVariant({ productId: p.id, variantIdx: vIdx, stock: v.stockQuantity })}
                              className="text-[10px] text-slate-400 hover:text-emerald-700 underline cursor-pointer ml-1"
                            >
                              Qty: {v.stockQuantity}
                            </button>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Total Stock */}
                    <td className="py-3 px-4 font-mono-nums font-bold">
                      <span className={totalStock <= 30 ? 'text-amber-700' : 'text-slate-900'}>
                        {totalStock} units
                      </span>
                    </td>

                    {/* Active Status */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleActive(p)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                          p.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {p.active ? 'Active' : 'Hidden'}
                      </button>
                    </td>

                    {/* Edit Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => startEdit(p)}
                          className="p-1.5 text-slate-500 hover:text-emerald-800 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                          title="Edit product details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Edit Inline Modal */}
      {stockEditVariant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 font-heading">
              Update Warehouse Inventory
            </h3>
            <div className="space-y-2 text-xs">
              <label className="block text-slate-600 font-medium">Available Units in Masoro Warehouse:</label>
              <input
                type="number"
                min={0}
                value={stockEditVariant.stock}
                onChange={(e) => setStockEditVariant({ ...stockEditVariant, stock: parseInt(e.target.value, 10) || 0 })}
                className="w-full text-sm font-mono-nums px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-700"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setStockEditVariant(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStock}
                className="px-4 py-1.5 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow-2xs cursor-pointer"
              >
                Save Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Create/Edit Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full space-y-5 shadow-2xl border border-slate-200 my-8">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <h2 className="text-base font-bold text-slate-900 font-heading">
                {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Create New Factory Product'}
              </h2>
              <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700"
                  >
                    <option value="dishwashing">Dishwashing Liquid</option>
                    <option value="handwashing">Handwashing Soap</option>
                    <option value="laundry">Laundry Detergent</option>
                    <option value="multipurpose">Multipurpose Cleaner</option>
                    <option value="commercial">Commercial & Institutional</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Description *</label>
                <input
                  type="text"
                  required
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Technical Description</label>
                <textarea
                  rows={3}
                  value={form.fullDescription}
                  onChange={(e) => setForm({ ...form, fullDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Usage / Dilution Instructions</label>
                  <input
                    type="text"
                    value={form.usageInstructions}
                    onChange={(e) => setForm({ ...form, usageInstructions: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ingredients (comma-separated)</label>
                  <input
                    type="text"
                    value={form.ingredients}
                    onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700"
                  />
                </div>
              </div>

              {/* Packaging Variants & Prices in RWF */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                  Packaging Sizes & Pricing (RWF)
                </span>
                <div className="space-y-2">
                  {form.variants.map((v, idx) => (
                    <div key={idx} className="grid grid-cols-4 gap-2 items-center bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Size:</span>
                        <input
                          type="text"
                          value={v.size}
                          onChange={(e) => {
                            const updated = [...form.variants];
                            updated[idx].size = e.target.value;
                            setForm({ ...form, variants: updated });
                          }}
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded font-semibold"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Retail Price (RWF):</span>
                        <input
                          type="number"
                          value={v.priceRwf}
                          onChange={(e) => {
                            const updated = [...form.variants];
                            updated[idx].priceRwf = parseInt(e.target.value, 10) || 0;
                            setForm({ ...form, variants: updated });
                          }}
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded font-mono-nums"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Wholesale Price (RWF):</span>
                        <input
                          type="number"
                          value={v.wholesalePriceRwf}
                          onChange={(e) => {
                            const updated = [...form.variants];
                            updated[idx].wholesalePriceRwf = parseInt(e.target.value, 10) || 0;
                            setForm({ ...form, variants: updated });
                          }}
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded font-mono-nums"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Stock Qty:</span>
                        <input
                          type="number"
                          value={v.stockQuantity}
                          onChange={(e) => {
                            const updated = [...form.variants];
                            updated[idx].stockQuantity = parseInt(e.target.value, 10) || 0;
                            setForm({ ...form, variants: updated });
                          }}
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded font-mono-nums"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="accent-emerald-700"
                  />
                  <span className="font-semibold text-slate-700">Display as Featured on Homepage</span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow-xs cursor-pointer"
                  >
                    {editingProduct ? 'Save Changes' : 'Create Product'}
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
