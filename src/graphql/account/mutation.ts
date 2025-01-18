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
      address2
      city
      state
      country
      zipCode
      isDefault
      customerId
    }
  }
`;

export const UPDATE_CUSTOMER_ADDRESS = gql`
  mutation UpdateCustomerAddress($input: UpdateCustomerAddressInput!) {
    updateCustomerAddress(updateCustomerAddressInput: $input) {
      id
      tag
      firstName
      lastName
      countryCode
      phone
      address
      address2
      city
      state
      country
      zipCode
      isDefault
      customerId
    }
  }
`;

export const REMOVE_CUSTOMER_ADDRESS = gql`
  mutation RemoveCustomerAddress($id: Int!) {
    removeCustomerAddress(id: $id) {
      id
      tag
      firstName
      lastName
      countryCode
      phone
      address
      address2
      city
      state
      country
      zipCode
      isDefault
      customerId
    }
  }
`;

export const UPDATE_CUSTOMER_DEFAULT_ADDRESS = gql`
    mutation UpdateCustomerDefaultAddress($addressId: Int!,$customerId: Int!) {
        updateCustomerDefaultAddress(addressId: $addressId, customerId: $customerId) {
            id
        }
    }
`;
