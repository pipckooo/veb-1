import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const CheckoutPage = ({ cart, onPlaceOrder }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoadingAuth(false);
        });
        return () => unsubscribe();
    }, []);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        payment: 'cash',
        time: 'asap',
        specificTime: '',
        comments: ''
    });

    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState({
        orderId: '',
        deliveryTime: ''
    });

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.phone || !formData.address) {
            alert("Будь ласка, заповніть всі обов'язкові поля!");
            return;
        }

        // ПІДГОТОВКА ДАНИХ ДЛЯ СЕРВЕРА
        const orderData = {
            ...formData,
            userId: user.uid, // Додаємо ID користувача для фільтрації
            items: cart, // Масив об'єктів для серверної валідації (1-10 страв)
            itemsString: cart.map(i => `${i.name} x${i.quantity}`).join(', '), // Рядок для відображення
            date: new Date().toLocaleString('uk-UA'),
            timestamp: Date.now(),
            status: "completed",
            statusText: "Обробляється"
        };

        try {
            // ВІДПРАВКА НА СЕРВЕР
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();

            if (response.ok) {
                setModalData({ orderId: result.id, deliveryTime: "40-55 хв" });
                setShowModal(true);
            } else {
                // Вивід серверної помилки (валідація 1-10 страв)
                alert("Помилка від сервера: " + (result.error || "Невідома помилка"));
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert("Сервер бекенду (порт 5000) недоступний! Переконайтеся, що ви запустили 'node server.js'.");
        }
    };

    const handleCloseModal = () => {
        onPlaceOrder(); // Це лише оновить список у App.js (завантажить з сервера)
        setShowModal(false);
        navigate('/orders');
    };

    if (loadingAuth) {
        return <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>Завантаження...</div>;
    }

    if (!user) {
        return (
            <main className="container" style={{ padding: '4rem 1rem', minHeight: '60vh' }}>
                <section id="checkout">
                    <h1 className="section-title">Оформлення замовлення</h1>
                    <div className="card checkout-container" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                        <h2 style={{ color: '#d9534f', marginBottom: '1rem' }}>Необхідна авторизація</h2>
                        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
                            Для завершення замовлення потрібно увійти в систему. Тільки авторизовані користувачі можуть оформлювати замовлення.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <Link to="/login" style={{ padding: '10px 20px', background: '#ffb703', color: '#023047', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}>Увійти</Link>
                            <Link to="/register" style={{ padding: '10px 20px', background: '#333', color: '#fff', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}>Зареєструватися</Link>
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="container">
            <section id="checkout">
                <h1 className="section-title">Оформлення замовлення</h1>
                <div className="card checkout-container">
                    <form className="checkout-form" onSubmit={handleSubmit}>
                        <div className="order-summary-list">
                            <h3>Ваше замовлення:</h3>
                            {cart.map((item, index) => (
                                <div key={index} className="order-item">
                                    <span className="item-name">{item.name}</span>
                                    <span className="item-qty">{item.quantity} шт.</span>
                                    <span className="item-price">{item.price * item.quantity} грн</span>
                                </div>
                            ))}
                        </div>

                        <div className="form-group">
                            <label htmlFor="name">Ваше Ім'я:</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Введіть ваше ім'я" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Номер телефону:</label>
                            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+380" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">Адреса доставки:</label>
                            <textarea id="address" name="address" rows="3" value={formData.address} onChange={handleInputChange} placeholder="Вулиця, будинок, квартира" required></textarea>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="payment">Спосіб оплати:</label>
                                <select id="payment" name="payment" value={formData.payment} onChange={handleInputChange}>
                                    <option value="cash">Готівка кур'єру</option>
                                    <option value="card_courier">Картою кур'єру</option>
                                    <option value="card_online">Оплата онлайн</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="time">Час доставки:</label>
                                <select id="time" name="time" value={formData.time} onChange={handleInputChange}>
                                    <option value="asap">Якнайшвидше</option>
                                    <option value="30min">Через 30 хв</option>
                                    <option value="60min">Через 1 годину</option>
                                    <option value="specific">На вказаний час</option>
                                </select>
                                {formData.time === 'specific' && (
                                    <input type="time" id="specific-time" name="specificTime" value={formData.specificTime} onChange={handleInputChange} style={{ marginTop: '5px' }} />
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="comments">Коментар до замовлення:</label>
                            <textarea id="comments" name="comments" rows="2" value={formData.comments} onChange={handleInputChange} placeholder="Наприклад: не працює домофон"></textarea>
                        </div>

                        <div className="checkout-summary">
                            <div className="total">
                                <span><strong>Сума до сплати: </strong></span>
                                <span className="total-amount">{totalAmount} грн</span>
                            </div>
                            <button type="submit" className="btn-order">Підтвердити замовлення</button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Modal UI */}
            {showModal && (
                <div className="modal-overlay" style={{ display: 'flex' }}>
                    <div className="modal-content">
                        <button className="modal-close" onClick={handleCloseModal}>&times;</button>
                        <div className="modal-header">
                            <h2>Замовлення прийнято!</h2>
                        </div>
                        <div className="modal-body">
                            <p>Дякуємо! Ваша страва вже готується.</p>
                            <div className="order-info-box">
                                <p><strong>Номер замовлення:</strong> #{modalData.orderId}</p>
                                <p><strong>Час доставки:</strong> {modalData.deliveryTime}</p>
                            </div>
                            <p>Бажаємо приємного апетиту!</p>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default CheckoutPage;
