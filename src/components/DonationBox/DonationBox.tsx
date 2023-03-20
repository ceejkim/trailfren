import React, { useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../CheckoutForm/CheckoutForm";

import * as styles from "./DonationBox.module.css";

const DonationBox = ({ donationAmounts, accountId, landingPagePath }) => {
  const [stripePromise] = useState(() =>
    loadStripe(process.env.GATSBY_STRIPE_PUBLIC_KEY, {
      stripeAccount: accountId,
    })
  );

  const [selectedAmount, updateSelectedAmount] = useState("");
  const [confirmationMessage, updateConfirmationMessage] = useState("");

  function finalizedPayment() {
    updateSelectedAmount("");
    updateConfirmationMessage("Thank you for your contribution!");
  }

  function handleDonationAmountChange(e) {
    console.log("e.target.value", e.target.value);
    updateSelectedAmount(e.target.value);
  }

  return (
    <Elements stripe={stripePromise}>
      {confirmationMessage ? (
        <div className={styles.confirmationBox}>
          <p className={styles.confirmationMessage}>
            Thank you for contributing!
          </p>
          <button
            onClick={() => updateConfirmationMessage("")}
            className={styles.confirmationButton}
          >
            Go Back
          </button>
        </div>
      ) : (
        <div>
          <div className={styles.selectAmountSection}>
            <div className={styles.selectAmountHeader}>
              Choose an amount to contribute
            </div>
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

export default DonationBox;
