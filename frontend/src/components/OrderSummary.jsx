// OrderSummary.js
import React from 'react';
import PropTypes from 'prop-types';

const OrderSummary = ({ order }) => {
  const { items, subtotal, tax, total } = order;

  return (
    <div className="order-summary">
      <h2>Order Summary</h2>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>${item.price.toFixed(2)}</td>
              <td>${(item.quantity * item.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="totals">
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>Tax: ${tax.toFixed(2)}</p>
        <p>Total: ${total.toFixed(2)}</p>
      </div>
    </div>
  );
};

// Define prop types
OrderSummary.propTypes = {
  order: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired,
      })
    ).isRequired,
    subtotal: PropTypes.number.isRequired,
    tax: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
  }).isRequired,
};

export default OrderSummary;
