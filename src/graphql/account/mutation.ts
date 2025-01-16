import { gql } from "@apollo/client";

export const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer($input: UpdateCustomerInput!) {
    updateCustomer(updateCustomerInput: $input) {
      id
      email
    }
  }
`;

export const CREATE_CUSTOMER_WISHLIST = gql`
  mutation CreateCustomerWishList($input: CreateCustomerWishListInput!) {
    createCustomerWishList(createCustomerWishListInput: $input) {
      customerId
      productId
    }
  }
`;

export const REMOVE_CUSTOMER_WISHLIST = gql`
  mutation RemoveCustomerWishList($customerId: Int!, $productId: Int!) {
    removeCustomerWishList(customerId: $customerId, productId: $productId) {
      customerId
      productId
    }
  }
`;

export const CREATE_CUSTOMER_ADDRESS = gql`
    mutation CreateCustomerAddress($input: CreateCustomerAddressInput!) {
        createCustomerAddress(createCustomerAddressInput: $input) {
            id
            tag
            firstName
            lastName
            countryCode
            phone
            address
            city
            state
            country
            zipCode
            country
            isDefault
            customerId
        }
    }
`;

export const UPDATE_CUSTOMER_ADDRESS = gql`
    mutation UpdateCustomerAddress($input: UpdateCustomerAddressInput!) {
        updateCustomerAddress(updateCustomerAddressInput: $input) {
            tag
            firstName
            lastName
            countryCode
            phone
            address
            city
            state
            country
            zipCode
            country
            isDefault
            customerId
        }
    }
`;
