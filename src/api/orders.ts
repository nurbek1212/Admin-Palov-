import api from './index';

export interface OrderItem {
    dish_id: number;
    quantity: number;
    price: number;
    dish_name?: string;
}

export interface Order {
    id: number;
    user_id: number;
    username?: string;
    full_name?: string;
    total_price: number;
    status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
    items: OrderItem[];
    created_at: string;
}

export interface CreateOrderData {
    user_id: number;
    total_price: number;
    status?: string;
    items: OrderItem[];
}

export const ordersApi = {
    getAll: async () => {
        const response = await api.get<Order[]>('/orders');
        return response.data;
    },

    getOne: async (id: number) => {
        const response = await api.get<Order>(`/orders/${id}`);
        return response.data;
    },

    create: async (data: CreateOrderData) => {
        const response = await api.post<Order>('/orders', data);
        return response.data;
    },

    update: async (id: number, data: { status: string }) => {
        const response = await api.put<Order>(`/orders/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await api.delete(`/orders/${id}`);
        return response.data;
    }
}; 