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
              <label htmlFor="donationAmount">
              {/* <label for="donationAmount" htmlFor="donationAmount"> */}
                Donation amount*:
              </label>
              <input
                className="form-control form-control-lg"
                type="number"
                name="donationAmount"
                id="donationAmount"
                onChange={handleDonationAmountChange}
              />
            </div>
            {/* <div className={styles.selectAmountButtons}>
              {donationAmounts
                .sort((a, b) => Number(a) > Number(b))
                .map((donationAmount) => (
                  <button
                    key={donationAmount}
                    className={
                      selectedAmount === donationAmount
                        ? styles.buttonSelected
                        : styles.selectAmountButton
                    }
                    onClick={() => updateSelectedAmount(Math.round(donationAmount))}
                  >
                    ${donationAmount}
                  </button>
                ))}
            </div> */}
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
