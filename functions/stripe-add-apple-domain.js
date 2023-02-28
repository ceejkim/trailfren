import stripeClient from "stripe";

const stripe = stripeClient(process.env.STRIPE_SECRET_KEY);

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
}

exports.handler = async (event) => {
  const accountId = event.body

  if (!accountId) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({}),
    }
  }

  try {
    await stripe.applePayDomains.create(
      {
        domain_name: "www.trailfren.com",
      },
      {
        stripeAccount: accountId,
      }
    )

    await stripe.applePayDomains.create(
      {
        domain_name: "staging.trailfren.com",
      },
      {
        stripeAccount: accountId,
      }
    )
    return {
      statusCode: 200,
      headers,
      body: "Apple Pay Domains added",
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify(err),
    }
  }
}
