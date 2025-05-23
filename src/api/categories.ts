import api from './index';

export interface Category {
    id: number;
    name: string;
    image?: string;
}

export const getCategories = async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/categories');
    return response.data;
};

export const createCategory = async (categoryData: Omit<Category, 'id'>): Promise<Category> => {
    const response = await api.post<Category>('/categories', categoryData);
    return response.data;
};

export const updateCategory = async (id: number, categoryData: Partial<Category>): Promise<Category> => {
    const response = await api.put<Category>(`/categories/${id}`, categoryData);
    return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
}; 