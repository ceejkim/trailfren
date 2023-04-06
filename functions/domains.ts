import { Handler } from '@netlify/functions'
import stripeClient from "stripe";
import env from './env'

const stripe = new stripeClient(env.stripeSecretKey, {
  apiVersion: "2022-11-15",
});

export const handler: Handler = async (event, context) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { accountId, type } = body;

    if (!accountId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing account id" }),
      };
    }

    if (type === "apple") {
      await stripe.applePayDomains.create(
        {
          domain_name: "www.trailfren.com",
        },
        {
          stripeAccount: accountId,
        }
      );

      await stripe.applePayDomains.create(
        {
          domain_name: "staging.trailfren.com",
        },
        {
          stripeAccount: accountId,
        }
      );
    }

    return {
      statusCode: 200,
      body: JSON.stringify({}),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: err?.message || "Something went wrong",
      }),
    };
  }
};