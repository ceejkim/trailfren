import { GatsbyFunctionRequest, GatsbyFunctionResponse } from 'gatsby';
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

export default async function stripeAddAppleDomain(req: GatsbyFunctionRequest<ContactBody>, res: GatsbyFunctionResponse) {
  const { accountId } = req.body;

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
