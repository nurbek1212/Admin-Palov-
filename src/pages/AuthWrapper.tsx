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

type AuthWrapperProps = {
  children?: React.ReactNode;
};

type FormData = {
  phone: string;
  password: string;
  name: string;
  email: string;
};

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState<FormData>({
    phone: '',
    password: '',
    name: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (!formData.phone || !formData.password) {
        throw new Error('Telefon raqam va parol kiritilishi shart');
      }

      // Foydalanuvchi ma'lumotlarini localStorage ga saqlash
      const userData = {
        phone: formData.phone,
        name: '', // Login holatida name bo'lmaydi
        email: '', // Login holatida email bo'lmaydi
        address: ''
      };
      
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userData', JSON.stringify(userData));

      navigate('/profile');
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
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (!formData.name || !formData.phone || !formData.password) {
        throw new Error('Ism, telefon raqam va parol kiritilishi shart');
      }

      // Foydalanuvchi ma'lumotlarini localStorage ga saqlash
      const userData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || '', // Email ixtiyoriy
        address: ''
      };
      
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userData', JSON.stringify(userData));

      navigate('/profile');
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

  if (isAuthenticated || localStorage.getItem('isAuthenticated')) {
    return <>{children}</>;
  }

  return (
    <div className="auth-wrapper auth-background d-flex align-items-center justify-content-center min-vh-100">
      <div className="auth-card p-4 w-100" style={{ maxWidth: '450px' }}>
        <h2 className="text-white text-center mb-4">
          {activeTab === 'login' ? 'Kabinetga kirish' : 'Ro‘yxatdan o‘tish'}
        </h2>

        <div className="d-flex justify-content-center mb-4">
          <button
            className={`btn me-2 auth-tab-button ${activeTab === 'login' ? 'btn-light' : 'btn-outline-light'}`}
            onClick={() => setActiveTab('login')}
          >
            Kirish
          </button>
          <button
            className={`btn auth-tab-button ${activeTab === 'register' ? 'btn-light' : 'btn-outline-light'}`}
            onClick={() => setActiveTab('register')}
          >
            Ro'yxatdan o'tish
          </button>
        </div>

        {error && <div className="auth-error text-white p-2 mb-3 rounded">{error}</div>}

        <form onSubmit={activeTab === 'login' ? handleLogin : handleRegister}>
          {activeTab === 'register' && (
            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text"><FaUser /></span>
                <input
                  type="text"
                  name="name"
                  className="form-control auth-input"
                  placeholder="Ismingiz"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          )}

          <div className="mb-3">
            <div className="input-group">
              <span className="input-group-text"><FaPhone /></span>
              <input
                type="tel"
                name="phone"
                className="form-control auth-input"
                placeholder="+998 90 123 45 67"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {activeTab === 'register' && (
            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text"><FaEnvelope /></span>
                <input
                  type="email"
                  name="email"
                  className="form-control auth-input"
                  placeholder="email@example.uz"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          <div className="mb-3">
            <div className="input-group">
              <span className="input-group-text"><FaLock /></span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="form-control auth-input"
                placeholder={activeTab === 'register' ? 'Parol yarating' : 'Parolingiz'}
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                className="btn btn-outline-light auth-password-toggle"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-light w-100 auth-button d-flex align-items-center justify-content-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spinner-border spinner-border-sm auth-loading" role="status" aria-hidden="true" />
            ) : activeTab === 'login' ? (
              <><FaSignInAlt /> Kirish</>
            ) : (
              <><FaUserPlus /> Ro'yxatdan o'tish</>
            )}
          </button>
        </form>

        <div className="text-center mt-3">
          {activeTab === 'login' ? (
            <>
              Akkauntingiz yo‘qmi?{' '}
              <button
                className="btn btn-link text-white auth-link p-0"
                onClick={() => setActiveTab('register')}
              >
                Ro'yxatdan o'tish
              </button>
            </>
          ) : (
            <>
              Akkauntingiz bormi?{' '}
              <button
                className="btn btn-link text-white auth-link p-0"
                onClick={() => setActiveTab('login')}
              >
                Kirish
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthWrapper;