import { gql } from "@apollo/client";

export const GET_CUSTOMER = gql`
    query GetCustomer($id: Int!) {
        customer(id: $id) {
            id
            email
            firstName
            lastName
            countryCode
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
        countryCode
      phone
      isEmailVerified
      isPhoneVerified
      isSubscribed
    }
  }
`;

export const GET_CUSTOMER_WISHLIST = gql`
    query GetCustomerWishList($customerId: Int!, $page: Int!, $pageSize: Int!) {
        customerWishList(customerId: $customerId, page: $page, pageSize: $pageSize) {
            items {
                customerId
                productId
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
                createdAt
                updatedAt
            }
            totalCount
            currentPage
            pageSize
            totalPages
        }
    }
`;

export const GET_CUSTOMER_ADDRESSES = gql`
    query GetCustomerAddresses($customerId: Int!) {
        customerAddress(customerId: $customerId) {
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

export const GET_CUSTOMER_ORDERS = gql`
    query GetCustomerOrders($customerId: Int!, $page: Int!, $pageSize: Int!, $orderStatus: String!) {
        orders(customerId: $customerId, page: $page, pageSize: $pageSize, orderStatus: $orderStatus) {
            items {
                id
                tax
                shippingFee
                originalTotal
                total
                status
                pointsEarned
                orderProduct {
                    product {
                        id
                        name
                        price
                        stock
                        isVirtual
                        imageUrl
                        createdAt
                        updatedAt
                    }
                    quantity
                }
                orderAddress{
                    name
                    phone
                    address
                    address2
                    city
                    state
                    country
                    zipCode
                }
                payment{
                    method
                    status
                    createdAt
                }
                createdAt
            }
            totalCount
            currentPage
            pageSize
            totalPages
        }
    }
`;
