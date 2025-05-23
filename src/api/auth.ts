import api from './index';

export interface LoginData {
    phone: string;
    password: string;
}

export interface RegisterData {
    name: string;
    phone: string;
    email?: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: number;
        name: string;
        phone: string;
        email?: string;
        role: 'user' | 'admin';
    };
}

export const login = async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
};

export const getProfile = async (): Promise<AuthResponse['user']> => {
    const response = await api.get<AuthResponse['user']>('/auth/profile');
    return response.data;
};

export const updateProfile = async (data: Partial<RegisterData>): Promise<AuthResponse['user']> => {
    const response = await api.put<AuthResponse['user']>('/auth/profile', data);
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}; 