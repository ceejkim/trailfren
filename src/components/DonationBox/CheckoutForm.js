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


export default function CheckoutForm({ donationAmount, finalizedPayment, accountId }) {
  const stripe = useStripe()
  const elements = useElements()

  const [paymentIntentClientSecret, setPaymentIntentSecret] = useState(null)
  const [message, updateMessage] = useState("")
  const [processing, updateProcessing] = useState(false)
  const [paymentRequest, setPaymentRequest] = useState(null)

  useEffect(() => {
    async function generatePaymentIntentToken() {
      const response = await fetch("/.netlify/functions/stripe-payment-intent", {
        method: "POST",
        body: JSON.stringify({ 
          amount: donationAmount * 100,
          accountId
        }),
      }).then((result) => result.json())
      if (response.error){
        console.error(`response error ${response.error}`)
        setPaymentIntentSecret(null)
      }
      else {
        if (response.clientSecret) setPaymentIntentSecret(response.clientSecret)
        else {
          updateMessage("Sorry, an error occurred")
          setPaymentIntentSecret(null)
          console.log(response)
        }
      }
    }

    if (donationAmount) {
      generatePaymentIntentToken()
    }
  }, [donationAmount, accountId])

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
          pr.on("paymentMethod", async (event) => {
            const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
              paymentIntentClientSecret,
              { paymentMethod: event.paymentMethod.id },
              { handleActions: false }
            )

            if (confirmError) {
              event.complete("fail")
            } else {
              event.complete("success")
              if (paymentIntent.status === "requires_action") {
                const { error } = await stripe.confirmCardPayment(paymentIntentClientSecret)
                if (error) {
                  updateMessage("Sorry, an issue with this payment occurred")
                  console.log(error)
                }
              }
            }
          })
          setPaymentRequest(pr)
        }
      })
    }
  }, [stripe, donationAmount, paymentIntentClientSecret])

  const handleSubmit = async (event) => {
    event.preventDefault()
    updateProcessing(true)
    updateMessage("")

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return
    }

    const result = await stripe.confirmCardPayment(paymentIntentClientSecret, {
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
    <div>
      {paymentIntentClientSecret && (
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
        </form>
      )}
      <p className={styles.userMessage}>{message}</p>
    </div>
  )
}

