import axios from "axios";
import {
  StripeDomainsRequest
} from "./api/stripe/domains.interface";
import {
  StripePaymentRequest, StripePaymentSuccessResponse,
} from "./api/stripe/payment.interface";

class TrailfrenSDK {
  host: string;
  constructor() {
    this.host = `${window.location.protocol}//${window.location.hostname}${window.location.hostname === "localhost" ? ":3010" : ""
      }/api`;
  }

  public alive = async () => {
    try {
      await axios.get(`${this.host}/`);
      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
      };
    }
  }

  public stripe = {
    newPaymentIntent: async (body: StripePaymentRequest): Promise<StripePaymentSuccessResponse> => {
      try {
        const res = await axios.post(`${this.host}/stripe/payments`, body);

        return {
          success: true,
          ...res.data,
        };
      } catch (error: any) {
        // Check if error has a response, otherwise, use a generic error message
        const errorMessage = error?.response?.data ? error.response.data as string : 'An error occurred while processing the payment.';

        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    newApplePayDomain: async (body: StripeDomainsRequest) => {
      try {
        await axios.post(`${this.host}/stripe/domains`, {
          body,
        });
        return {
          success: true,
        };
      } catch (error: any) {
        return {
          success: false,
          error: error?.response?.data as string | undefined,
        };
      }
    },
  }
}


export default TrailfrenSDK;