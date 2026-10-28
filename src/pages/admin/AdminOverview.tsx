import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  AlertTriangle, 
  Bot, 
  Clock, 
  CheckCircle2, 
  DollarSign,
  ArrowUpRight
} from 'lucide-react';
import { Order, Product } from '../../types';

interface AdminOverviewProps {
  orders: Order[];
  products: Product[];
  onNavigateTab: (tab: string) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ orders, products, onNavigateTab }) => {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then(res => res.json())
      .then(data => setAnalytics(data))
      .catch(err => console.error('Failed to load analytics', err));
  }, [orders]);

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalRwf, 0);
  const pendingCount = orders.filter(o => o.fulfillmentStatus === 'pending_confirmation' || o.fulfillmentStatus === 'processing').length;
  const deliveredCount = orders.filter(o => o.fulfillmentStatus === 'delivered').length;

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-heading">
          Executive Operations Overview
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time metrics for Isuku Pure manufacturing, sales revenue in Rwandan Francs (RWF), order queue, and AI sales performance.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Revenue */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Gross Sales Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono-nums text-slate-900">
            {totalRevenue.toLocaleString()} RWF
          </div>
          <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <span>+18.4% vs last cycle</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono-nums text-slate-900">
            {orders.length} Orders
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <span className="font-semibold text-amber-700 font-mono-nums">{pendingCount} pending</span>
            <span>·</span>
            <span className="font-semibold text-emerald-700 font-mono-nums">{deliveredCount} delivered</span>
          </div>
        </div>

        {/* CRM Leads */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Commercial Leads</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-800 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono-nums text-slate-900">
            {analytics?.totalLeads || 2} Qualified
          </div>
          <div className="text-[11px] text-purple-700 font-medium">
            Hot B2B pipeline: Hotels & Schools
          </div>
        </div>

        {/* AI Sales Agent */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">AI Sales Agent</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono-nums text-slate-900">
            24/7 Active
          </div>
          <div className="text-[11px] text-emerald-800 font-medium flex items-center gap-1">
            <span>Server-side tools enabled</span>
          </div>
        </div>

      </div>

      {/* Low Stock Warning Banner if any */}
      {analytics?.lowStockAlerts && analytics.lowStockAlerts.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Inventory Warning:</strong> {analytics.lowStockAlerts.length} product size(s) running low on stock at Masoro warehouse.
            </span>
          </div>
          <button
            onClick={() => onNavigateTab('products')}
            className="font-bold underline hover:text-amber-950 cursor-pointer text-xs shrink-0"
          >
            Manage Stock
          </button>
        </div>
      )}

      {/* 2-Column Section: Recent Orders & Stock Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Orders Table (Cols 1-8) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 font-heading">
              Recent Factory Orders
            </h3>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-semibold text-emerald-800 hover:underline cursor-pointer flex items-center gap-1"
            >
              View all orders <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-[11px]">
                  <th className="py-2.5">Order Ref</th>
                  <th className="py-2.5">Customer</th>
                  <th className="py-2.5">District</th>
                  <th className="py-2.5">Total (RWF)</th>
                  <th className="py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 5).map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-mono-nums font-bold text-slate-900">
                      #{ord.orderNumber}
                    </td>
                    <td className="py-3 font-medium text-slate-800">
                      <div>{ord.customer.fullName}</div>
                      <div className="text-[10px] text-slate-400 capitalize">{ord.customer.customerType}</div>
                    </td>
                    <td className="py-3 text-slate-600">{ord.customer.district}</td>
                    <td className="py-3 font-mono-nums font-bold text-slate-900">
                      {ord.totalRwf.toLocaleString()} RWF
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                        ord.fulfillmentStatus === 'delivered'
                          ? 'bg-emerald-100 text-emerald-900'
                          : ord.fulfillmentStatus === 'processing'
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-amber-100 text-amber-900'
                      }`}>
                        {ord.fulfillmentStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Inventory Quick Stats (Cols 9-12) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 font-heading">
              Factory Warehouse Status
            </h3>
            <span className="text-[11px] text-emerald-700 font-semibold">Masoro Unit 1</span>
          </div>

          <div className="space-y-3 text-xs">
            {products.map((p) => {
              const totalStock = p.variants.reduce((acc, v) => acc + v.stockQuantity, 0);
              return (
                <div key={p.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1.5">
                  <div className="flex justify-between items-start font-semibold text-slate-900">
                    <span className="truncate pr-2">{p.name}</span>
                    <span className="font-mono-nums text-emerald-800 shrink-0 font-bold">
                      {totalStock} units
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 text-[10px] text-slate-500 font-mono-nums">
                    {p.variants.map((v) => (
                      <span key={v.size} className="bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {v.size}: {v.stockQuantity}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => onNavigateTab('products')}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Adjust Stock Counts
          </button>
        </div>

      </div>

    </div>
  );
};
