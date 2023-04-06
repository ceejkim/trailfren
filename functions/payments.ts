import { Handler } from '@netlify/functions'
import stripeClient from "stripe";
import env from './env';

const stripe = new stripeClient(env.stripeSecretKey, {
  apiVersion: "2022-11-15",
});

const feeTaken = 99;

export const handler: Handler = async (event, context) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const amount = body.amount;
    const includeTip = body.includeTip;
    const accountId = body.accountId;
    const landingPageName = body.landingPageName;
    const landingPagePath = body.landingPagePath;

    if (!amount || amount < 0) {
      console.error("Amount must be a positive integer.");

      return {
        statusCode: 400,
        body: JSON.stringify({
          status: "missing information",
        }),
      };
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

      return {
        statusCode: 200,
        body: JSON.stringify({
          clientSecret: paymentIntent.client_secret,
        }),
      };
    }

  } catch (err) {
    console.log(err);

    return {
      statusCode: 400,
      body: JSON.stringify({
        status: err,
      }),
    };
  }
};