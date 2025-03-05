import { gql } from "@apollo/client";

export const CREATE_PAYMENT_INTENT = gql`
    mutation CreatePaymentIntent($cartItems: [CartItemInput!]!) {
        createPaymentIntent(cartItems: $cartItems) {
            clientSecret
        }
    }
`;

export const CREATE_PAYMENT_MUTATION = gql`
    mutation CreatePaymentSessionUrl($input: CreatePaymentInput!) {
        createPaymentSessionUrl(createPaymentInput: $input) {
            url
        }
    }
`;
