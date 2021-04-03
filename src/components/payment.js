import { Elements, CardElement } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  "pk_test_51IC4oRI0MvyIqA12lsGm3xZE3hTXjszQeh7LxD7xM3hbT9BZE4qUpa5pmSepblRoX2XSB20C7VrcTRI656xUOHIn00dlpdh33x"
)

const PaymentSection = () => {
  return (
    <Elements stripe={stripePromise}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#9e2146",
            },
          },
        }}
      />
    </Elements>
  )
}

export default PaymentSection