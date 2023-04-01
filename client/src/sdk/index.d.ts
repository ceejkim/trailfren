import { StripeDomainsRequest } from "./api/stripe/domains.interface";
import { StripePaymentRequest, StripePaymentSuccessResponse } from "./api/stripe/payment.interface";
declare class TrailfrenSDK {
    host: string;
    constructor();
    alive: () => Promise<{
        success: boolean;
    }>;
    stripe: {
        newPaymentIntent: (body: StripePaymentRequest) => Promise<StripePaymentSuccessResponse>;
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
