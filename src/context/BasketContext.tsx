import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';

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

interface BasketProviderProps {
  children: ReactNode;
}

export const BasketProvider: React.FC<BasketProviderProps> = ({ children }) => {
  // Mahsulotlar holatini localStorage'dan yuklash
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const savedBasket = localStorage.getItem(LOCAL_STORAGE_KEY);
      return savedBasket ? JSON.parse(savedBasket) : [];
    } catch (error) {
      console.error('LocalStorage ma\'lumotlarini o\'qishda xato:', error);
      return [];
    }
  });

  // Savat o‘zgarganda localStorage'ga saqlash
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
      } catch (error) {
        console.error('LocalStorage ga yozishda xato:', error);
      }
    }
  }, [products]);

  // Mahsulot qo‘shish yoki miqdorini oshirish
  const addToBasket = (item: Product) => {
    setProducts((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + item.quantity } : p
        );
      }
      return [...prev, item];
    });
  };

  // Savatni tozalash
  const clearBasket = () => {
    setProducts([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  // Miqdorni yangilash
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) {
      removeFromBasket(id);
      return;
    }
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, quantity } : p)));
  };

  // Mahsulotni olib tashlash
  const removeFromBasket = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Jami mahsulotlar soni
  const totalItems = useMemo(() => 
    products.reduce((sum, item) => sum + item.quantity, 0), 
    [products]
  );

  // Jami summa
  const totalAmount = useMemo(() =>
    products.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [products]
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
        totalAmount,
      }}
    >
      {children}
    </BasketContext.Provider>
  );
};

export const useBasket = () => {
  const context = useContext(BasketContext);
  if (!context) throw new Error('useBasket must be used within BasketProvider');
  return context;
};

// Misol: Savat summasi va tozalash tugmasi
export function BasketSummary() {
  const { totalItems, totalAmount, clearBasket } = useBasket();

  return (
    <div>
      <p>Mahsulotlar soni: {totalItems}</p>
      <p>Jami summa: {totalAmount} so'm</p>
      <button onClick={clearBasket}>Savatni tozalash</button>
    </div>
  );
}
