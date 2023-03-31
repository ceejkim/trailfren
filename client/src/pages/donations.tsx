import React, { useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../components/checkout-form";
import env from "../../env";

interface DonationsPageProps {
  donationAmounts: number[];
  accountId: string;
  landingPagePath: string;
}

const DonationsPage = ({
  donationAmounts,
  accountId,
  landingPagePath,
}: DonationsPageProps) => {
  const [stripePromise] = useState(() =>
    loadStripe(env.STRIPE_PUBLIC_KEY, {
      stripeAccount: accountId,
    })
  );

  const [selectedAmount, updateSelectedAmount] = useState(0);
  const [confirmationMessage, updateConfirmationMessage] = useState("");

  function finalizedPayment() {
    updateSelectedAmount(0);
    updateConfirmationMessage("Thank you for your contribution!");
  }

  function handleDonationAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    updateSelectedAmount(parseInt(e.target.value));
  }

  return (
    <Elements stripe={stripePromise}>
      {confirmationMessage ? (
        <div>
          <p>Thank you for contributing!</p>
          <button onClick={() => updateConfirmationMessage("")}>Go Back</button>
        </div>
      ) : (
        <div>
          <div>
            <div>Choose an amount to contribute</div>
            <div className="form-group py-3 px-3 col">
              <label htmlFor="donationAmount">Donation amount*:</label>
              <input
                className="form-control form-control-lg"
                type="number"
                step="any"
                name="donationAmount"
                id="donationAmount"
                onChange={handleDonationAmountChange}
              />
            </div>
          </div>
          {selectedAmount && (
            <CheckoutForm
              donationAmount={selectedAmount}
              finalizedPayment={finalizedPayment}
              accountId={accountId}
              landingPagePath={landingPagePath}
            />
          )}
        </div>
      )}
    </Elements>
  );
};

export default DonationsPage;
