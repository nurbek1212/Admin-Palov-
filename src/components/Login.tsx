import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';
import './Login.module.css';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        phone: '',
        password: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const data = await login(formData);
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userData', JSON.stringify(data.user));
            navigate('/profile');
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Kirish</h2>
                
                {error && <div className="error-message">{error}</div>}
                
                <div className="form-group">
                    <label>Telefon raqam:</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+998 90 123 45 67"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Parol:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Kutilmoqda...' : 'Kirish'}
                </button>
            </form>
        </div>
    );
};

export default Login; 