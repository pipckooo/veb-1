import React, { useState } from 'react';

const DishCard = ({ item, onAddToCart, onQtyChange, cartQuantity }) => {
    const [localQty, setLocalQty] = useState(1);
    const isInCart = cartQuantity > 0;

    const handleQtyChange = (delta) => {
        if (isInCart) {
            onQtyChange(item.id, delta);
        } else {
            const newQty = localQty + delta;
            if (newQty >= 1) {
                setLocalQty(newQty);
            }
        }
    };

    const handleAddClick = () => {
        onAddToCart(item, localQty);
    };

    return (
        <article className="dish-card">
            <img src={`${process.env.PUBLIC_URL}/${item.image}`} alt={item.name} />
            <div className="dish-info">
                <h3>{item.name}</h3>
                <p className="description">{item.description}</p>
                <span className="price">{item.price} грн</span>
                <div className="menu-action-row">
                    <div className="quantity-controls" style={{ display: isInCart ? 'flex' : 'none' }}>
                        <button
                            className="qty-btn"
                            onClick={() => handleQtyChange(-1)}
                            style={{ backgroundColor: (isInCart && cartQuantity === 1) ? '#ffe0e0' : '' }}
                        >
                            -
                        </button>
                        <input
                            type="number"
                            className="qty-input"
                            value={isInCart ? cartQuantity : localQty}
                            readOnly
                        />
                        <button className="qty-btn" onClick={() => handleQtyChange(1)}>+</button>
                    </div>
                    <button
                        className="btn-add"
                        style={{ display: isInCart ? 'none' : 'block' }}
                        onClick={handleAddClick}
                    >
                        Додати
                    </button>
                    <button
                        className="btn-add btn-added"
                        style={{ display: isInCart ? 'block' : 'none', minWidth: '100px' }}
                        disabled
                    >
                        Додано! ({cartQuantity})
                    </button>
                </div>
            </div>
        </article>
    );
};

export default DishCard;
