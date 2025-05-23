import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaLock,
  FaSignInAlt,
  FaUserPlus,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import { login, register, LoginData, RegisterData } from '../api/auth';
import './authwrapper.css';

type AuthWrapperProps = {
  children?: React.ReactNode;
};

type FormData = {
  phone: string;
  password: string;
  name: string;
  email: string;
  confirmPassword: string;
};

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState<FormData>({
    phone: '',
    password: '',
    name: '',
    email: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!formData.phone || !formData.password) {
        throw new Error('Telefon raqam va parol kiritilishi shart');
      }

      const loginData: LoginData = {
        phone: formData.phone,
        password: formData.password
      };

      const response = await login(loginData);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('userData', JSON.stringify(response.user));
      localStorage.setItem('isAuthenticated', 'true');
      
      window.location.href = '/profile';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xatolik yuz berdi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!formData.name || !formData.phone || !formData.password) {
        throw new Error('Ism, telefon raqam va parol kiritilishi shart');
      }

      const registerData: RegisterData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
        password: formData.password
      };

      const response = await register(registerData);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('userData', JSON.stringify(response.user));
      localStorage.setItem('isAuthenticated', 'true');
      
      window.location.href = '/profile';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xatolik yuz berdi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      phone: '',
      password: '',
      confirmPassword: ''
    };

    if (!formData.phone) {
      newErrors.phone = 'Telefon raqamni kiriting';
      isValid = false;
    } else if (!/^\+998[0-9]{9}$/.test(formData.phone)) {
      newErrors.phone = 'Telefon raqam noto\'g\'ri formatda';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Parolni kiriting';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak';
      isValid = false;
    }

    if (activeTab === 'register' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Parollar mos kelmadi';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (activeTab === 'register') {
        await register(formData.phone, formData.password);
      } else {
        await login(formData.phone, formData.password);
      }
      navigate('/');
    } catch (error: any) {
      setError(error.message);
      
      // Backend xatoliklarini input xatoliklariga aylantirish
      if (error.message.includes('telefon raqam')) {
        setErrors(prev => ({ ...prev, phone: error.message }));
      } else if (error.message.includes('parol')) {
        setErrors(prev => ({ ...prev, password: error.message }));
      }
    }
  };

  return (
    <div className="auth-page mt-4">
      <div className="auth-container">
        <div className="auth-header">
          <h2>
            {activeTab === 'login' ? 'Kabinetga kirish' : 'Ro\'yxatdan o\'tish'}
          </h2>
        </div>

        <div className="tab-buttons">
          <button
            className={`tab-button ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Kirish
          </button>
          <button
            className={`tab-button ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Ro'yxatdan o'tish
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={activeTab === 'login' ? handleLogin : handleRegister}>
          {activeTab === 'register' && (
            <div className="form-group">
              <div className="input-group">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="Ismingiz"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <div className="input-group">
              <FaPhone className="input-icon" />
              <input
                type="tel"
                name="phone"
                className={`form-input ${errors.phone ? 'error' : ''}`}
                placeholder="+998 90 123 45 67"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  setErrors(prev => ({ ...prev, phone: '' }));
                }}
                required
              />
            </div>
            {errors.phone && <span className="input-error">{errors.phone}</span>}
          </div>

          {activeTab === 'register' && (
            <div className="form-group">
              <div className="input-group">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="email@example.uz"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder={activeTab === 'register' ? 'Parol yarating' : 'Parolingiz'}
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  setErrors(prev => ({ ...prev, password: '' }));
                }}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <span className="input-error">{errors.password}</span>}
          </div>

          {activeTab === 'register' && (
            <div className="form-group">
              <div className="input-group">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Parolni tasdiqlang"
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, confirmPassword: e.target.value });
                    setErrors(prev => ({ ...prev, confirmPassword: '' }));
                  }}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && <span className="input-error">{errors.confirmPassword}</span>}
            </div>
          )}

          <button
            type="submit"
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
            ) : activeTab === 'login' ? (
              <><FaSignInAlt /> Kirish</>
            ) : (
              <><FaUserPlus /> Ro'yxatdan o'tish</>
            )}
          </button>
        </form>

        <div className="switch-text">
          {activeTab === 'login' ? (
            <span>
              Akkauntingiz yo'qmi?{' '}
              <div
                className="switch-link d-inline-block"
                onClick={() => setActiveTab('register')}
              >
                Ro'yxatdan o'tish
              </div>
            </span>
          ) : (
            <span>
              Akkauntingiz bormi?{' '}
              <div
                className="switch-link d-inline-block"
                onClick={() => setActiveTab('login')}
              >
                Kirish
              </div>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthWrapper;