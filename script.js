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
let trash = [];

function renderMenu() {
    const container = document.getElementById('menu-container');
    if (!container) return;

    let html = "";
    for (let i = 0; i < menuItems.length; i++) {
        const item = menuItems[i];
        const cartItem = cart.find(c => c.name === item.name);
        const isInCart = !!cartItem;
        const quantity = isInCart ? cartItem.quantity : 1;

        html += `
            <article class="dish-card">
                <img src="${item.image}" alt="${item.name}">
                <div class="dish-info">
                    <h3>${item.name}</h3>
                    <p class="description">${item.description}</p>
                    <span class="price">${item.price} грн</span>
                    <div class="menu-action-row">
                        <div class="quantity-controls" id="menu-qty-ctrl-${i}" style="display: ${isInCart ? 'flex' : 'none'}">
                            <button class="qty-btn" onclick="changeMenuQuantity(${i}, -1)">-</button>
                            <input type="number" class="qty-input" id="menu-qty-${i}" value="${quantity}" onchange="updateMenuQuantity(${i}, this.value)">
                            <button class="qty-btn" onclick="changeMenuQuantity(${i}, 1)">+</button>
                        </div>
                        <button class="btn-add" id="menu-add-btn-${i}" style="display: ${isInCart ? 'none' : 'block'}" onclick="handleAddToCartClick(${i}, this)">Додати</button>
                        <button class="btn-add btn-added" id="menu-added-btn-${i}" style="display: ${isInCart ? 'block' : 'none'}" disabled>Додано!</button>
                    </div>
                </div>
            </article>
        `;
    }
    container.innerHTML = html;
}

function handleAddToCartClick(index, button) {
    const qtyInput = document.getElementById(`menu-qty-${index}`);
    const quantity = parseInt(qtyInput.value) || 1;
    addToCart(index, button, quantity);
}

function changeMenuQuantity(index, delta) {
    const qtyInput = document.getElementById(`menu-qty-${index}`);
    let newQty = (parseInt(qtyInput.value) || 1) + delta;

    const item = menuItems[index];
    const cartIndex = cart.findIndex(c => c.name === item.name);

    if (newQty < 1) {
        if (cartIndex !== -1) {
            removeFromCart(cartIndex);
        } else {
            qtyInput.value = 1;
        }
        return;
    }

    qtyInput.value = newQty;
    if (cartIndex !== -1) {
        updateQuantity(cartIndex, newQty);
    }
}

function updateMenuQuantity(index, value) {
    let newQty = parseInt(value);
    const item = menuItems[index];
    const cartIndex = cart.findIndex(c => c.name === item.name);

    if (isNaN(newQty) || newQty < 1) {
        if (cartIndex !== -1) {
            removeFromCart(cartIndex);
        } else {
            const qtyInput = document.getElementById(`menu-qty-${index}`);
            if (qtyInput) qtyInput.value = 1;
        }
        return;
    }

    if (cartIndex !== -1) {
        updateQuantity(cartIndex, newQty);
    }
}

function syncMenuWithCart() {
    menuItems.forEach((item, index) => {
        const qtyCtrl = document.getElementById(`menu-qty-ctrl-${index}`);
        const addBtn = document.getElementById(`menu-add-btn-${index}`);
        const addedBtn = document.getElementById(`menu-added-btn-${index}`);
        const qtyInput = document.getElementById(`menu-qty-${index}`);

        if (qtyCtrl && addBtn && addedBtn && qtyInput) {
            const cartItem = cart.find(c => c.name === item.name);
            if (cartItem) {
                qtyCtrl.style.display = 'flex';
                addBtn.style.display = 'none';
                addedBtn.style.display = 'block';
                qtyInput.value = cartItem.quantity;
            } else {
                qtyCtrl.style.display = 'none';
                addBtn.style.display = 'block';
                addedBtn.style.display = 'none';
                qtyInput.value = 1;
            }
        }
    });
}

function renderCart() {
    const container = document.getElementById('cart-container');
    const totalDisplay = document.getElementById('cart-total');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = "<p>Ваш кошик порожній.</p>";
        totalDisplay.innerText = "0 грн";
        localStorage.setItem('cart', JSON.stringify(cart));
        syncMenuWithCart();
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
    syncMenuWithCart();
}

