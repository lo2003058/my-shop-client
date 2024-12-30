import React from "react";
import { Metadata } from "next";
import AboutUsPage from "@/components/about-us/aboutUsPage";

export const metadata: Metadata = {
  title: "About Us | Yin.co",
};

const AboutUs: React.FC = () => {
  return <AboutUsPage />;
};

export default AboutUs;
