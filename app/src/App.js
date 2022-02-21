// Node Modules
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// UI Components
import styles from "./App.module.css";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function App() {

  const [errorMsg, SetErrorMsg] = useState("");
  const [isLoading, setLoading] = useState(false);

  const handleClick = async (event) => {
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

  return (
    <div className={styles.ctn}>

      <button onClick={handleClick} disabled={isLoading} className={styles.buttonCta}>
        {isLoading? "Loading..." : "Checkout"}
      </button>

      {errorMsg && <p>{errorMsg}</p>}

    </div>
  );
}

async function redirectToCheckout(stripe) {

  await stripe.redirectToCheckout({
    lineItems: [{
      price: 'price_1ItByuGISOPmwDos8XvYEIBP',
      quantity: 1,
    }],
    mode: 'subscription',
    successUrl: 'https://example.com/success',
    cancelUrl: 'https://example.com/cancel',
  })
}

export default App;
