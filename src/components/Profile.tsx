import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
const Profile = () => {
  const [userData, setUserData] = useState({
    name: 'Foydalanuvchi Ismi',
    phone: '+998 90 123 45 67',
    email: 'user@example.uz',
    address: 'Xorazm Viloyati, Xiva tumani'
  });

  const [orders, setOrders] = useState([
    {
      id: '#12345',
      date: '2023-10-15',
      items: [
        { name: 'Osh', price: 25000, quantity: 2 },
        { name: 'Salat', price: 15000, quantity: 1 }
      ],
      total: 65000,
      status: 'Yetkazib berildi',
      payment: 'Naqd pul'
    },
    {
      id: '#12344',
      date: '2023-10-10',
      items: [
        { name: 'Lag\'mon', price: 28000, quantity: 1 },
        { name: 'Choy', price: 5000, quantity: 2 }
      ],
      total: 38000,
      status: 'Bekor qilindi',
      payment: 'Karta orqali'
    }
  ]);

  const [activeTab, setActiveTab] = useState('orders');

  return (
    <div className="profile-page pt-5">
      <div className="profile-container pt-5">
        <div className="profile-header">
          <h1><i className="bi bi-person-circle"></i> Shaxsiy Kabinet</h1>
        </div>

        <div className="profile-content">
          <div className="profile-sidebar">
            <div className="user-card">
              <div className="user-avatar">
                <i className="bi bi-person"></i>
              </div>
              <h3>{userData.name}</h3>
              <p><i className="bi bi-telephone"></i> {userData.phone}</p>
              <p><i className="bi bi-envelope"></i> {userData.email}</p>
              <p><i className="bi bi-geo-alt"></i> {userData.address}</p>
            </div>

            <nav className="profile-menu">
              <button 
                className={activeTab === 'orders' ? 'active' : ''}
                onClick={() => setActiveTab('orders')}
              >
                <i className="bi bi-cart4"></i> Buyurtmalar tarixi
              </button>
              <button 
                className={activeTab === 'settings' ? 'active' : ''}
                onClick={() => setActiveTab('settings')}
              >
                <i className="bi bi-gear"></i> Sozlamalar
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="settings-tab">
                <h2><i className="bi bi-gear"></i> Shaxsiy ma'lumotlar</h2>
                <form className="profile-form">
                  <div className="form-group">
                    <label>Ismingiz</label>
                    <input 
                      type="text" 
                      placeholder={userData.name}
                      onChange={(e) => setUserData({...userData, name: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Telefon raqam</label>
                    <input 
                      type="tel" 
                      placeholder={userData.phone}
                      onChange={(e) => setUserData({...userData, phone: e.target.value}
                      )}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email manzil</label>
                    <input 
                      type="email" 
                      placeholder={userData.email}
                      onChange={(e) => setUserData({...userData, email: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Asosiy manzil</label>
                    <textarea
                      placeholder={userData.address}
                      onChange={(e) => setUserData({...userData, address: e.target.value})}
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
                      <p>{userData.address}</p>
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