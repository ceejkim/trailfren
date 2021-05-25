const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
}

exports.handler = async (event, context) => {
  // CORS
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
    }
  }

  const postBody = JSON.parse(event.body)


  const amount = Number(postBody.amount)
  const accountId = postBody.accountId

  if (!amount || amount < 0) {
    console.error("Amount must be a positive integer.")

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        status: "missing information",
      }),
    }
  }

  // Stripe payment processing begins here
  try {

    const feeTaken = 0.02 * amount

    const paymentIntent = await stripe.paymentIntents.create(
      {
        currency: "usd",
        amount: amount,
        application_fee_amount: feeTaken,
      },
      {
        stripeAccount: accountId,
      }
    )

    console.log(`Generated payment intent: ${paymentIntent.id}`)

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
      }),
    }
  } catch (err) {
    console.log(err)

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        status: err,
      }),
    }
  }
}
