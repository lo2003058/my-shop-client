import { gql } from "@apollo/client";

export const GET_PRODUCT_FOR_CLIENT = gql`
  query GetProductForClient($id: Int!, $cid: Int!) {
    productForClient(id: $id, cid: $cid) {
      id
      name
      description
      price
      stock
      isVirtual
      imageUrl
      createdAt
      updatedAt
      isCustomerWishListed
    }
  }
`;

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
  query GetProducts($includeHidden: Boolean = false) {
    products(includeHidden: $includeHidden) {
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

export const GET_RECOMMEND_PRODUCTS = gql`
    query GetRecommendProducts($includeHidden: Boolean = false) {
        recommendProducts(includeHidden: $includeHidden) {
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

export const GET_PRODUCTS_PAGINATED = gql`
  query GetProductsPaginated(
    $page: Int!
    $pageSize: Int!
    $filter: ProductFilterInput
  ) {
    productsV2(page: $page, pageSize: $pageSize, filter: $filter) {
      items {
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
      totalCount
      currentPage
      pageSize
      totalPages
    }
  }
`;
