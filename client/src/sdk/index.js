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
        const res = await axios.post(`${this.host}/stripe/payment`, {
          body
        });
        return {
          success: true,
          users: res.data
        };
      } catch (error) {
        return {
          success: false,
          error: error?.response?.data
        };
      }
    },
    newApplePayDomain: async (body) => {
      try {
        await axios.post(`${this.host}/jira/search`, {
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
