export const menuItems = [
    {
        id: 1,
        name: "Піца Кватро Формаджі",
        price: 245,
        category: "піца",
        description: "Класична італійська піца з чотирма видами сиру: моцарела, пармезан, горгонзола та едам.",
        image: "KvadroForm_1200x800.webp"
    },
    {
        id: 2,
        name: "Бургер 'Дабл Біф'",
        price: 190,
        category: "бургери",
        description: "Дві соковиті яловичі котлети, бекон, сир чеддер та фірмовий соус.",
        image: "Burder_double_beef.webp"
    },
    {
        id: 3,
        name: "Салат Цезар з куркою",
        price: 165,
        category: "салати",
        description: "Свіжий ромен, обсмажене куряче філе, грінки, пармезан та соус Цезар.",
        image: "salat-czezar-z-kurkoyu-1024x1024.jpg"
    },
    {
        id: 4,
        name: "Паста Карбонара",
        price: 180,
        category: "паста",
        description: "Спагетті з копченою грудинкою, яєчним жовтком та тертим пармезаном.",
        image: "carbonara.jpg"
    }
];

export const defaultOrders = [
    { id: "2481", date: "15.02.2026, 18:30", items: "Паста Карбонара, Лимонад домашній", status: "completed", statusText: "Виконано" },
    { id: "2395", date: "10.02.2026, 20:45", items: "Бургер 'Дабл Біф', Картопля фрі", status: "rejected", statusText: "Відмовлено" }
];
