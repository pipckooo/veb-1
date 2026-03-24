import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/'); // Перенаправляємо на головну після реєстрації
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '400px', margin: '0 auto', minHeight: '60vh' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Реєстрація</h2>
      {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input 
          type="password" 
          placeholder="Пароль" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" className="button" style={{ marginTop: '1rem', width: '100%' }}>
          Зареєструватися
        </button>
      </form>
      <p style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        Вже маєте акаунт? <Link to="/login" style={{ color: '#ffb703', textDecoration: 'none', fontWeight: 'bold' }}>Увійти</Link>
      </p>
    </div>
  );
}

export default RegisterPage;
