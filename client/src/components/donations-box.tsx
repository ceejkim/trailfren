import React, { useContext, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./checkout-form";
import { getAffiliateFromPath } from "../utils/affiliates";
import { TrailfrenContext } from "../routes";
import Input from "./input";
import env from "../../env";

const DonationsPage = () => {
  const [donationAmount, setDonationAmount] = useState<number | undefined>(
    undefined
  );
  const [confirmationMessage, updateConfirmationMessage] = useState("");
  const { affiliates } = useContext(TrailfrenContext);

  const affiliate = getAffiliateFromPath(affiliates, window.location.pathname);
  console.log('affiliate', affiliate);
  const landingPage = affiliate?.landingPages?.filter(lp => `/${lp.fields.landingPagePath}` === window.location.pathname) || [];
  const landingPageName = landingPage[0]?.fields.name;

  const [stripePromise] = useState(() =>
    loadStripe(env.STRIPE_PUBLIC_KEY, {
      stripeAccount: affiliate?.stripeAccountId,
    })
  );

  function finalizedPayment() {
    setDonationAmount(undefined);
    updateConfirmationMessage("Thank you for your contribution!");
  }

  function handleDonationAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    setDonationAmount(parseInt(e.target.value));
  }

  return (
    <Elements stripe={stripePromise}>
      {confirmationMessage ? (
        <div className="max-w-[500px] mx-auto my-8 px-4 py-8 border border-salmon-400 text-center">
          <p className="text-[2rem] text-salmon-400 mx-auto w-full text-center">
            Thank you for contributing!
          </p>
          <button onClick={() => updateConfirmationMessage("")}>Go Back</button>
        </div>
      ) : (
        <div>
          <div className="max-w-lg mx-auto my-8 border border-salmon-400">
            <div className="bg-salmon-400 text-white text-center py-2">
              Choose an amount to contribute
            </div>
            <div className="form-group py-3 px-3 col">
              <label htmlFor="donationAmount">Donation amount*:</label>
              <Input
                value={donationAmount}
                type="number"
                step="any"
                name="donationAmount"
                onChange={handleDonationAmountChange}
                style="full-border"
                size="large"
              />
            </div>
          </div>
          {donationAmount ? (
            <CheckoutForm
              donationAmount={donationAmount}
              finalizedPayment={finalizedPayment}
              accountId={affiliate?.stripeAccountId!}
              landingPagePath={affiliate?.landingPagePath!}
              landingPageName={landingPageName}
            />
          ) : null}
        </div>
      )}
    </Elements>
  );
};

export default DonationsPage;
