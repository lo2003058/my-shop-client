import React from "react";
import { Metadata } from "next";
import SignInPage from '@/components/auth/signinPage';

export const metadata: Metadata = {
  title: "Sign in | Yin.co",
};

const SignIn: React.FC = () => {
  return <SignInPage />;
};

export default SignIn;
