const express = require('express');
const cors = require('cors');
const path = require('path');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  // На хостингу (Render/Heroku) зчитуємо зі змінної оточення
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  } catch (error) {
    console.error("Помилка парсингу FIREBASE_SERVICE_ACCOUNT_KEY:", error);
  }
} else {
  // На локальному комп'ютері з файлу
  try {
    serviceAccount = require('./serviceAccountKey.json');
  } catch (error) {
    console.error("Помилка завантаження serviceAccountKey.json файлу. Будь ласка, переконайтеся що він існує локально.");
  }
}

if (serviceAccount) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
} else {
    console.error("Firebase не ініціалізовано! Перевірте налаштування.");
}

const db = admin.firestore();

// КРИТИЧНО ДЛЯ VERCEL: Вимикаємо gRPC, який викликає таймаути 504
if (process.env.VERCEL) {
    db.settings({ preferRest: true });
}

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Serving static files (React build folder)
const buildPath = path.join(__dirname, 'littlesnack-react/build');
app.use(express.static(buildPath));

// Доповнення для роботи React Router (завдання 5 лаби)
app.get('*', (req, res) => {
  // Перевіряємо, чи шлях не починається з /api (щоб не зламати бекенд)
  if (!req.url.startsWith('/api')) {
    res.sendFile(path.join(buildPath, 'index.html'));
  }
});

// ЗАВДАННЯ 2 & 3: Отримання всіх замовлень (GET)
app.get('/api/orders', async (req, res) => {
    try {
        const snapshot = await db.collection('orders').get();
        const orders = [];
        snapshot.forEach(doc => {
            orders.push({ id: doc.id, ...doc.data() });
        });
        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: "Помилка при отриманні замовлень" });
    }
});

// ЗАВДАННЯ 4: Створення замовлення з валідацією (POST)
app.post('/api/orders', async (req, res) => {
    const orderData = req.body; // Очікуємо об'єкт замовлення з масивом items
    
    console.log("-----------------------------------------");
    console.log("Отримано НОВЕ замовлення від:", orderData.name);
    console.log("Кількість страв у кошику:", orderData.items ? orderData.items.length : 0);

    // Валідація за вашим варіантом (мінімум 1, максимум 10 страв)
    if (!orderData.items || orderData.items.length < 1) {
        return res.status(400).json({ error: "Мінімальна кількість страв: 1" });
    }
    if (orderData.items.length > 10) {
        return res.status(400).json({ error: "Максимальна кількість страв: 10" });
    }

    try {
        // Додаємо дату замовлення на сервері
        orderData.createdAt = admin.firestore.FieldValue.serverTimestamp();
        
        const docRef = await db.collection('orders').add(orderData);
        res.json({ id: docRef.id, message: "Замовлення успішно створено!" });
    } catch (error) {
        console.error("Error adding order:", error);
        res.status(500).json({ error: "Помилка при створенні замовлення" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT}/index.html to view your site`);
});

module.exports = app;
