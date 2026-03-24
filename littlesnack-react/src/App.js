import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  const [orders, setOrders] = useState([]);

  const fetchOrdersFromBackend = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      setOrders(data);
    } catch (e) {
      console.error("Помилка завантаження замовлень з сервера:", e);
    }
  };

  useEffect(() => {
    fetchOrdersFromBackend();
  }, []);

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [trash, setTrash] = useState(() => {
    const savedTrash = localStorage.getItem('trash');
    return savedTrash ? JSON.parse(savedTrash) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('trash', JSON.stringify(trash));
  }, [trash]);

  useEffect(() => {
    // Ми тепер не зберігаємо історію локально, бо вона в базі!
  }, [orders]);

  const handleAddToCart = (item, quantity = 1) => {
    setCart(prevCart => {
      const existing = prevCart.find(c => c.id === item.id);
      if (existing) {
        return prevCart.map(c => c.id === item.id ? { ...c, quantity } : c);
      } else {
        return [...prevCart, { ...item, quantity }];
      }
    });
  };

  const handleQtyChange = (id, delta) => {
    const item = cart.find(c => c.id === id);
    if (!item) return;

    const newQty = (item.quantity || 1) + delta;

    if (newQty < 1) {
      handleRemoveFromCart(id);
    } else {
      setCart(prevCart => {
        return prevCart.map(item => {
          if (item.id === id) {
            return { ...item, quantity: newQty };
          }
          return item;
        });
      });
    }
  };

  const handleRemoveFromCart = (id) => {
    const itemToRemove = cart.find(c => c.id === id);
    if (!itemToRemove) return;

    const removedItem = {
      ...itemToRemove,
      deletedAt: new Date().toLocaleString(),
      quantity: Math.max(itemToRemove.quantity, 1)
    };

    setTrash(prevTrash => [removedItem, ...prevTrash]);
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const handleRestoreFromTrash = (index) => {
    const itemToRestore = trash[index];
    const { deletedAt, ...cleanItem } = itemToRestore;

    setCart(prevCart => {
      const existing = prevCart.find(c => c.id === cleanItem.id);
      if (existing) {
        return prevCart.map(c => c.id === cleanItem.id ? { ...c, quantity: c.quantity + cleanItem.quantity } : c);
      } else {
        return [...prevCart, cleanItem];
      }
    });

    setTrash(prevTrash => prevTrash.filter((_, i) => i !== index));
  };

  const handleOrderSuccess = async () => {
    setCart([]);
    localStorage.removeItem('cart');
    await fetchOrdersFromBackend();
  };

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<MenuPage cart={cart} onAddToCart={handleAddToCart} onQtyChange={handleQtyChange} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/cart"
            element={
              <CartPage
                cart={cart}
                trash={trash}
                onQtyChange={handleQtyChange}
                onRemoveFromCart={handleRemoveFromCart}
                onRestoreFromTrash={handleRestoreFromTrash}
              />
            }
          />
          <Route path="/orders" element={<OrdersPage orders={orders} onRefresh={fetchOrdersFromBackend} />} />
          <Route path="/checkout" element={<CheckoutPage cart={cart} onPlaceOrder={handleOrderSuccess} />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
