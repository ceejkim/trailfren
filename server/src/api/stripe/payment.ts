import stripeClient from "stripe";
import { Router } from "express";
import env from "../../env";
import { StripePaymentRequest } from "./payment.interface";

export const stripePaymentRouter = Router();

const stripe = new stripeClient(env.stripeSecretKey!, {
  apiVersion: "2022-11-15",
});

const feeTaken = 99;

stripePaymentRouter.post("/", async (req, res, next) => {
  try {
    const body = req.body as StripePaymentRequest;
    const amount = body.amount;
    const includeTip = body.includeTip;
    const accountId = body.accountId;
    const landingPageName = body.landingPageName;
    const landingPagePath = body.landingPagePath;

    if (!amount || amount < 0) {
      console.error("Amount must be a positive integer.");

      res.status(400).send({
        status: "missing information",
      });
    } else {
      // Stripe payment processing begins here
      const newAmount = Math.round(amount + (includeTip ? feeTaken : 0));
      const paymentIntent = await stripe.paymentIntents.create(
        {
          currency: "usd",
          amount: newAmount,
          application_fee_amount: includeTip ? feeTaken : 0,
          description: `${landingPageName} ${landingPagePath}`,
          metadata: {
            landingPageName,
            landingPagePath
          }
        },
        {
          stripeAccount: accountId,
        }
      );

      console.log(`Generated payment intent: ${paymentIntent.id}`);

      res.status(200).send({
        clientSecret: paymentIntent.client_secret,
      });
    }

  } catch (err) {
    console.log(err);

    res.status(400).send({
      status: err,
    });
  }
});