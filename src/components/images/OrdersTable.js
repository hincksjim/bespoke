// OrdersTable.js
import React, { useState, useEffect } from 'react';
import './OrdersTable.css';

const OrdersTable = () => {
  const [orders, setOrders] = useState([
    {
      orderId: 'O123',
      imageUrl: 'https://via.placeholder.com/100',
      details: 'Ring with diamonds',
      value: '$2000',
      status: 'shipped',
    },
    {
      orderId: 'O124',
      imageUrl: 'https://via.placeholder.com/100',
      details: 'Gold necklace',
      value: '$1500',
      status: 'processing',
    },
    {
      orderId: 'O125',
      imageUrl: 'https://via.placeholder.com/100',
      details: 'Silver bracelet',
      value: '$500',
      status: 'delivered',
    },
  ]);

  useEffect(() => {
    // Fetch orders from API if needed
    // fetch('/api/getOrders')
    //   .then(response => response.json())
    //   .then(data => setOrders(data.orders));
  }, []);

  const updateOrderStatus = (order, status) => {
    fetch('/api/updateOrderStatus', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId: order.orderId, status }),
    }).then(response => response.json())
      .then(() => {
        alert(`Order ${status} successfully!`);
        setOrders(orders.map(o => o.orderId === order.orderId ? { ...o, status } : o));
      });
  };

  return (
    <section id="orders">
      <h2>Your Orders</h2>
      <table id="orders-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Details</th>
            <th>Order ID</th>
            <th>Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderId}>
              <td><img src={order.imageUrl} alt="Order" /></td>
              <td>{order.details}</td>
              <td>{order.orderId}</td>
              <td>{order.value}</td>
              <td>
                <button onClick={() => updateOrderStatus(order, 'shipped')}>Mark as Shipped</button>
                <button onClick={() => updateOrderStatus(order, 'delivered')}>Mark as Delivered</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default OrdersTable;
