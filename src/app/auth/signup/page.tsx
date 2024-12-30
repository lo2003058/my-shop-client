import React from "react";
import { Metadata } from "next";
import SignUpPage from "@/components/auth/signUpPage";

export const metadata: Metadata = {
  title: "Sign Up | Yin.co",
};

const SignUp: React.FC = () => {
  return <SignUpPage />;
};

export default SignUp;
