import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  updateQuantity: (sku: string, qty: number) => void;
  removeFromCart: (sku: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalItems: number;
  subtotalRwf: number;
  couponCode: string;
  setCouponCode: (code: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('isuku_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('isuku_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  const addToCart = (item: Omit<CartItem, 'quantity'>, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.sku === item.sku);
      if (existing) {
        return prev.map(i => i.sku === item.sku ? { ...i, quantity: i.quantity + qty } : i);
      }
      return [...prev, { ...item, quantity: qty }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (sku: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(sku);
      return;
    }
    setCart(prev => prev.map(i => i.sku === sku ? { ...i, quantity: qty } : i));
  };

  const removeFromCart = (sku: string) => {
    setCart(prev => prev.filter(i => i.sku !== sku));
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalRwf = cart.reduce((sum, item) => sum + (item.unitPriceRwf * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      totalItems,
      subtotalRwf,
      couponCode,
      setCouponCode
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
