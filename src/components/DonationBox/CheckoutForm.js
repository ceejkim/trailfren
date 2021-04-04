import React, { useState, useEffect } from "react"
import {
  useStripe,
  useElements,
  CardElement,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js"

import * as styles from "./CheckoutForm.module.css"

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


export default function CheckoutForm({ donationAmount, finalizedPayment }) {
  const stripe = useStripe()
  const elements = useElements()

  const [paymentIntentToken, setPaymentIntentToken] = useState(null)
  const [message, updateMessage] = useState("")
  const [processing, updateProcessing] = useState(false)
  const [paymentRequest, setPaymentRequest] = useState(null)

  useEffect(() => {
    console.log("re-generating payment intent token")
    async function generatePaymentIntentToken() {
      const response = await fetch("/.netlify/functions/stripe-payment-intent", {
        method: "POST",
        body: JSON.stringify({ amount: donationAmount * 100 }),
      }).then((result) => result.json())
      if (response.error) console.error(`response error ${response.error}`)
      else {
        if (response.clientSecret) setPaymentIntentToken(response.clientSecret)
        else {
          updateMessage("Sorry, an error occurred")
          console.log(response)
        }
      }
    }

    if (donationAmount) {
      generatePaymentIntentToken()
    }
  }, [donationAmount])

  useEffect(() => {
    if (stripe && donationAmount) {
      const pr = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: {
          label: "Donation",
          amount: donationAmount * 100,
        },
      })
      pr.canMakePayment().then((result) => {
        if (result) {
          setPaymentRequest(pr)
        }
      })
    }
  }, [stripe, donationAmount])

  const handleSubmit = async (event) => {
    event.preventDefault()
    updateProcessing(true)
    updateMessage("")

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return
    }

    const result = await stripe.confirmCardPayment(paymentIntentToken, {
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

  return (
    <form onSubmit={handleSubmit} className={styles.enterPaymentForm}>
      {paymentRequest && (
        <div className={styles.paymentButtonSection}>
          <PaymentRequestButtonElement options={{ paymentRequest }} />
          <p>or, pay by card</p>
        </div>
      )}
      <div className={styles.cardSection}>
        <CardElement options={CARD_ELEMENT_OPTIONS} />
        <div className={styles.buttonSection}>
          <button className={styles.submitButton} disabled={!stripe || processing}>
            Donate ${donationAmount}
          </button>
        </div>
        {processing && <p className={styles.processingMessage}>Processing payment</p>}
      </div>
      <p className={styles.userMessage}>{message}</p>
    </form>
  )
}

