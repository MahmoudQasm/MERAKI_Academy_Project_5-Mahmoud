import React from 'react';
import { Link } from 'react-router-dom';

const SuccessPage = ()=> {
  return (
    <div>
      <h1>Payment Successful!</h1>
      <p>Thank you for your order. Your payment has been processed successfully.</p>
      <Link to="/">Back to Home</Link>
    </div>
  );
}

export default SuccessPage;