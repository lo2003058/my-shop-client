import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Tier } from "@/types/tier/types";
import { Product } from "@/types/product/types";

export interface SecondaryNavigationItem {
  name: string;
  href: string;
  icon: IconDefinition;
}

export interface CustomerAddress {
  id: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export interface CustomerPoints {
  currentPoints: number;
  accumulatedPoints: number;
  totalAccumulatedPoints: number;
}

export interface CustomerWishList {
  customerId: number;
  productId: number;
  product: Product;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedWishList {
  items: CustomerWishList[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

export interface Customer {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  country_code: string;
  phone: string;
  customerPoints: CustomerPoints;
  tier: Tier;
  customerAddress?: CustomerAddress[];
}

export interface GetCustomer {
  customer: Customer;
}

export interface GetCustomerWishList {
  customerWishList?: PaginatedWishList[];
}

export interface GetCustomerAddress {
  customerAddress: CustomerAddress[];
}
