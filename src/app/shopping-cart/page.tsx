import React from "react";
import { Metadata } from "next";
import ShoppingCartPage from '@/components/shopping-cart/shoppingCartPage';

export const metadata: Metadata = {
  title: "Shipping Cart | Yin.co",
};

const ShoppingCart: React.FC = () => {
  return <ShoppingCartPage />;
};

export default ShoppingCart;
