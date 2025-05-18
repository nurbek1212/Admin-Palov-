import React, { useState, useEffect } from 'react';
import { useBasket } from '../context/BasketContext';
import { useNavigate } from 'react-router-dom';

const Order = () => {
  const { products, clearBasket, updateQuantity, removeFromBasket } = useBasket();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    payment: 'cash',
    deliveryTime: 'asap',
    notes: ''
  });
  
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  // LocalStoragedan oldingi ma'lumotlarni olish
  useEffect(() => {
    const savedData = localStorage.getItem('orderFormData');
    if (savedData) setFormData(JSON.parse(savedData));
  }, []);

  // Forma ma'lumotlarini saqlash
  useEffect(() => {
    localStorage.setItem('orderFormData', JSON.stringify(formData));
  }, [formData]);

  const totalPrice = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const showMessage = (text, type = 'success', duration = 5000) => {
    if (timeoutId) clearTimeout(timeoutId);
    setMessage({ text, type });
    const id = setTimeout(() => setMessage({ text: '', type: '' }), duration);
    setTimeoutId(id);
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromBasket(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validatsiya
    if (!formData.name.trim()) {
      showMessage('Iltimos, ismingizni kiriting', 'error');
      setIsSubmitting(false);
      return;
    }

    if (!formData.phone.trim() || !/^\+?\d{9,15}$/.test(formData.phone)) {
      showMessage('Iltimos, to‘g‘ri telefon raqam kiriting', 'error');
      setIsSubmitting(false);
      return;
    }

    if (!formData.address.trim()) {
      showMessage('Iltimos, yetkazib berish manzilini kiriting', 'error');
      setIsSubmitting(false);
      return;
    }

    if (products.length === 0) {
      showMessage('Savat bo‘sh, iltimos mahsulot qo‘shing', 'error');
      setIsSubmitting(false);
      return;
    }

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const orderData = {
        ...formData,
        products: products.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          quantity: p.quantity,
          image: p.image
        })),
        totalPrice,
        orderDate: new Date().toISOString(),
        orderId: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      };
      
      // Buyurtma tarixini saqlash
      const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      orderHistory.unshift(orderData);
      localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
      
      showMessage(
        `Rahmat, ${formData.name}! Buyurtmangiz qabul qilindi. Yetkazib berish ID: ${orderData.orderId}`,
        'success',
        10000
      );
      
      clearBasket();
      setTimeout(() => navigate('/menu'), 10000);
      
    } catch (error) {
      console.error('Buyurtma xatosi:', error);
      showMessage('Xatolik yuz berdi. Iltimos, qayta urunib ko‘ring', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (products.length === 0 && !message.text) {
    return (
      <div className="order-page pt-5">
        <div className="order-container pt-5">
          <div className="order-header">
            <h1 className="order-title">Buyurtma Berish</h1>
          </div>
          
          <div className="empty-cart-message">
            <div className="empty-cart-content">
              <i className="bi bi-cart-x"></i>
              <h2>Savat bo'sh</h2>
              <p>Sizning savatingizda hozircha mahsulotlar mavjud emas</p>
              <button 
                onClick={() => navigate('/menu')} 
                className="back-to-menu-btn"
              >
                <i className="bi bi-arrow-left"></i> Menyuga qaytish
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-page pt-5">
      <div className="order-container pt-5">
        <div className="order-header">
          <h1 className="order-title">Buyurtma Berish</h1>
          <p className="order-subtitle">Mahsulotlaringizni qulay tarzda buyurtma qiling</p>
        </div>

        <div className="order-content">
          <div className="order-summary">
            <h3 className="summary-title">
              <i className="bi bi-cart3"></i> Savatdagi Mahsulotlar
            </h3>
            
            <div className="order-items-container">
              {products.length === 0 ? (
                <div className="empty-cart-placeholder">
                  <i className="bi bi-cart-x"></i>
                  <p>Savatda mahsulotlar mavjud emas</p>
                </div>
              ) : (
                <>
                  <ul className="order-items">
                    {products.map(p => (
                      <li key={p.id} className="order-item">
                        <div className="item-details">
                          <img 
                            src={p.image || '/images/food-placeholder.jpg'} 
                            alt={p.name} 
                            className="item-image"
                          />
                          <div className="item-info">
                            <span className="item-name">{p.name}</span>
                            <span className="item-price">{p.price.toLocaleString()} so'm</span>
                          </div>
                        </div>
                        <div className="item-quantity">
                          <button
                            className="quantity-btn"
                            onClick={() => handleQuantityChange(p.id, p.quantity - 1)}
                          >
                            <i className="bi bi-dash"></i>
                          </button>
                          <span className="quantity-value">{p.quantity}</span>
                          <button
                            className="quantity-btn"
                            onClick={() => handleQuantityChange(p.id, p.quantity + 1)}
                          >
                            <i className="bi bi-plus"></i>
                          </button>
                          <button
                            className="remove-btn"
                            onClick={() => removeFromBasket(p.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="order-total">
                    <span>Jami summa:</span>
                    <span className="total-price">{totalPrice.toLocaleString()} so'm</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="order-form-section">
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">
                    <i className="bi bi-person"></i> Ismingiz *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Toʻliq ismingiz"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">
                    <i className="bi bi-telephone"></i> Telefon raqamingiz *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+998 90 123 45 67"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <i className="bi bi-envelope"></i> Elektron pochta (ixtiyoriy)
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">
                  <i className="bi bi-geo-alt"></i> Yetkazib berish manzili *
                </label>
                <textarea
                  id="address"
                  name="address"
                  className="form-control"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Toʻliq manzil (koʻcha, uy, kvartira, orientir)"
                  required
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="payment">
                    <i className="bi bi-credit-card"></i> Toʻlov usuli
                  </label>
                  <select
                    id="payment"
                    name="payment"
                    className="form-control"
                    value={formData.payment}
                    onChange={handleChange}
                  >
                    <option value="cash">Naqd pul</option>
                    <option value="card">Karta orqali</option>
                    <option value="online">Onlayn toʻlov</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="deliveryTime">
                    <i className="bi bi-clock"></i> Yetkazish vaqti
                  </label>
                  <select
                    id="deliveryTime"
                    name="deliveryTime"
                    className="form-control"
                    value={formData.deliveryTime}
                    onChange={handleChange}
                  >
                    <option value="asap">Imkon qadar tezroq</option>
                    <option value="30">30 daqiqadan keyin</option>
                    <option value="60">1 soatdan keyin</option>
                    <option value="120">2 soatdan keyin</option>
                    <option value="custom">Belgilangan vaqt</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="notes">
                  <i className="bi bi-chat-left-text"></i> Qoʻshimcha izohlar (ixtiyoriy)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  className="form-control"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Buyurtmangizga oid qoʻshimcha izohlar..."
                  rows={3}
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="back-btn"
                  onClick={() => navigate(-1)}
                  disabled={isSubmitting}
                >
                  <i className="bi bi-arrow-left"></i> Orqaga
                </button>
                
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting || products.length === 0}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      JO‘NATILMOQDA...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle"></i>
                      BUYURTMA BERISH
                    </>
                  )}
                </button>
              </div>
            </form>

            {message.text && (
              <div className={`message ${message.type}`}>
                <div className="message-content">
                  <i className={`bi ${
                    message.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'
                  }`}></i>
                  <span>{message.text}</span>
                </div>
                <button 
                  className="message-close"
                  onClick={() => setMessage({ text: '', type: '' })}
                >
                  <i className="bi bi-x"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;