import React from 'react';
import { useLocation } from 'react-router-dom';

const PaymentReturn = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const responseCode = queryParams.get('vnp_ResponseCode');
  const txnRef = queryParams.get('vnp_TxnRef');
  const amount = queryParams.get('vnp_Amount');

  return (
    <div>
      <h2>Payment Status</h2>
      <p>Response Code: {responseCode}</p>
      <p>Transaction Reference: {txnRef}</p>
      <p>Amount: {amount / 100} VND</p>
    </div>
  );
};

export default PaymentReturn;
