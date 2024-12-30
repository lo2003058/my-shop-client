import React from "react";
import { Metadata } from "next";
import HomePage from '@/components/main/homePage';

export const metadata: Metadata = {
  title: "Home | Yin.co",
};

const Home: React.FC = () => {
  return <HomePage />;
};

export default Home;
