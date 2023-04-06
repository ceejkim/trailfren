export interface StripePaymentSuccessResponse {
    success: boolean;
    clientSecret?: string;
    error?: string;
}
export interface StripePaymentErrorResponse {
}
export type StripePaymentRequest = {
    amount: number;
    includeTip: boolean;
    accountId: string;
    landingPageName: string;
    landingPagePath: string;
};
