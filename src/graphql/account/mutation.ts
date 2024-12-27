import { gql } from "@apollo/client";

export const UPDATE_CUSTOMER = gql`
    mutation UpdateCustomer($input: UpdateCustomerInput!) {
        updateCustomer(updateCustomerInput: $input) {
            id
            email
        }
    }
`;
