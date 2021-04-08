import React, {useState} from "react"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import CheckoutForm from "./CheckoutForm"

import * as styles from "./DonationBox.module.css"

const stripePromise = loadStripe(process.env.GATSBY_STRIPE_PUBLIC_KEY)


const DonationBox = ({ donationAmounts, accountId }) => {
  const [selectedAmount, updateSelectedAmount] = useState('')
  const [message, updateMessage] = useState('')

  function finalizedPayment(){
    updateSelectedAmount('')
    updateMessage("Thank you for your contribution!")
  }

  return (
    <Elements stripe={stripePromise}>
      <div className={styles.selectAmountSection}>
        <div className={styles.selectAmountHeader}>Choose an amount to contribute</div>
        <div className={styles.selectAmountButtons}>
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
                onClick={() => updateSelectedAmount(donationAmount)}
              >
                ${donationAmount}
              </button>
            ))}
        </div>
      </div>
      {selectedAmount && <CheckoutForm donationAmount={selectedAmount} 
                                       finalizedPayment={finalizedPayment}
                                       accountId={accountId}/>}
      {!selectedAmount && <p className={styles.confirmPayment}>{message}</p>}
    </Elements>
  )
}

export default DonationBox