import axios from 'axios';

// Backend server portini tekshirish
const API_URL = 'http://localhost:3000/api';  // 5000 portidan 3000 portiga o'zgartirildi

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Xatolik xabarlarini o'zbek tiliga o'zgartirish
const getErrorMessage = (error: any): string => {
    if (error?.response) {
        const status = error.response.status;
        const message = error.response.data?.message;
        const errors = error.response.data?.errors;

        // Backend validatsiya xatoliklari
        if (errors && Array.isArray(errors)) {
            const errorMessages = errors.map(err => {
                switch (err.field) {
                    case 'phone':
                        return 'Telefon raqam noto\'g\'ri formatda';
                    case 'password':
                        return 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak';
                    case 'name':
                        return 'Ism kiritilmagan';
                    case 'email':
                        return 'Email noto\'g\'ri formatda';
                    default:
                        return err.message;
                }
            });
            return errorMessages.join('\n');
        }

        // Backend xatolik xabarlarini tekshirish
        if (message) {
            switch (message) {
                case 'User already exists':
                    return 'Bu telefon raqam allaqachon ro\'yxatdan o\'tgan';
                case 'Invalid credentials':
                    return 'Telefon raqam yoki parol noto\'g\'ri';
                case 'User not found':
                    return 'Foydalanuvchi topilmadi';
                case 'Invalid token':
                    return 'Sessiya muddati tugagan';
                case 'Validation error':
                    return 'Iltimos, barcha maydonlarni to\'g\'ri to\'ldiring';
                default:
                    return message;
            }
        }

        // HTTP status kodlari bo'yicha xatolik xabarlari
        switch (status) {
            case 400:
                return 'Iltimos, barcha maydonlarni to\'g\'ri to\'ldiring:\n' +
                       '- Telefon raqam (+998XXXXXXXXX formatida)\n' +
                       '- Parol (kamida 6 ta belgi)\n' +
                       '- Ism (ro\'yxatdan o\'tish uchun)';
            case 401:
                return 'Avtorizatsiyadan o\'tmagan. Iltimos, qaytadan kiring';
            case 403:
                return 'Ruxsat yo\'q. Iltimos, admin bilan bog\'laning';
            case 404:
                return 'Server topilmadi. Iltimos, backend serverni ishga tushiring:\n1. Backend papkasiga o\'ting\n2. npm run dev buyrug\'ini ishga tushiring';
            case 500:
                return 'Server xatosi. Iltimos, quyidagi qadamlarni bajarib ko\'ring:\n1. Backend server ishga tushirilganligini tekshiring\n2. Backend konsolida xatoliklarni tekshiring\n3. Backend server qayta ishga tushiring';
            default:
                return 'Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring';
        }
    }

    // Tarmoq xatoliklari
    if (error?.message?.includes('Network Error')) {
        return 'Tarmoq xatosi. Iltimos, quyidagi qadamlarni tekshiring:\n1. Internet aloqangizni tekshiring\n2. Backend server ishga tushirilganligini tekshiring\n3. Backend server portini tekshiring (5000)';
    }

    return 'Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring';
};

// Request interceptor - har so'rovda token qo'shish
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(new Error(getErrorMessage(error)));
    }
);

// Response interceptor - xatoliklarni boshqarish
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('userData');
            window.location.href = '/authwrapper';
        }
        return Promise.reject(new Error(getErrorMessage(error)));
    }
);

export default api; 