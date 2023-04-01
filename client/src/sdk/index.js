// src/sdk.ts
import axios from "axios";
var TrailfrenSDK = class {
  host;
  constructor() {
    this.host = `${window.location.protocol}//${window.location.hostname}${window.location.hostname === "localhost" ? ":3010" : ""}/api`;
  }
  alive = async () => {
    try {
      await axios.get(`${this.host}/`);
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false
      };
    }
  };
  stripe = {
    newPaymentIntent: async (body) => {
      try {
        const res = await axios.post(`${this.host}/stripe/payments`, body);
        return {
          success: true,
          ...res.data
        };
      } catch (error) {
        const errorMessage = error?.response?.data ? error.response.data : "An error occurred while processing the payment.";
        return {
          success: false,
          error: errorMessage
        };
      }
    },
    newApplePayDomain: async (body) => {
      try {
        await axios.post(`${this.host}/stripe/domains`, {
          body
        });
        return {
          success: true
        };
      } catch (error) {
        return {
          success: false,
          error: error?.response?.data
        };
      }
    }
  };
};
var sdk_default = TrailfrenSDK;
export {
  sdk_default as default
};
