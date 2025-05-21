import React, { useState } from 'react';
import './ContactForm.css';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };

    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Ism kiritish majburiy';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email kiritish majburiy';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Noto\'g\'ri email formati';
      isValid = false;
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Mavzu kiritish majburiy';
      isValid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Xabar kiritish majburiy';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Bu yerda API ga so'rov yuborish mumkin
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulyatsiya uchun
      
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Xabar yuborishda xatolik:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="contact-form-container success-message">
        <h2>Xabar muvaffaqiyatli yuborildi!</h2>
        <p>Tez orada siz bilan bog'lanamiz.</p>
        <button 
          className="submit-button"
          onClick={() => setSubmitSuccess(false)}
        >
          Yangi xabar yuborish
        </button>
      </div>
    );
  }

  return (
    <div className="contact-form-container">
      <h2>Biz bilan bog'laning</h2>
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="name">Ism</label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ismingizni kiriting"
            className={errors.name ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email manzilingizni kiriting"
            className={errors.email ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="subject">Mavzu</label>
          <input
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Xabar mavzusini kiriting"
            className={errors.subject ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.subject && <span className="error-message">{errors.subject}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="message">Xabar</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Xabaringizni kiriting"
            rows={5}
            className={errors.message ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.message && <span className="error-message">{errors.message}</span>}
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Yuborilmoqda...' : 'Yuborish'}
        </button>
      </form>
    </div>
  );
};

export default ContactForm; 