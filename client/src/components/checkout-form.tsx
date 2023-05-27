import { useState, useCallback, useContext } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import PaymentRequest from "./payment-request";
import { TrailfrenContext } from "../routes";

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

interface CheckoutFormProps {
  donationAmount: number;
  finalizedPayment: () => void;
  accountId: string;
  landingPageName: string;
}

const CheckoutForm = ({
  donationAmount,
  accountId,
  landingPageName,
  finalizedPayment,
}: CheckoutFormProps) => {
  const { sdk } = useContext(TrailfrenContext);
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState("");
  const [processing, setProcessing] = useState(false);
  const [includeTip, setIncludeTip] = useState(true);

  const generatePaymentIntentToken = useCallback(async () => {
    try {
      const result = await sdk.stripe.newPaymentIntent({
        amount: Math.round(donationAmount * 100),
        includeTip,
        accountId,
        landingPagePath: window.location.pathname,
        landingPageName,
      });
      if (result.error || !result.success) {
        return { error: result.error || "Sorry, an error occurred" };
      }
      return { clientSecret: result.clientSecret };
    } catch (err) {
      console.error(err);
      return { error: "Sorry, an error occurred" };
    }
  }, [donationAmount, accountId, includeTip]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    const { clientSecret, error } = await generatePaymentIntentToken();
    setProcessing(true);
    if (error) {
      setMessage("Sorry, an error occurred");
      setProcessing(false);
    } else {
      const result = await stripe!.confirmCardPayment(clientSecret!, {
        payment_method: {
          // wip - need to replace any with CardElement
          card: elements!.getElement(CardElement) as any,
        },
      });
      setProcessing(false);

      if (result.error) {
        setMessage(result.error.message || "");
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
      <form onSubmit={handleSubmit}>
        <PaymentRequest
          donationAmount={Math.round(donationAmount)}
          tipAmount={includeTip ? 0.99 : 0}
          finalizedPayment={finalizedPayment}
          updateMessage={setMessage}
          generatePaymentIntentToken={generatePaymentIntentToken}
        />
        <div className="py-2 w-full border-t border-b border-gray-300">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
          <div className="flex justify-center pt-4">
            <button
              className="w-4/5 text-center border border-gray-500 text-gray-500 bg-white rounded-lg py-2 shadow-md mx-auto hover:cursor-pointer hover:bg-gray-200 disabled:shadow-none"
              disabled={!stripe || processing}
            >
              Donate {(donationAmount + (includeTip ? 0.99 : 0)).toFixed(2)}
            </button>
          </div>

          {processing && <p>Processing payment</p>}
        </div>
        {includeTip && (
          <p className="text-center italic text-gray-600 mt-8 text-sm">
            Includes a 99¢ tip for Trailfren -{" "}
            <span
              className="text-blue-100 hover:cursor-pointer"
              onClick={() => setIncludeTip(false)}
            >
              click to remove
            </span>
          </p>
        )}
      </form>
      <p className=" mt-10 mb-10 text-center text-salmon-600 font-medium">
        {message}
      </p>
    </div>
  );
};

export default CheckoutForm;
