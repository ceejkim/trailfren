import stripeClient from "stripe";
import { Router } from "express";

export const stripePaymentRouter = Router();

const stripe = new stripeClient(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

const feeTaken = 99;

stripePaymentRouter.post("/", async (req, res, next) => {
  try {
    const amount = Number(req.body.amount);
    const includeTip = req.body.includeTip;
    const accountId = req.body.accountId;
    const landingPagePath = req.body.landingPagePath;

    if (!amount || amount < 0) {
      console.error("Amount must be a positive integer.");

      res.status(400).json({
        status: "missing information",
      });
    }

    // Stripe payment processing begins here
    const paymentIntent = await stripe.paymentIntents.create(
      {
        currency: "usd",
        amount: Math.round(amount + (includeTip && feeTaken)),
        application_fee_amount: includeTip ? feeTaken : 0,
        description: landingPagePath,
      },
      {
        stripeAccount: accountId,
      }
    );

    console.log(`Generated payment intent: ${paymentIntent.id}`);

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.log(err);

    res.status(400).json({
      status: err,
    });
  }
});