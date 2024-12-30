import React from "react";
import { Metadata } from "next";
import FAQsPage from "@/components/faqs/faqsPage";

export const metadata: Metadata = {
  title: "FAQs | Yin.co",
};

const Faqs: React.FC = () => {
  return <FAQsPage />;
};

export default Faqs;