async function renderOrders() {
    const container = document.getElementById('orders-container');
    if (!container) return;

    try {
        const response = await fetch('/api/orders');
        const orders = await response.json();

        let html = "";
        orders.forEach(order => {
            let timerHtml = "";
            if (order.timestamp && order.status !== "completed") {
                timerHtml = `
                    <div class="order-timer-box">
                        Доставка через: <span class="order-timer-inline" data-start="${order.timestamp}">--:--</span>
                    </div>
                `;
            }

            html += `
                <div class="order-card card">
                    <div class="order-header">
                        <span class="order-id">Замовлення #${order.id.slice(-4).toUpperCase()}</span>
                    </div>
                    <div class="order-details">
                        <div class="details-left">
                            <p class="order-items-list">${order.itemsString || "Деталі недоступні"}</p>
                        </div>
                        <div class="details-right">
                            <span class="order-date">${order.date || "Дата не вказана"}</span>
                            ${timerHtml}
                            <div class="order-status ${order.status || 'completed'}">${order.statusText || 'Прийнято'}</div>
                        </div>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html || "<p>Замовлень поки немає.</p>";
    } catch (e) {
        console.error("Error loading orders:", e);
        container.innerHTML = "<p>Не вдалося завантажити замовлення з сервера.</p>";
    }
}

function toggleCartVisibility() {
    const cartSection = document.getElementById('cart-card');
    if (cartSection.style.display === 'none' || cartSection.style.display === '') {
        cartSection.style.display = 'block';
    } else {
        cartSection.style.display = 'none';
    }
}

function toggleTrashVisibility() {
    const trashSection = document.getElementById('trash-card');
    if (trashSection.style.display === 'none' || trashSection.style.display === '') {
        trashSection.style.display = 'block';
        renderTrash();
    } else {
        trashSection.style.display = 'none';
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

function addToCart(index, button, quantity = 1) {
    const item = menuItems[index];

    const existingItem = cart.find(c => c.name === item.name);
    if (existingItem) {
        existingItem.quantity = quantity;
    } else {
        cart.push({ ...item, quantity: quantity });
    }

    renderCart();
}

function removeFromCart(index) {
    let itemData = { ...cart[index] };

    // Якщо кількість вже 0 (через помилку або логіку), вважаємо що видалили 1 останню одиницю
    if (itemData.quantity < 1) itemData.quantity = 1;

    const removedItem = { ...itemData, deletedAt: new Date().toLocaleString() };
    trash.unshift(removedItem);

    cart.splice(index, 1);
    renderCart();
    renderTrash();
}

function renderTrash() {
    const container = document.getElementById('trash-container');
    if (!container) return;

    if (trash.length === 0) {
        container.innerHTML = "<p style='color: #999;'>Смітник порожній.</p>";
        return;
    }

    let html = "";
    for (let i = 0; i < trash.length; i++) {
        const item = trash[i];
        html += `
            <div class="cart-item" style="border-bottom: 1px dashed #ccc; opacity: 0.8; padding: 12px 0;">
                <div style="flex: 2; display: flex; flex-direction: column;">
                    <span class="item-name" style="font-size: 1.1em;"><strong>${item.name}</strong></span>
                    <small style="color: #888; margin-top: 4px;">🕒 ${item.deletedAt}</small>
                </div>
                <div style="flex: 1; text-align: center; color: #555;">
                    <small style="display: block; font-size: 0.75em; text-transform: uppercase;">Кількість</small>
                    <strong>${item.quantity} шт.</strong>
                </div>
                <div style="flex: 1; text-align: right; margin-right: 15px;">
                    <small style="display: block; font-size: 0.75em; text-transform: uppercase; color: #888;">Сума</small>
                    <span class="item-price" style="color: #d00; font-weight: bold;">${item.price * item.quantity} грн</span>
                </div>
                <button class="qty-btn" onclick="restoreFromTrash(${i})" title="Відновити страву" style="background: #f8f9fa; border: 1px solid #ddd; font-size: 1.2em; padding: 5px 10px;">🔄</button>
            </div>
        `;
    }
    container.innerHTML = html;
}

function restoreFromTrash(index) {
    const itemToRestore = trash[index];
    const existingInCart = cart.find(c => c.name === itemToRestore.name);

    if (existingInCart) {
        existingInCart.quantity += itemToRestore.quantity;
    } else {
        const { deletedAt, ...cleanItem } = itemToRestore;
        cart.push(cleanItem);
    }

    trash.splice(index, 1);

    renderCart();
    renderTrash();
}

function changeQuantity(index, delta) {
    if (cart[index].quantity + delta < 1) {
        removeFromCart(index);
    } else {
        cart[index].quantity += delta;
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
    renderTrash();
    renderOrders();
    initHoverEffects();
    setInterval(updateAllTimers, 1000);
    updateAllTimers();
};
