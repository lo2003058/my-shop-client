import React from "react";
import { Metadata } from "next";
import CheckoutCancelPage from "@/components/checkout/checkoutCancelPage";

export const metadata: Metadata = {
  title: "Check out - cancel | Yin.co",
};

const CheckoutCancel: React.FC = () => {
  return <CheckoutCancelPage />;
};

export default CheckoutCancel;
