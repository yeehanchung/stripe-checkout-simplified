// Node Modules
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// UI Components
import styles from "./App.module.css";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function App() {

  const [errorMsg, SetErrorMsg] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setLoading] = useState(false);

  const handleOnClickCheckout = async (event) => {
    setLoading(true);

    // Check for network connection
    const hasNetwork = navigator.onLine;

    // Stripe redirect to checkout
    const stripe = await stripePromise;

    if (!hasNetwork) {
      SetErrorMsg("Please check your internet connection.")
    }

    try {
      await redirectToCheckout(stripe);
    } catch (error) {
      SetErrorMsg("We are experiencing connection issues. Please try again later.");
    };

    setLoading(false);
  };

  const decrement = () => {
    setQuantity(prevQty => {
      if(prevQty > 1) {
        return prevQty - 1;
      }
      return 1;
    })
  }

  const increment = () => {
    setQuantity(prevQty => prevQty + 1);
  }

  async function redirectToCheckout(stripe) {
    await stripe.redirectToCheckout({
      lineItems: [{
        price: 'price_1ItByuGISOPmwDos8XvYEIBP',
        quantity: quantity,
      }],
      mode: 'subscription',
      successUrl: 'https://example.com/success',
      cancelUrl: 'https://example.com/cancel',
    })
  }

  return (
    <div className={styles.ctn}>
      <h2>Pro Plus Plan</h2>
      <h4>MYR {quantity * 15} per year</h4>

      <span className={styles.description}>30 days free</span>
      <span className={styles.quantity}>Quantity: {quantity}</span>

      <div className={styles.buttonGroup}>
        <button onClick={decrement}>-</button>
        <button onClick={increment}>+</button>
      </div>

      <button onClick={handleOnClickCheckout} disabled={isLoading} className={styles.buttonCta}>
        {isLoading? "Loading..." : "Checkout"}
      </button>

      {errorMsg && <p>{errorMsg}</p>}
    </div>
  );
}

export default App;
