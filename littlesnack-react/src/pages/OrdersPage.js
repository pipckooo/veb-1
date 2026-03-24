import React, { useState, useEffect } from 'react';

const OrdersPage = ({ orders }) => {
    const [timerValues, setTimerValues] = useState({});

    useEffect(() => {
        const updateTimers = () => {
            const newTimerValues = {};
            const now = Date.now();
            const duration = 30 * 60 * 1000;

            orders.forEach(order => {
                if (order.timestamp) {
                    const elapsed = now - order.timestamp;
                    const remaining = duration - elapsed;

                    if (remaining <= 0) {
                        newTimerValues[order.id] = "Доставлено!";
                    } else {
                        const minutes = Math.floor(remaining / (60 * 1000));
                        const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
                        newTimerValues[order.id] = `Доставка через: ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
                    }
                }
            });
            setTimerValues(newTimerValues);
        };

        const intervalId = setInterval(updateTimers, 1000);
        updateTimers();

        return () => clearInterval(intervalId);
    }, [orders]);

    return (
        <main className="container">
            <section id="orders">
                <h2 className="section-title">Історія замовлень</h2>
                <div className="orders-list">
                    {orders.length === 0 ? (
                        <p>У вас ще немає замовлень.</p>
                    ) : (
                        orders.map((order, index) => (
                            <div key={index} className="order-card card">
                                <div className="order-header">
                                    <span className="order-id">Замовлення #{order.id.slice(-4).toUpperCase()}</span>
                                </div>
                                <div className="order-details">
                                    <div className="details-left">
                                        <p className="order-items-list">{order.itemsString || "Деталі не вказано"}</p>
                                    </div>
                                    <div className="details-right">
                                        <span className="order-date">{order.date}</span>
                                        {order.timestamp && (
                                            <div className="order-timer-box">
                                                <span className="order-timer-inline">{timerValues[order.id] || "Обробка..."}</span>
                                            </div>
                                        )}
                                        <div className={`order-status ${order.status || 'completed'}`}>{order.statusText || 'Обробляється'}</div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </main>
    );
};

export default OrdersPage;
