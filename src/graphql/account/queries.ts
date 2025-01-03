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
            isEmailVerified
            isPhoneVerified
            isSubscribed
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
            customerWishList {
                product {
                    id
                    name
                    description
                    price
                    stock
                    isVirtual
                    imageUrl
                    createdAt
                    updatedAt
                }
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

