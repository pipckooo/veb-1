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

const defaultOrders = [
    { id: "2481", date: "15.02.2026, 18:30", items: "Паста Карбонара, Лимонад домашній", status: "completed", statusText: "Виконано" },
    { id: "2395", date: "10.02.2026, 20:45", items: "Бургер 'Дабл Біф', Картопля фрі", status: "rejected", statusText: "Відмовлено" }
];

let ordersHistory = JSON.parse(localStorage.getItem('orders_history')) || [];
if (ordersHistory.length === 0) {
    ordersHistory = defaultOrders;
} else if (!ordersHistory.some(o => o.id === "2481")) {
    ordersHistory = [...ordersHistory, ...defaultOrders];
}

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function renderMenu() {
    const container = document.getElementById('menu-container');
    if (!container) return;

    let html = "";
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
    container.innerHTML = html;
    assignAddToCartListeners();
}

function assignAddToCartListeners() {
    const buttons = document.querySelectorAll('.btn-add');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', function () {
            const index = this.getAttribute('data-index');
            addToCart(index, this);
        });
    }
}

function renderCart() {
    const container = document.getElementById('cart-container');
    const totalDisplay = document.getElementById('cart-total');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = "<p>Ваш кошик порожній.</p>";
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
    container.innerHTML = html;
    totalDisplay.innerText = total + " грн";

    localStorage.setItem('cart', JSON.stringify(cart));
}

function renderOrders() {
    const container = document.getElementById('orders-container');
    if (!container) return;

    let html = "";
    let counter = 0;

    while (counter < ordersHistory.length) {
        const order = ordersHistory[counter];

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
    container.innerHTML = html;
}

function toggleCartVisibility() {
    const cartSection = document.getElementById('cart-card');
    if (cartSection.style.display === 'none' || cartSection.style.display === '') {
        cartSection.style.display = 'block';
    } else {
        cartSection.style.display = 'none';
    }
}

function initHoverEffects() {
    const cards = document.querySelectorAll('.dish-card');
    for (let i = 0; i < cards.length; i++) {
        cards[i].addEventListener('mouseenter', function () {
            const priceElement = this.querySelector('.price');
            const price = parseInt(priceElement.innerText);

            if (price > 200) {
                this.style.border = "2px solid #d00";
                this.style.backgroundColor = "#fff5f5";
            } else {
                this.style.border = "2px solid #28a745";
                this.style.backgroundColor = "#f5fff5";
            }
        });

        cards[i].addEventListener('mouseleave', function () {
            this.style.border = "1px solid #ddd";
            this.style.backgroundColor = "#fff";
        });
    }
}

function addToCart(index, button) {
    const item = menuItems[index];

    const existingItem = cart.find(c => c.name === item.name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    button.classList.add('btn-added');
    button.innerText = "Додано!";
    button.disabled = true;

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

function updateAllTimers() {
    const timers = document.querySelectorAll('.order-timer-inline');
    if (timers.length === 0) return;

    for (let i = 0; i < timers.length; i++) {
        const timer = timers[i];
        const startTime = parseInt(timer.getAttribute('data-start'));
        const duration = 30 * 60 * 1000;
        const now = Date.now();
        const elapsed = now - startTime;
        const remaining = duration - elapsed;

        if (remaining <= 0) {
            timer.parentElement.innerHTML = "Доставлено!";
        } else {
            const minutes = Math.floor(remaining / (60 * 1000));
            const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
            timer.innerHTML = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        }
    }
}

window.onload = () => {
    renderMenu();
    renderCart();
    renderOrders();
    initHoverEffects();
    setInterval(updateAllTimers, 1000);
    updateAllTimers();
};
