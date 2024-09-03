import React, { useState } from 'react';
import axios from 'axios';

const PaymentComponent = () => {
    const [amount, setAmount] = useState('');

    const formData = new FormData();
    formData.append('amount', amount);

  const handlePayment = async () => {
    try {
        const response = await axios.post('http://127.0.0.1:8000/api/vnpay/pay',formData );
        const cleanJsonString = response.data.replace(/^<!--\s*|\s*-->$/g, '');
        const data = JSON.parse(cleanJsonString);
        console.log(data)
        window.location.href = data.url; // Redirect to VNPay payment page
    } catch (error) {
      console.error('Payment Error:', error);
    }
  };

  return (
    <div>
      <h2>Payment</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
      />
      <button onClick={handlePayment}>Pay with VNPay</button>
    </div>
  );
};

export default PaymentComponent;
