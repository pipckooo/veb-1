/**
 * ЛАБОРАТОРНА РОБОТА №2
 * Тема: Основи JavaScript
 * Варіант 12: Вебсайт платформи для замовлення їжі
 */

// 1. Дані для меню (Об'єкти)
const menuItems = [
    {
        name: "Піца Кватро Формаджі",
        price: 245,
        description: "Класична італійська піца з чотирма видами сиру: моцарела, пармезан, горгонзола та едам.",
        image: "KvadroForm_1200x800.webp"
    },
    {
        name: "Бургер 'Дабл Біф'",
        price: 190,
        description: "Дві соковиті яловичі котлети, бекон, сир чеддер та фірмовий соус.",
        image: "Burder_double_beef.webp"
    },
    {
        name: "Салат Цезар з куркою",
        price: 165,
        description: "Свіжий ромен, обсмажене куряче філе, грінки, пармезан та соус Цезар.",
        image: "salat-czezar-z-kurkoyu-1024x1024.jpg"
    },
    {
        name: "Паста Карбонара",
        price: 180,
        description: "Спагетті з копченою грудинкою, яєчним жовтком та тертим пармезаном.",
        image: "carbonara.jpg"
    }
];

// 2. Історія замовлень (Завантаження з пам'яті + фейкові дані)
const defaultOrders = [
    { id: "2481", date: "15.02.2026, 18:30", items: "Паста Карбонара, Лимонад домашній", status: "completed", statusText: "Виконано" },
    { id: "2395", date: "10.02.2026, 20:45", items: "Бургер 'Дабл Біф', Картопля фрі", status: "rejected", statusText: "Відмовлено" }
];

// Об'єднуємо збережені замовлення з дефолтними
let ordersHistory = JSON.parse(localStorage.getItem('orders_history')) || [];
if (ordersHistory.length === 0) {
    ordersHistory = defaultOrders;
} else if (!ordersHistory.some(o => o.id === "2481")) {
    // Якщо історія не порожня, але в ній немає дефолтних, додаємо їх в кінець
    ordersHistory = [...ordersHistory, ...defaultOrders];
}

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// --- ФУНКЦІЇ ВІДОБРАЖЕННЯ ---

// Завдання 1: Генерація меню за допомогою циклу FOR
// DOM: document.getElementById знаходить контейнер у дереві DOM
function renderMenu() {
    const container = document.getElementById('menu-container');
    if (!container) return;

    let html = "";
    // ВИМОГА: Використання циклу FOR
    for (let i = 0; i < menuItems.length; i++) {
        const item = menuItems[i];
        html += `
            <article class="dish-card">
                <img src="${item.image}" alt="${item.name}">
                <div class="dish-info">
                    <h3>${item.name}</h3>
                    <p class="description">${item.description}</p>
                    <span class="price">${item.price} грн</span>
                    <button class="btn-add" data-index="${i}">Додати</button>
                </div>
            </article>
        `;
    }
    // DOM: .innerHTML дозволяє JavaScript вставити новий HTML-код всередину знайденого вузла
    container.innerHTML = html;

    // Завдання 2, Крок 3: Призначення обробників через цикл
    assignAddToCartListeners();
}

// Функція для призначення подій через цикл (DOM Interaction)
function assignAddToCartListeners() {
    // DOM: .querySelectorAll вибирає групу вузлів (NodeList) з документа
    const buttons = document.querySelectorAll('.btn-add');
    // ВИМОГА: Використання циклу for для додавання обробників
    for (let i = 0; i < buttons.length; i++) {
        // DOM: .addEventListener підключає "слухача" події прямо до вузла DOM
        buttons[i].addEventListener('click', function () {
            const index = this.getAttribute('data-index');
            addToCart(index, this);
            // Ця дія змінює вміст області кошика на сторінці
        });
    }
}

// Завдання 1: Генерація кошика за допомогою циклу FOR
function renderCart() {
    // DOM: document.getElementById знаходить контейнер у дереві DOM
    const container = document.getElementById('cart-container');
    // DOM: document.getElementById знаходить елемент для відображення загальної суми
    const totalDisplay = document.getElementById('cart-total');
    if (!container) return;

    if (cart.length === 0) {
        // DOM: .innerHTML дозволяє JavaScript вставити новий HTML-код всередину знайденого вузла
        container.innerHTML = "<p>Ваш кошик порожній.</p>";
        // DOM: .innerText оновлює текстовий вміст елемента
        totalDisplay.innerText = "0 грн";
        return;
    }

    let html = "";
    let total = 0;

    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        total += item.price * (item.quantity || 1);
        html += `
            <div class="cart-item">
                <span class="item-name">${item.name}</span>
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="changeQuantity(${i}, -1)">-</button>
                    <input type="number" class="qty-input" value="${item.quantity || 1}" onchange="updateQuantity(${i}, this.value)">
                    <button class="qty-btn" onclick="changeQuantity(${i}, 1)">+</button>
                </div>
                <span class="item-price">${item.price * (item.quantity || 1)} грн</span>
                <button class="cart-item-remove" onclick="removeFromCart(${i})">✕</button>
            </div>
        `;
    }
    // DOM: .innerHTML дозволяє JavaScript вставити новий HTML-код всередину знайденого вузла
    container.innerHTML = html;
    // DOM: .innerText оновлює текстовий вміст елемента
    totalDisplay.innerText = total + " грн";

    // Збереження в localStorage для сторінки оформлення
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Завдання 1: Генерація історії замовлень за допомогою циклу WHILE
function renderOrders() {
    // DOM: document.getElementById знаходить контейнер у дереві DOM
    const container = document.getElementById('orders-container');
    if (!container) return;

    let html = "";
    let counter = 0;

    // ВИМОГА: Використання циклу WHILE
    while (counter < ordersHistory.length) {
        const order = ordersHistory[counter];

        // Перевіряємо, чи є в замовлення таймер (лише для нових замовлень з сайту)
        let timerHtml = "";
        if (order.timestamp) {
            timerHtml = `
                <div class="order-timer-box">
                    Доставка через: <span class="order-timer-inline" data-start="${order.timestamp}">--:--</span>
                </div>
            `;
        }

        html += `
            <div class="order-card card">
                <div class="order-header">
                    <span class="order-id">Замовлення #${order.id}</span>
                </div>
                <div class="order-details">
                    <div class="details-left">
                        <p class="order-items-list">${order.items}</p>
                    </div>
                    <div class="details-right">
                        <span class="order-date">${order.date}</span>
                        ${timerHtml}
                        <div class="order-status ${order.status}">${order.statusText}</div>
                    </div>
                </div>
            </div>
        `;
        counter++;
    }
    // DOM: .innerHTML дозволяє JavaScript вставити новий HTML-код всередину знайденого вузла
    container.innerHTML = html;
}

