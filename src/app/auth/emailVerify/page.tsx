import React from "react";
import { Metadata } from "next";
import EmailVerifyPage from "@/components/auth/emailVerifyPage";

export const metadata: Metadata = {
  title: "Email Verify | Yin.co",
};

const EmailVerify: React.FC = () => {
  return <EmailVerifyPage />;
};

export default EmailVerify;
