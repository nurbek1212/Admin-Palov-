import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Support = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="support-page pt-5">
      <div className="support-container pt-5">
        <div className="support-header">
          <h1><i className="bi bi-headset"></i> Yordam Markazi</h1>
          <p>Biz bilan bog'laning - 24/7 qo'llab-quvvatlash xizmati</p>
        </div>

        <div className="support-content">
          <div className="contact-form-wrapper">
            <div className="contact-form">
              <h2><i className="bi bi-envelope-paper"></i> Xabar Qoldiring</h2>
              {isSubmitted && (
                <div className="success-message">
                  <i className="bi bi-check-circle"></i> Xabaringiz yuborildi!
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ismingiz"
                    required
                  />
                  <i className="bi bi-person"></i>
                </div>

                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email manzilingiz"
                    required
                  />
                  <i className="bi bi-envelope"></i>
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Mavzu"
                    required
                  />
                  <i className="bi bi-tag"></i>
                </div>

                <div className="form-group">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Xabaringiz..."
                    required
                    rows={5}
                  ></textarea>
                  <i className="bi bi-chat-text"></i>
                </div>

                <button type="submit" className="submit-btn">
                  <i className="bi bi-send"></i> Xabarni Yuborish
                </button>
              </form>
            </div>
          </div>

          <div className="contact-info-wrapper">
            <div className="contact-info">
              <h2><i className="bi bi-telephone"></i> Bog'lanish</h2>
              
              <div className="info-card">
                <div className="info-icon">
                  <i className="bi bi-telephone-fill"></i>
                </div>
                <div className="info-content">
                  <h3>Qo'ng'iroq qiling</h3>
                  <p>+998 90 123 45 67</p>
                  <p>Dushanba-Juma: 9:00 - 18:00</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <i className="bi bi-envelope-fill"></i>
                </div>
                <div className="info-content">
                  <h3>Email yuboring</h3>
                  <p>support@restoran.uz</p>
                  <p>24 soat ichida javob</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <i className="bi bi-chat-dots-fill"></i>
                </div>
                <div className="info-content">
                  <h3>Tezkor yordam</h3>
                  <p>Telegram: @restoran_support</p>
                  <NavLink to="/faq" className="faq-link">
                    <i className="bi bi-question-circle"></i> Ko'p beriladigan savollar
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;