import { HandlerEvent, HandlerContext } from "@netlify/functions";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
}

interface ContactBody {
  accountId?: string;

}

exports.handler = async (event: HandlerEvent, context: HandlerContext) => {
  try {
    if (!event.body) {
      return { statusCode: 400, error: 'Invalid request body' };
    }
    const { accountId } = JSON.parse(event.body) as ContactBody;

    if (!accountId) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({}),
      }
    }

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
