import { gql } from "@apollo/client";

export const GET_CUSTOMER = gql`
  query GetCustomer($id: Int!) {
    customer(id: $id) {
      id
      email
      firstName
      lastName
      country_code
      phone
      customerPoints {
        currentPoints
      }
      tier {
        id
        name
      }
      customerAddress {
        id
        address
        city
        state
        zip
        country
        isDefault
      }
    }
  }
`;

export const GET_CUSTOMER_ADDRESS = gql`
  query GetCustomerAddress($id: Int!) {
      customer(id: $id) {
          id
          email
          customerAddress {
              id
              address
              city
              state
              zip
              country
              isDefault
          }
      }
  }
`;

export const GET_CUSTOMERS = gql`
  query GetCustomers {
    customers {
      id
      email
      firstName
      lastName
      country_code
      phone
      isEmailVerified
      isPhoneVerified
      isSubscribed
    }
  }
`;

