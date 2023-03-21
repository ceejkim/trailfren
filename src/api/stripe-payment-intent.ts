import Stripe from "stripe";
import { GatsbyFunctionRequest, GatsbyFunctionResponse } from "gatsby"

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

exports.handler = async (req: GatsbyFunctionRequest<ContactBody>, res: GatsbyFunctionResponse) => {
  // CORS
  try {
    if (req.method === "OPTIONS") {
      return {
        statusCode: 200,
        headers,
      };
    }

    const amount = Number(req.body.amount);
    const includeTip = req.body.includeTip;
    const accountId = req.body.accountId;
    const landingPagePath = req.body.landingPagePath;

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
