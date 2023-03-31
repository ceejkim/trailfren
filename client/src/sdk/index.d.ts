import { StripeDomainsRequest } from "./api/stripe/domains.interface";
import { StripePaymentRequest, StripePaymentSuccessResponse } from "./api/stripe/payment.interface";
declare class TrailfrenSDK {
    host: string;
    constructor();
    alive: () => Promise<{
        success: boolean;
    }>;
    stripe: {
        newPaymentIntent: (body: StripePaymentRequest) => Promise<{
            success: boolean;
            users: StripePaymentSuccessResponse;
            error?: undefined;
        } | {
            success: boolean;
            error: string;
            users?: undefined;
        }>;
        newApplePayDomain: (body: StripeDomainsRequest) => Promise<{
            success: boolean;
            error?: undefined;
        } | {
            success: boolean;
            error: string;
        }>;
    };
}
export default TrailfrenSDK;
