import { Product } from "@/types/product/types";

export interface OrderProduct {
  orderId: number;
  productId: number;
  quantity: number;
  product: Product;
}

export interface OrderAddress {
  name: string;
  phone: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}
