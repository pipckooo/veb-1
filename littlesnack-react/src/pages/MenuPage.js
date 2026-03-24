// src/pages/MenuPage.js
import React, { useState, useEffect } from 'react';
import DishCard from '../components/DishCard';
import { db } from '../firebase'; // Імпортуємо підключення до Firestore
import { collection, getDocs } from 'firebase/firestore'; // Функції для отримання даних

const MenuPage = ({ cart, onAddToCart, onQtyChange }) => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [menuItems, setMenuItems] = useState([]); // Дані тепер спочатку порожні
    const [loading, setLoading] = useState(true);   // Стан завантаження

    const categories = ['all', 'піца', 'бургери', 'салати', 'паста'];

    // Завантажуємо дані з Firebase при завантаженні сторінки
    useEffect(() => {
        const fetchMenu = async () => {
            try {
                // Вказуємо на колекцію 'menu' у нашій базі db
                const querySnapshot = await getDocs(collection(db, "menu"));
                const itemsArray = [];

                // Проходимось по кожному знайденому документові в базі
                querySnapshot.forEach((doc) => {
                    // doc.data() містить name, price, category...
                    // doc.id містить унікальний ключ з бази
                    itemsArray.push({ id: doc.id, ...doc.data() });
                });
                
                setMenuItems(itemsArray); // Зберігаємо отримані дані у стан
                setLoading(false);        // Вимикаємо індикатор завантаження
            } catch (error) {
                console.error("Помилка при завантаженні меню з Firebase: ", error);
                setLoading(false);
            }
        };

        fetchMenu();
    }, []);

    const filteredItems = activeCategory === 'all'
        ? menuItems
        : menuItems.filter(item => item.category === activeCategory);

    return (
        <main className="container">
            <section id="menu">
                <h1 className="section-title">Наше Меню</h1>

                <div className="category-filters">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.2rem' }}>
                        Завантаження меню з бази даних...
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.2rem', color: '#666' }}>
                        В базі даних ще немає жодної страви. <br/>Додайте їх через Firebase Console у колекцію "menu".
                    </div>
                ) : (
                    <div className="dish-grid">
                        {filteredItems.map((item) => {
                            const cartItem = cart.find(c => c.id === item.id);
                            const cartQty = cartItem ? cartItem.quantity : 0;
                            return (
                                <DishCard
                                    key={item.id}
                                    item={item}
                                    onAddToCart={onAddToCart}
                                    onQtyChange={onQtyChange}
                                    cartQuantity={cartQty}
                                />
                            );
                        })}
                    </div>
                )}
            </section>
        </main>
    );
};

export default MenuPage;
