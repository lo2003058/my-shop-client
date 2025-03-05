import React from "react";
import { Metadata } from "next";
import CheckoutPage from "@/components/checkout/checkoutPage";

export const metadata: Metadata = {
  title: "Check out | Yin.co",
};

const Checkout: React.FC = () => {
  return <CheckoutPage />;
};

export default Checkout;
