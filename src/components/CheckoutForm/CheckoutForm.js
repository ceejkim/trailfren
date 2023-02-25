import React, { useState, useCallback } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

import * as styles from "./CheckoutForm.module.css";

import PaymentRequest from "../PaymentRequest/PaymentRequest";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

export default function CheckoutForm({
  donationAmount,
  finalizedPayment,
  accountId,
  landingPagePath,
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, updateMessage] = useState("");
  const [processing, updateProcessing] = useState(false);
  const [includeTip, updateIncludeTip] = useState(true);

  const generatePaymentIntentToken = useCallback(async () => {
    let result;
    try {
      const response = await fetch(
        "/.netlify/functions/stripe-payment-intent",
        {
          method: "POST",
          body: JSON.stringify({
            amount: Math.round(donationAmount * 100),
            includeTip,
            accountId,
            landingPagePath,
          }),
        }
      );
      result = await response.json();
      // Handle the response here
    } catch (err) {
      console.error(err);
      return { error: "Sorry, an error occurred" };
    }

    if (result.clientSecret) return { clientSecret: result.clientSecret };
    else {
      console.log("error generating payment intent client secret");
      console.log(result);
      return { error: "Sorry, an error occurred" };
    }
  }, [donationAmount, accountId, includeTip]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    updateProcessing(true);
    updateMessage("");
    const { clientSecret, error } = await generatePaymentIntentToken();
    if (error) {
      updateMessage("Sorry, an error occurred");
      updateProcessing(false);
    } else {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });
      updateProcessing(false);

      if (result.error) {
        updateMessage(result.error.message);
      } else {
        // The payment has been processed!
        if (result.paymentIntent.status === "succeeded") {
          finalizedPayment();
        }
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.enterPaymentForm}>
        <PaymentRequest
          donationAmount={Math.round(donationAmount)}
          tipAmount={includeTip ? 0.1 : 0}
          finalizedPayment={finalizedPayment}
          updateMessage={updateMessage}
          generatePaymentIntentToken={generatePaymentIntentToken}
        />
        <div className={styles.cardSection}>
          <CardElement options={CARD_ELEMENT_OPTIONS} />
          <div className={styles.buttonSection}>
            <button
              className={styles.submitButton}
              disabled={!stripe || processing}
            >
              Donate ${Math.round(donationAmount) + (includeTip && 0.1)}
            </button>
          </div>

          {processing && (
            <p className={styles.processingMessage}>Processing payment</p>
          )}
        </div>
        {includeTip && (
          <p className={styles.includeTipMessage}>
            Includes a $0.1 tip for Trailfren -{" "}
            <span
              onClick={() => updateIncludeTip(false)}
              className={styles.removeTip}
            >
              click to remove
            </span>
          </p>
        )}
      </form>
      <p className={styles.userMessage}>{message}</p>
    </div>
  );
}
