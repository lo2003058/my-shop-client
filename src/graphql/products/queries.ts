import { gql } from "@apollo/client";

export const GET_PRODUCT = gql`
    query GetProduct($id: Int!) {
        product(id: $id) {
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
`;

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
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
`;
