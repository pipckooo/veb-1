import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CartPage = ({ cart, trash, onQtyChange, onRemoveFromCart, onRestoreFromTrash }) => {
    const [isCartVisible, setIsCartVisible] = useState(true);
    const [isTrashVisible, setIsTrashVisible] = useState(false);

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

    return (
        <main className="container">
            <section id="cart">
                <h2 className="section-title">Ваш Кошик</h2>

                <button
                    onClick={() => setIsCartVisible(!isCartVisible)}
                    className="btn-secondary"
                    style={{ marginRight: '10px', marginBottom: '15px' }}
                >
                    {isCartVisible ? 'Приховати кошик' : 'Показати кошик'}
                </button>

                <button
                    onClick={() => setIsTrashVisible(!isTrashVisible)}
                    className="btn-secondary"
                    style={{ marginBottom: '15px', backgroundColor: '#6c757d' }}
                >
                    Смітник 🗑️ {trash.length > 0 ? `(${trash.length})` : ''}
                </button>

                {isCartVisible && (
                    <div className="card">
                        <div className="cart-items">
                            {cart.length === 0 ? (
                                <p>Ваш кошик порожній.</p>
                            ) : (
                                <>
                                    <div className="cart-item header" style={{ fontWeight: 'bold', borderBottom: '2px solid #ddd', paddingBottom: '5px', marginBottom: '10px' }}>
                                        <span className="item-name" style={{ flex: 2 }}>Назва страви</span>
                                        <span style={{ flex: 1, textAlign: 'center' }}>Кількість</span>
                                        <span style={{ flex: 1, textAlign: 'right', paddingRight: '40px' }}>Сума</span>
                                    </div>
                                    {cart.map((item) => (
                                        <div key={item.id} className="cart-item">
                                            <span className="item-name" style={{ flex: 2 }}>
                                                {item.name} <span style={{ color: '#888', fontSize: '0.9em' }}>({item.quantity} шт.)</span>
                                            </span>
                                            <div className="quantity-controls" style={{ flex: 1, justifyContent: 'center' }}>
                                                <button className="qty-btn" onClick={() => onQtyChange(item.id, -1)}>-</button>
                                                <input
                                                    type="number"
                                                    className="qty-input"
                                                    value={item.quantity || 1}
                                                    readOnly
                                                />
                                                <button className="qty-btn" onClick={() => onQtyChange(item.id, 1)}>+</button>
                                            </div>
                                            <span className="item-price" style={{ flex: 1, textAlign: 'right', paddingRight: '15px' }}>
                                                {item.price * (item.quantity || 1)} грн
                                            </span>
                                            <button className="cart-item-remove" onClick={() => onRemoveFromCart(item.id)}>✕</button>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>

                        <div className="cart-summary">
                            <div className="total">
                                <span><strong>Разом до сплати: </strong></span>
                                <span className="total-amount">{totalAmount} грн</span>
                            </div>
                            {cart.length > 0 && (
                                <Link
                                    to="/checkout"
                                    className="btn-order"
                                    style={{ textDecoration: 'none', display: 'inline-block', marginTop: '15px' }}
                                >
                                    Оформити замовлення
                                </Link>
                            )}
                        </div>
                    </div>
                )}

                {isTrashVisible && (
                    <div className="card" style={{ borderColor: '#6c757d' }}>
                        <h3 style={{ marginTop: 0, color: '#666' }}>Видалені страви (Смітник)</h3>
                        <div id="trash-container">
                            {trash.length === 0 ? (
                                <p style={{ color: '#999' }}>Смітник порожній.</p>
                            ) : (
                                trash.map((item, index) => (
                                    <div key={index} className="cart-item" style={{ borderBottom: '1px dashed #ccc', opacity: 0.8, padding: '12px 0' }}>
                                        <div style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
                                            <span className="item-name" style={{ fontSize: '1.1em' }}><strong>{item.name}</strong></span>
                                            <small style={{ color: '#888', marginTop: '4px' }}>🕒 {item.deletedAt}</small>
                                        </div>
                                        <div style={{ flex: 1, textAlign: 'center', color: '#555' }}>
                                            <small style={{ display: 'block', fontSize: '0.75em', textTransform: 'uppercase' }}>Кількість</small>
                                            <strong>{item.quantity} шт.</strong>
                                        </div>
                                        <div style={{ flex: 1, textAlign: 'right', marginRight: '15px' }}>
                                            <small style={{ display: 'block', fontSize: '0.75em', textTransform: 'uppercase', color: '#888' }}>Сума</small>
                                            <span className="item-price" style={{ color: '#d00', fontWeight: 'bold' }}>{item.price * item.quantity} грн</span>
                                        </div>
                                        <button
                                            className="qty-btn"
                                            onClick={() => onRestoreFromTrash(index)}
                                            title="Відновити страву"
                                            style={{ background: '#f8f9fa', border: '1px solid #ddd', fontSize: '1.2em', padding: '5px 10px' }}
                                        >
                                            🔄
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
};

export default CartPage;
