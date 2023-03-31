export interface StripePaymentSuccessResponse {
    clientSecret: string;
}
export type StripePaymentRequest = {
    amount: number;
    includeTip: number;
    accountId: number;
    landingPagePath: string;
};
