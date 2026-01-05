import React from 'react';
import CheckoutForm from './CheckoutForm';

function CheckoutPage() {
  console.log("CheckoutPage loaded!");
  
  return (
    <div>
      <h1>Checkout Page</h1>
      <p>If you see this, the page is loading!</p>
      <CheckoutForm />
    </div>
  );
}

export default CheckoutPage;