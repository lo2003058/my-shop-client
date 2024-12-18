"use client";

import React from "react";
import Image from "next/image";

const incentives = [
  {
    name: "Free Shipping",
    imageSrc: "/images/product/free-shipping.webp",
    description:
      "Enjoy free shipping on all orders over $50. Fast and reliable delivery right to your doorstep.",
  },
  {
    name: "30-Day Returns",
    imageSrc: "/images/product/30-day-returns.webp",
    description:
      "Not satisfied with your purchase? Return it within 30 days for a full refund or exchange.",
  },
  {
    name: "Customer Support",
    imageSrc: "/images/product/customer-support.webp",
    description:
      "Our dedicated support team is available around the clock to assist you with any inquiries.",
  },
];

export default function ProductTitle() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
              Exceptional Products, Unmatched Service
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Discover a wide range of high-quality products tailored to meet
              your needs. Our commitment to excellence ensures that you receive
              the best value and support with every purchase.
            </p>
          </div>
          <Image
            alt="A diverse range of products showcasing quality and variety."
            src="/images/product/product-hero.webp"
            width={600}
            height={400}
            priority
            className="w-full rounded-lg object-cover shadow-lg"
          />
        </div>

        {/* Incentives Section */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {incentives.map((incentive) => (
            <div
              key={incentive.name}
              className="flex flex-col items-center text-center"
            >
              <Image
                alt={`${incentive.name} icon`}
                src={incentive.imageSrc}
                width={64}
                height={64}
                priority
                className="h-16 w-16 mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-900">
                {incentive.name}
              </h3>
              <p className="mt-2 text-gray-600">{incentive.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
