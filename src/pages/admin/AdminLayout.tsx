import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Bot, 
  FileText, 
  Shield, 
  LogOut, 
  ArrowLeft,
  Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AdminOverview } from './AdminOverview';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';
import { AdminLeads } from './AdminLeads';
import { AdminConversations } from './AdminConversations';
import { AdminContent } from './AdminContent';
import { AdminAudit } from './AdminAudit';
import { Order, Product } from '../../types';

interface AdminLayoutProps {
  orders: Order[];
  products: Product[];
  onRefreshData: () => void;
  onExitAdmin: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  orders,
  products,
  onRefreshData,
  onExitAdmin
}) => {
  const { user, logout, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'leads' | 'conversations' | 'content' | 'audit'>('overview');

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, requiredRole: 'sales_agent' },
    { id: 'products', label: 'Products & Stock', icon: Package, requiredRole: 'sales_agent' },
    { id: 'orders', label: 'Orders & Dispatch', icon: ShoppingBag, requiredRole: 'sales_agent' },
    { id: 'leads', label: 'CRM & Leads', icon: Users, requiredRole: 'sales_agent' },
    { id: 'conversations', label: 'AI Telemetry', icon: Bot, requiredRole: 'sales_agent' },
    { id: 'content', label: 'Website Settings', icon: Settings, requiredRole: 'admin' },
    { id: 'audit', label: 'Audit Trail', icon: Shield, requiredRole: 'sales_manager' }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
        
        {/* Brand Bar */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-base">
              I
            </div>
            <div>
              <span className="text-sm font-bold text-white font-heading block">
                Isuku Operations
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold block uppercase">
                Kigali Factory HQ
              </span>
            </div>
          </div>
        </div>

        {/* User Card */}
        {user && (
          <div className="p-4 mx-3 my-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white truncate">{user.name}</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold text-[10px] uppercase font-mono-nums">
                {user.role}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 truncate mt-0.5">{user.email}</div>
          </div>
        )}

        {/* Navigation Tabs */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const allowed = hasPermission(item.requiredRole as any);
            if (!allowed) return null;

            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-800 space-y-1 text-xs">
          <button
            onClick={onExitAdmin}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Store</span>
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-5 sm:p-8 overflow-y-auto">
        {activeTab === 'overview' && (
          <AdminOverview 
            orders={orders} 
            products={products} 
            onNavigateTab={(tab: string) => setActiveTab(tab as any)} 
          />
        )}
        {activeTab === 'products' && (
          <AdminProducts products={products} onRefresh={onRefreshData} />
        )}
        {activeTab === 'orders' && (
          <AdminOrders orders={orders} onRefresh={onRefreshData} />
        )}
        {activeTab === 'leads' && (
          <AdminLeads />
        )}
        {activeTab === 'conversations' && (
          <AdminConversations />
        )}
        {activeTab === 'content' && (
          <AdminContent />
        )}
        {activeTab === 'audit' && (
          <AdminAudit />
        )}
      </main>

    </div>
  );
};
