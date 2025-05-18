import { NavLink } from 'react-router-dom';
import { useBasket } from '../context/BasketContext';

const Basket = () => {
    const { products, clearBasket, updateQuantity, removeFromBasket } = useBasket();

    const totalAmount = products.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = products.reduce((total, item) => total + item.quantity, 0);

    if (products.length === 0) {
        return (
            <div className="empty-basket">
                <div className="empty-content">
                    <i className="bi bi-cart-x"></i>
                    <h2>Savat bo'sh</h2>
                    <p>Hozircha savatingizda mahsulot yo'q</p>
                    <NavLink to="/menu" className="back-btn">
                        <i className="bi bi-arrow-left"></i> Menyuga qaytish
                    </NavLink>
                </div>
            </div>
        );
    }

    return (
        <div className="basket-page pt-5">
            <div className="container pt-5">
                <div className="basket-card">
                    <div className="basket-header">
                        <h2>
                            <i className="bi bi-cart3"></i>
                            Savatingiz
                            <span className="badge">{totalItems} dona</span>
                        </h2>
                    </div>

                    <div className="items-list">
                        {products.map((item) => (
                            <div key={item.id} className="product-card">
                                <img 
                                    src={item.image || '/images/default-food.jpg'} 
                                    alt={item.name} 
                                    className="product-image"
                                />
                                <div className="product-info">
                                    <div className="product-header">
                                        <h3>{item.name}</h3>
                                        <button 
                                            className="delete-btn"
                                            onClick={() => removeFromBasket(item.id)}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                    
                                    <div className="product-controls">
                                        <div className="quantity-selector">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                <i className="bi bi-dash"></i>
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >
                                                <i className="bi bi-plus"></i>
                                            </button>
                                        </div>
                                        
                                        <div className="price-info">
                                            <p>{item.price.toLocaleString()} so'm × {item.quantity}</p>
                                            <h4>{(item.price * item.quantity).toLocaleString()} so'm</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="basket-footer">
                        <div className="total-sum">
                            <h3>Jami:</h3>
                            <h2>{totalAmount.toLocaleString()} so'm</h2>
                        </div>
                        
                        <div className="action-btns">
                            <button className="clear-btn" onClick={clearBasket}>
                                <i className="bi bi-trash"></i> Savatni tozalash
                            </button>
                            <NavLink to="/Order" className="order-btn">
                                <i className="bi bi-credit-card"></i> Buyurtma berish
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Basket;