import {
  useState,
  useCallback,
  FunctionComponent,
  ReactEventHandler,
} from "react";
import { useStripe } from "@stripe/react-stripe-js";
import Stripe from "stripe";

interface NavbarProps {
  donationAmount: number;
  finalizedPayment: (payment?: any) => void;
  generatePaymentIntentToken: () => Promise<any>;
  updateMessage: (message?: string) => void;
  tipAmount: number;
}

const PaymentRequestButton: FunctionComponent<NavbarProps> = ({
  finalizedPayment,
  generatePaymentIntentToken,
  updateMessage,
}) => {
  const stripe = useStripe()!;
  const [paymentRequest, setPaymentRequest] = useState(null);

  const handlePaymentMethodReceived = useCallback(
    async (event: any) => {
      console.log("Payment method entered");
      const { clientSecret, error } = await generatePaymentIntentToken();

      if (error) {
        event.complete("fail");
        updateMessage(error.message);
        return;
      }

      const { paymentIntent, error: confirmError } =
        await stripe.confirmCardPayment(
          clientSecret,
          { payment_method: event.paymentMethod.id },
          { handleActions: false }
        );

      if (confirmError) {
        event.complete("fail");
        updateMessage(confirmError.message);
        return;
      }

      event.complete("success");

      if (paymentIntent.status === "requires_action") {
        const { error: actionError } = await stripe.confirmCardPayment(
          clientSecret
        );
        if (actionError) {
          updateMessage(actionError.message);
        } else {
          finalizedPayment();
        }
      } else {
        finalizedPayment();
      }
    },
    [generatePaymentIntentToken, updateMessage, finalizedPayment, stripe]
  );

  // Add the useEffect hook and other necessary logic, if needed

  return (
    // Return necessary JSX or components, if needed
    null
  );
};

export default PaymentRequestButton;
