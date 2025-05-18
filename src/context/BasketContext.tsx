import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type BasketContextType = {
  products: Product[];
  addToBasket: (item: Product) => void;
  clearBasket: () => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeFromBasket: (id: number) => void;
  totalItems: number;
  totalAmount: number;
};

const BasketContext = createContext<BasketContextType | undefined>(undefined);
const LOCAL_STORAGE_KEY = 'restaurant_basket';

export const BasketProvider = ({ children }: { children: ReactNode }) => {
  // LocalStorage'dan boshlang'ich qiymatlarni yuklash
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window === 'undefined') return []; // SSR uchun
    try {
      const savedBasket = localStorage.getItem(LOCAL_STORAGE_KEY);
      return savedBasket ? JSON.parse(savedBasket) : [];
    } catch (error) {
      console.error('LocalStorage ma\'lumotlarini o\'qishda xato:', error);
      return [];
    }
  });

  // Savat o'zgarganida localStorage'ga yozish
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
      } catch (error) {
        console.error('LocalStorage ga yozishda xato:', error);
      }
    }
  }, [products]);

  const addToBasket = (item: Product) => {
    setProducts((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      const updatedProducts = existing
        ? prev.map((p) =>
            p.id === item.id 
              ? { ...p, quantity: p.quantity + item.quantity } 
              : p
          )
        : [...prev, item];
      
      return updatedProducts;
    });
  };

  const clearBasket = () => {
    setProducts([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) {
      removeFromBasket(id);
      return;
    }
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity } : p))
    );
  };

  const removeFromBasket = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Jami mahsulotlar soni
  const totalItems = products.reduce((sum, item) => sum + item.quantity, 0);
  
  // Jami summa
  const totalAmount = products.reduce(
    (sum, item) => sum + item.price * item.quantity, 
    0
  );

  return (
    <BasketContext.Provider 
      value={{ 
        products, 
        addToBasket, 
        clearBasket, 
        updateQuantity, 
        removeFromBasket,
        totalItems,
        totalAmount
      }}
    >
      {children}
    </BasketContext.Provider>
  );
};

export const useBasket = () => {
  const context = useContext(BasketContext);
  if (!context) throw new Error("useBasket must be used within BasketProvider");
  return context;
};