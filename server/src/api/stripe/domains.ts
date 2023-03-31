import stripeClient from "stripe";
import { Router } from "express";
import { StripeDomainsRequest } from "./domains.interface";

export const stripeDomainsRouter = Router();

const stripe = new stripeClient(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

stripeDomainsRouter.post("/", async (req, res, next) => {
  try {
    const { accountId, type } = req.body as StripeDomainsRequest;

    if (!accountId) {
      res.status(400).json({ message: "Missing account id" });
    }

    if (type === 'apple') {
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
    }
    res.status(200).send();
  } catch (err: any) {
    res.status(500).json({ message: err?.message || "Something went wrong" });
  }
});