import React from "react";
import { Metadata } from "next";
import CheckoutSuccessPage from "@/components/checkout/checkoutSuccessPage";

export const metadata: Metadata = {
  title: "Check out - success | Yin.co",
};

const CheckoutSuccess: React.FC = () => {
  return <CheckoutSuccessPage />;
};

export default CheckoutSuccess;
