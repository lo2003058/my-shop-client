import React from "react";
import { Metadata } from "next";
import AccountPage from "@/components/account/accountPage";

export const metadata: Metadata = {
  title: "Account | Yin.co",
};

const Account: React.FC = () => {
  return <AccountPage />;
};

export default Account;
