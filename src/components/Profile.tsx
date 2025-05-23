import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import "./Profile.css"
import api from '../services/api';

interface UserData {
  name: string;
  phone: string;
  email: string;
  address: string;
}

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: string;
  payment: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData>({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState('orders');

  // Autentifikatsiyani tekshirish
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/authwrapper');
          return;
        }

        const response = await api.get<UserData>('/auth/profile');
        setUserData(response.data);
      } catch (error) {
        console.error('Error checking auth:', error);
        navigate('/authwrapper');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Buyurtmalarni olish
  useEffect(() => {
    const fetchOrders = async () => {
      if (activeTab === 'orders') {
        try {
          const response = await api.get<Order[]>('/orders');
          setOrders(response.data);
        } catch (error) {
          console.error('Error fetching orders:', error);
          setError('Buyurtmalarni yuklashda xatolik yuz berdi');
        }
      }
    };

    fetchOrders();
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userData');
    navigate('/authwrapper');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await api.put<UserData>('/auth/profile', userData);
      setUserData(response.data);
      alert('Ma\'lumotlar saqlandi!');
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Ma\'lumotlarni saqlashda xatolik yuz berdi');
    }
  };

  const removeOrder = async (id: string) => {
    try {
      await api.delete(`/orders/${id}`);
      setOrders(orders.filter(order => order.id !== id));
    } catch (error) {
      console.error('Error removing order:', error);
      setError('Buyurtmani o\'chirishda xatolik yuz berdi');
    }
  };

  if (loading) {
    return <div className="loading">Yuklanmoqda...</div>;
  }

  return (
    <div className="profile-page pt-5">
      <div className="profile-container pt-5">
        <div className="profile-header">
          <h1><i className="bi bi-person-circle"></i> Shaxsiy Kabinet</h1>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="profile-content">
          <div className="profile-sidebar">
            <div className="user-card">
              <div className="user-avatar">
                <i className="bi bi-person"></i>
              </div>
              <h3>{userData.name || 'Foydalanuvchi'}</h3>
              <p><i className="bi bi-telephone"></i> {userData.phone || 'Telefon raqam kiritilmagan'}</p>
              <p><i className="bi bi-envelope"></i> {userData.email || 'Email kiritilmagan'}</p>
              <p><i className="bi bi-geo-alt"></i> {userData.address || 'Manzil kiritilmagan'}</p>
            </div>

            <nav className="profile-menu">
              <button
                className={activeTab === 'settings' ? 'active' : ''}
                onClick={() => setActiveTab('settings')}
              >
                <i className="bi bi-gear"></i> Sozlamalar
              </button>
              <button
                className={activeTab === 'orders' ? 'active' : ''}
                onClick={() => setActiveTab('orders')}
              >
                <i className="bi bi-cart4"></i> Buyurtmalar tarixi
              </button>
              <button
                className={activeTab === 'addresses' ? 'active' : ''}
                onClick={() => setActiveTab('addresses')}
              >
                <i className="bi bi-house-door"></i> Manzillar
              </button>
              <NavLink to="/support" className="support-link">
                <i className="bi bi-headset"></i> Yordam
              </NavLink>
              <button
                className="profile-menu-btn"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right"></i> Chiqish
              </button>
            </nav>
          </div>

          <div className="profile-main">
            {activeTab === 'orders' && (
              <div className="orders-tab">
                <h2><i className="bi bi-clock-history"></i> Buyurtmalar tarixi</h2>

                {orders.length === 0 ? (
                  <div className="empty-orders">
                    <i className="bi bi-cart-x"></i>
                    <p>Siz hali buyurtma bermagansiz</p>
                    <NavLink to="/menu" className="order-btn">
                      <i className="bi bi-menu-button-wide"></i> Menyuni ko'rish
                    </NavLink>
                  </div>
                ) : (
                  <div className="orders-list">
                    {orders.map((order) => (
                      <div key={order.id} className="order-card">
                        <div className="order-header">
                          <div>
                            <h3>Buyurtma raqami: {order.id}</h3>
                            <p className="order-date">
                              <i className="bi bi-calendar"></i> {order.date}
                            </p>
                          </div>
                          <div className={`order-status ${order.status.toLowerCase().replace(' ', '-')}`}>
                            {order.status}
                          </div>
                        </div>

                        <div className="order-items">
                          <h4>Buyurtmalar:</h4>
                          <ul>
                            {order.items.map((item, index) => (
                              <li key={index}>
                                <span>{item.name}</span>
                                <span>{item.quantity} × {item.price.toLocaleString()} so'm</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="order-footer">
                          <div className="payment-method">
                            <i className="bi bi-credit-card"></i> To'lov usuli: {order.payment}
                          </div>
                          <div className="order-total">
                            Jami: <strong>{order.total.toLocaleString()} so'm</strong>
                          </div>
                        </div>

                        <button
                          className="btn btn-danger mt-2"
                          onClick={() => removeOrder(order.id)}
                        >
                          <i className="bi bi-trash"></i> Buyurtmani o'chirish
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="settings-tab">
                <h2><i className="bi bi-gear"></i> Shaxsiy ma'lumotlar</h2>
                <form className="profile-form" onSubmit={handleSaveProfile}>
                  <div className="form-group">
                    <label>Ismingiz</label>
                    <input
                      type="text"
                      placeholder="Ismingizni kiriting"
                      value={userData.name}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Telefon raqam</label>
                    <input
                      type="tel"
                      placeholder="+998 90 123 45 67"
                      value={userData.phone}
                      onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email manzil</label>
                    <input
                      type="email"
                      placeholder="email@example.uz"
                      value={userData.email}
                      onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Asosiy manzil</label>
                    <textarea
                      placeholder="Manzilingizni kiriting"
                      value={userData.address}
                      onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="save-btn">
                    <i className="bi bi-check-circle"></i> O'zgarishlarni saqlash
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="addresses-tab">
                <h2><i className="bi bi-house-door"></i> Manzillar</h2>
                <div className="addresses-list">
                  <div className="address-card">
                    <div className="address-content">
                      <h3>Asosiy manzil</h3>
                      <p>{userData.address || 'Manzil kiritilmagan'}</p>
                    </div>
                    <div className="address-actions">
                      <button className="edit-btn">
                        <i className="bi bi-pencil"></i> Tahrirlash
                      </button>
                      <button className="delete-btn">
                        <i className="bi bi-trash"></i> O'chirish
                      </button>
                    </div>
                  </div>
                  <button className="add-address-btn">
                    <i className="bi bi-plus-circle"></i> Yangi manzil qo'shish
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;