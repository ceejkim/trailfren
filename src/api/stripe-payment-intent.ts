import Stripe from "stripe";
import { HandlerEvent, HandlerContext } from "@netlify/functions";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

interface ContactBody {
  amount: number;
  includeTip: boolean;
  accountId: string;
  landingPagePath: string;
}

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
};

const feeTaken = 99;

exports.handler = async (event: HandlerEvent, context: HandlerContext) => {
  // CORS
  try {
    if (!event.body) {
      return { statusCode: 400, error: 'Invalid request body' };
    }
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers,
      };
    }

    const body = JSON.parse(event.body) as ContactBody;
    const amount = Number(body.amount);
    const includeTip = body.includeTip;
    const accountId = body.accountId;
    const landingPagePath = body.landingPagePath;

    if (!amount || amount < 0) {
      console.error("Amount must be a positive integer.");

      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          status: "missing information",
        }),
      };
    }

    // Stripe payment processing begins here
    const paymentIntent = await stripe.paymentIntents.create(
      {
        currency: "usd",
        amount: Math.round(amount + (includeTip ? feeTaken : 0)),
        application_fee_amount: includeTip ? feeTaken : 0,
        description: landingPagePath,
      },
      {
        stripeAccount: accountId,
      }
    );

    console.log(`Generated payment intent: ${paymentIntent.id}`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
      }),
    };
  } catch (err) {
    console.log(err);

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        status: err,
      }),
    };
  }
};
