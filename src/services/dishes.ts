import api from './api';

interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  category_id: number;
  is_featured: boolean;
}

// Barcha taomlarni olish
export const getDishes = async (): Promise<Dish[]> => {
  try {
    const response = await api.get<Dish[]>('/dishes');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

// Yangi taom qo'shish
export const createDish = async (dishData: Omit<Dish, 'id'>): Promise<Dish> => {
  try {
    const response = await api.post<Dish>('/dishes', dishData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

// Taomni yangilash
export const updateDish = async (id: number, dishData: Partial<Dish>): Promise<Dish> => {
  try {
    const response = await api.put<Dish>(`/dishes/${id}`, dishData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

// Taomni o'chirish
export const deleteDish = async (id: number): Promise<void> => {
  try {
    await api.delete(`/dishes/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
}; 