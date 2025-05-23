import api from './index';

export interface Dish {
    id: number;
    name: string;
    description?: string;
    price: number;
    image_url?: string;
    category_id: number;
    category_name?: string;
    is_available: boolean;
}

export interface CreateDishData {
    name: string;
    description?: string;
    price: number;
    image_url?: string;
    category_id: number;
    is_available?: boolean;
}

export const dishesApi = {
    getAll: async () => {
        const response = await api.get<Dish[]>('/dishes');
        return response.data;
    },

    getOne: async (id: number) => {
        const response = await api.get<Dish>(`/dishes/${id}`);
        return response.data;
    },

    create: async (data: CreateDishData) => {
        const response = await api.post<Dish>('/dishes', data);
        return response.data;
    },

    update: async (id: number, data: CreateDishData) => {
        const response = await api.put<Dish>(`/dishes/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await api.delete(`/dishes/${id}`);
        return response.data;
    }
}; 