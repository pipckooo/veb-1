import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Header = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Помилка при виході:', error);
        }
    };

    return (
        <header>
            <div className="container header-content">
                <div className="logo">
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        Little<span>Snack</span>
                    </Link>
                </div>
                <nav id="main-nav">
                    <ul style={{ display: 'flex', alignItems: 'center', gap: '1rem', listStyle: 'none', margin: 0, padding: 0 }}>
                        <li><Link to="/">Меню</Link></li>
                        <li><Link to="/cart">Кошик</Link></li>
                        <li><Link to="/orders">Мої замовлення</Link></li>
                        {user ? (
                            <>
                                <li style={{ fontWeight: 'bold' }}>{user.email}</li>
                                <li>
                                    <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#ffb703', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}>Вийти</button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/login" style={{ color: '#ffb703', fontWeight: 'bold' }}>Вхід</Link></li>
                                <li><Link to="/register" style={{ color: '#ffb703', fontWeight: 'bold' }}>Реєстрація</Link></li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
