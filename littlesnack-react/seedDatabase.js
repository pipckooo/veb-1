const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

// Ті самі налаштування, що і в src/firebase.js
const firebaseConfig = {
    apiKey: "AIzaSyDFPhlWCCWwvpT2_dB_hPTgFWB8oJ8gPLI",
    authDomain: "veb-1-1fd82.firebaseapp.com",
    projectId: "veb-1-1fd82",
    storageBucket: "veb-1-1fd82.firebasestorage.app",
    messagingSenderId: "137481838299",
    appId: "1:137481838299:web:96180a8622d8ea0dbc36fe",
    measurementId: "G-K7ZH8XWYTB"
};

const menuItems = [
    {
        name: "Піца Кватро Формаджі",
        price: 245,
        category: "піца",
        description: "Класична італійська піца з чотирма видами сиру: моцарела, пармезан, горгонзола та едам.",
        image: "KvadroForm_1200x800.webp"
    },
    {
        name: "Бургер 'Дабл Біф'",
        price: 190,
        category: "бургери",
        description: "Дві соковиті яловичі котлети, бекон, сир чеддер та фірмовий соус.",
        image: "Burder_double_beef.webp"
    },
    {
        name: "Салат Цезар з куркою",
        price: 165,
        category: "салати",
        description: "Свіжий ромен, обсмажене куряче філе, грінки, пармезан та соус Цезар.",
        image: "salat-czezar-z-kurkoyu-1024x1024.jpg"
    },
    {
        name: "Паста Карбонара",
        price: 180,
        category: "паста",
        description: "Спагетті з копченою грудинкою, яєчним жовтком та тертим пармезаном.",
        image: "carbonara.jpg"
    }
];

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedDatabase() {
    console.log('Починаємо додавання страв у Firebase Firestore...');
    const menuCollection = collection(db, 'menu');

    for (const item of menuItems) {
        try {
            const docRef = await addDoc(menuCollection, item);
            console.log(`Додано: ${item.name} (ID: ${docRef.id})`);
        } catch (e) {
            console.error(`Помилка під час додавання ${item.name}: `, e);
        }
    }
    console.log('Готово! Усі страви успішно додані.');
    process.exit();
}

seedDatabase();
