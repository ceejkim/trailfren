import stripeClient from "stripe";

const stripe = stripeClient(process.env.STRIPE_SECRET_KEY);
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
};

const feeTaken = 10;

exports.handler = async (event, context) => {
  // CORS
  try {
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers,
      };
    }

    const postBody = JSON.parse(event.body);

    const amount = Number(postBody.amount);
    const includeTip = postBody.includeTip;
    const accountId = postBody.accountId;
    const landingPagePath = postBody.landingPagePath;

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
        amount: Math.round(amount + (includeTip && feeTaken)),
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
