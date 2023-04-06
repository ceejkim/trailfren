import React, {
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import {
  useStripe,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";
import { PaymentRequest } from "@stripe/stripe-js";

interface PaymentRequestProps {
  donationAmount: number;
  finalizedPayment: () => void;
  generatePaymentIntentToken: () => Promise<any>;
  updateMessage: Dispatch<SetStateAction<string>>;
  tipAmount: number;
}

const PaymentRequestButton = ({
  donationAmount,
  finalizedPayment,
  generatePaymentIntentToken,
  updateMessage,
  tipAmount,
}: PaymentRequestProps) => {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(
    null
  );

  const handlePaymentMethodReceived = useCallback(
    async (event: any) => {
      const { clientSecret, error } = await generatePaymentIntentToken();
      if (error) {
        event.complete("fail");
        updateMessage(error.message);
        return;
      }

      const { paymentIntent, error: confirmError } =
        await stripe!.confirmCardPayment(
          clientSecret,
          { payment_method: event.paymentMethod.id },
          { handleActions: false }
        );

      if (confirmError) {
        event.complete("fail");
        updateMessage(error.message);
        return;
      }
      event.complete("success");
      if (paymentIntent.status === "requires_action") {
        const { error } = await stripe!.confirmCardPayment(clientSecret);
        if (error) {
          updateMessage(error?.message || "");
        } else {
          finalizedPayment();
        }
      } else {
        finalizedPayment();
      }
    },
    [generatePaymentIntentToken, updateMessage, finalizedPayment, stripe]
  );

  useEffect(() => {
    if (!stripe || paymentRequest) return;
    const pr = stripe.paymentRequest({
      country: "US",
      currency: "usd",
      total: {
        label: "Donation",
        amount: Math.round((donationAmount + tipAmount) * 100),
      },
    });
    pr.canMakePayment().then((result) => {
      if (result) {
        pr.on("paymentmethod", handlePaymentMethodReceived);
        pr.on("cancel", () => {
          pr.off("paymentmethod");
        });
        setPaymentRequest(pr);
      }
    });
  }, [
    stripe,
    donationAmount,
    paymentRequest,
    generatePaymentIntentToken,
    finalizedPayment,
    tipAmount,
    handlePaymentMethodReceived,
  ]);

  useEffect(() => {
    if (!paymentRequest) return;
    paymentRequest.update({
      total: {
        label: "Donation",
        amount: Math.round((donationAmount + tipAmount) * 100),
      },
    });
  }, [paymentRequest, donationAmount, tipAmount]);

  return (
    paymentRequest && (
      <div style={{ textAlign: "center" }}>
        <PaymentRequestButtonElement options={{ paymentRequest }} />
        <p>or, pay by card</p>
      </div>
    )
  );
};

export default PaymentRequestButton;
