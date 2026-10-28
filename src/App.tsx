import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { AIChatWidget } from './components/AIChatWidget';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { WholesalePage } from './pages/WholesalePage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AboutPage } from './pages/AboutPage';
import { LegalPage } from './pages/LegalPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminLogin } from './pages/admin/AdminLogin';
import { Product, Category, Order } from './types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_ORDERS } from './data/seedData';

function AppContent() {
  const { user } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [routeParam, setRouteParam] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  
  // AI Chat External Prompt trigger
  const [aiExternalPrompt, setAiExternalPrompt] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [pRes, cRes, oRes] = await Promise.all([
        fetch('/api/products?admin=true'),
        fetch('/api/categories'),
        fetch('/api/orders')
      ]);

      if (pRes.ok) {
        const pData = await pRes.json();
        if (pData.products) setProducts(pData.products);
      }
      if (cRes.ok) {
        const cData = await cRes.json();
        if (cData.categories) setCategories(cData.categories);
      }
      if (oRes.ok) {
        const oData = await oRes.json();
        if (oData.orders) setOrders(oData.orders);
      }
    } catch (err) {
      console.warn('Using seeded data as fallback:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const navigate = (route: string, param?: string) => {
    setCurrentRoute(route);
    setRouteParam(param || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAskAI = (product?: Product | null, initialPrompt?: string) => {
    if (initialPrompt) {
      setAiExternalPrompt(initialPrompt);
    } else if (product) {
      setAiExternalPrompt(`Tell me more about ${product.name} and recommend the best size for my needs.`);
    }
  };

  // If in admin route
  if (currentRoute === 'admin') {
    if (!user) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
          <Header currentRoute={currentRoute} navigate={navigate} />
          <AdminLogin onSuccess={() => { loadData(); navigate('admin'); }} />
          <Footer navigate={navigate} />
        </div>
      );
    }

    return (
      <AdminLayout
        orders={orders}
        products={products}
        onRefreshData={loadData}
        onExitAdmin={() => navigate('home')}
      />
    );
  }

  // Find active product for PDP
  const activeProduct = routeParam 
    ? products.find(p => p.slug === routeParam || p.id === routeParam) || products[0]
    : products[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-emerald-700 selection:text-white">
      
      {/* 3-Zone Header */}
      <Header currentRoute={currentRoute} navigate={navigate} />

      {/* Main Page Routing */}
      <main className="flex-1">
        {currentRoute === 'home' && (
          <HomePage
            products={products}
            categories={categories}
            navigate={navigate}
            onAskAI={handleAskAI}
          />
        )}

        {currentRoute === 'products' && (
          <ProductsPage
            products={products}
            categories={categories}
            navigate={navigate}
            onAskAI={handleAskAI}
          />
        )}

        {currentRoute === 'product-detail' && (
          <ProductDetailPage
            product={activeProduct}
            allProducts={products}
            navigate={navigate}
            onAskAI={handleAskAI}
          />
        )}

        {currentRoute === 'wholesale' && (
          <WholesalePage onAskAI={(prompt) => handleAskAI(null, prompt)} />
        )}

        {currentRoute === 'checkout' && (
          <CheckoutPage navigate={navigate} />
        )}

        {currentRoute === 'order-confirmation' && (
          <OrderConfirmationPage
            orderNumber={routeParam || 'ISP-2026-1041'}
            navigate={navigate}
          />
        )}

        {currentRoute === 'track' && (
          <OrderTrackingPage navigate={navigate} />
        )}

        {currentRoute === 'about' && (
          <AboutPage navigate={navigate} />
        )}

        {(currentRoute === 'privacy' || currentRoute === 'terms' || currentRoute === 'delivery-returns') && (
          <LegalPage type={currentRoute as any} navigate={navigate} />
        )}
      </main>

      {/* Slide-over Cart Drawer */}
      <CartDrawer navigate={navigate} />

      {/* 24/7 AI Sales Agent Chatbot */}
      <AIChatWidget
        onSelectProduct={(p) => navigate('product-detail', p.slug || p.id)}
        externalPrompt={aiExternalPrompt}
        onClearExternalPrompt={() => setAiExternalPrompt(null)}
      />

      {/* Site Footer */}
      <Footer navigate={navigate} />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
