import api from './api';
import axios from 'axios';

interface UserData {
  name: string;
  phone: string;
  email?: string;
  password: string;
}

interface LoginData {
  phone: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    phone: string;
    email?: string;
    role: 'user' | 'admin';
  };
}

// Xatolik xabarlarini o'zbek tiliga o'zgartirish
const getErrorMessage = (error: any): string => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (message) {
      switch (message) {
        case 'User already exists':
          return 'Bu foydalanuvchi allaqachon mavjud';
        case 'Invalid credentials':
          return 'Telefon raqam yoki parol noto\'g\'ri';
        case 'User not found':
          return 'Foydalanuvchi topilmadi';
        case 'Invalid token':
          return 'Sessiya muddati tugagan';
        default:
          return message;
      }
    }
    if (error.response?.status === 404) {
      return 'Server topilmadi';
    }
    if (error.response?.status === 500) {
      return 'Server xatosi';
    }
  }
  return 'Xatolik yuz berdi';
};

// Ro'yxatdan o'tish
export const register = async (userData: UserData): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Kirish
export const login = async (credentials: LoginData): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Profil ma'lumotlarini olish
export const getProfile = async (): Promise<AuthResponse['user']> => {
  try {
    const response = await api.get<AuthResponse['user']>('/auth/profile');
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Chiqish
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userData');
}; 