// --- ЛОГІКА ТА ПОДІЇ ---

// DOM: Маніпуляція властивостями вузла (Крок 2)
function toggleCartVisibility() {
    const cartSection = document.getElementById('cart-card');
    // DOM: .style дає доступ до CSS-властивостей об'єкта в реальному часі
    if (cartSection.style.display === 'none' || cartSection.style.display === '') {
        cartSection.style.display = 'block';
    } else {
        cartSection.style.display = 'none';
    }
}

// DOM: Робота з подіями миші та стилізацією (Крок 4)
function initHoverEffects() {
    const cards = document.querySelectorAll('.dish-card');
    // ВИМОГА: Цикл для додавання обробників наведення
    for (let i = 0; i < cards.length; i++) {
        // DOM: Призначення функцій-обробників на події наведення (mouseenter)
        cards[i].addEventListener('mouseenter', function () {
            const priceElement = this.querySelector('.price');
            const price = parseInt(priceElement.innerText);

            // ВИМОГА: Умовна логіка if-else (Завдання 2, Крок 4)
            if (price > 200) {
                // DOM: Динамічна зміна стилів фону та рамки
                this.style.border = "2px solid #d00"; // Акцент для дорогих страв
                this.style.backgroundColor = "#fff5f5";
            } else {
                this.style.border = "2px solid #28a745"; // Акцент для бюджетних страв
                this.style.backgroundColor = "#f5fff5";
            }
        });

        cards[i].addEventListener('mouseleave', function () {
            this.style.border = "1px solid #ddd";
            this.style.backgroundColor = "#fff";
        });
    }
}

// Завдання 2: Кнопка "Додати", зміна кольору та додавання в кошик
function addToCart(index, button) {
    const item = menuItems[index];

    // Перевіряємо, чи є вже такий товар у кошику (Завдання 2 покращення)
    const existingItem = cart.find(c => c.name === item.name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    // Зміна кольору та тексту (Завдання 2)
    button.classList.add('btn-added');
    button.innerText = "Додано!";
    button.disabled = true;

    // Повертаємо через 1 секунду
    setTimeout(() => {
        button.classList.remove('btn-added');
        button.innerText = "Додати";
        button.disabled = false;
    }, 1000);

    renderCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}

// Нові функції для керування кількістю (Завдання 2 покращення)
function changeQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity < 1) {
        removeFromCart(index);
    } else {
        renderCart();
    }
}

function updateQuantity(index, value) {
    const newQty = parseInt(value);
    if (isNaN(newQty) || newQty < 1) {
        cart[index].quantity = 1;
    } else {
        cart[index].quantity = newQty;
    }
    renderCart();
}

// Завдання 1: Система таймерів (Використання КЛАСИЧНОГО ЦИКЛУ FOR для DOM)
function updateAllTimers() {
    const timers = document.querySelectorAll('.order-timer-inline');
    if (timers.length === 0) return;

    // ВИМОГА: Цикл FOR для перебору колекції елементів (Завдання 1, Крок 2)
    for (let i = 0; i < timers.length; i++) {
        const timer = timers[i];
        const startTime = parseInt(timer.getAttribute('data-start'));
        const duration = 30 * 60 * 1000;
        const now = Date.now();
        const elapsed = now - startTime;
        const remaining = duration - elapsed;

        // Умовна логіка if-else (Завдання 1, Крок 3)
        if (remaining <= 0) {
            timer.parentElement.innerHTML = "Доставлено!";
        } else {
            const minutes = Math.floor(remaining / (60 * 1000));
            const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
            timer.innerHTML = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        }
    }
}

// Ініціалізація сторінки
window.onload = () => {
    renderMenu();
    renderCart();
    renderOrders();
    initHoverEffects();
    // Запускаємо глобальний цикл оновлення таймерів
    setInterval(updateAllTimers, 1000);
    updateAllTimers();
};
