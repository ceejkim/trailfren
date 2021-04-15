import React, { useState, useCallback } from "react"
import {
  useStripe,
  useElements,
  CardElement
} from "@stripe/react-stripe-js"

import * as styles from "./CheckoutForm.module.css"

import PaymentRequest from "../PaymentRequest/PaymentRequest"

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
}

export default function CheckoutForm({ donationAmount, finalizedPayment, accountId }) {
  const stripe = useStripe()
  const elements = useElements()

  const [message, updateMessage] = useState("")
  const [processing, updateProcessing] = useState(false)

  const generatePaymentIntentToken = useCallback(async () => {
    const response = await fetch("/.netlify/functions/stripe-payment-intent", {
      method: "POST",
      body: JSON.stringify({
        amount: donationAmount * 100,
        accountId,
      }),
    }).then((result) => result.json())
    if (response.error) {
      console.error(`response error ${response.error}`)
      return { error: "Sorry, an error occurred" }
    } else {
      if (response.clientSecret) return { clientSecret: response.clientSecret }
      else {
        console.log("error generating payment intent client secret")
        console.log(response)
        return { error: "Sorry, an error occurred" }
      }
    }
  }, [donationAmount, accountId])

  const handleSubmit = async (event) => {
    event.preventDefault()
    updateProcessing(true)
    updateMessage("")
    const { clientSecret, error } = await generatePaymentIntentToken()
    if (error) {
      updateMessage("Sorry, an error occurred")
    } else {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      })
      updateProcessing(false)

      if (result.error) {
        updateMessage(result.error.message)
      } else {
        // The payment has been processed!
        if (result.paymentIntent.status === "succeeded") {
          finalizedPayment()
        }
      }
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.enterPaymentForm}>
        <PaymentRequest donationAmount={donationAmount}
                        finalizedPayment={finalizedPayment}
                        updateMessage={updateMessage}
                        generatePaymentIntentToken={generatePaymentIntentToken} />
        <div className={styles.cardSection}>
          <CardElement options={CARD_ELEMENT_OPTIONS} />
          <div className={styles.buttonSection}>
            <button className={styles.submitButton} disabled={!stripe || processing}>
              Donate ${donationAmount}
            </button>
          </div>
          {processing && <p className={styles.processingMessage}>Processing payment</p>}
        </div>
      </form>
      <p className={styles.userMessage}>{message}</p>
    </div>
  )
}
