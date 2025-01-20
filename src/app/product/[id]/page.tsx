import React from "react";
import { Metadata } from "next";
import ProductItemPage from "@/components/product/productItemPage";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Product | Yin.co`,
  };
}

export default async function ProductItem({
  params,
}: {
  params: Promise<{ id: string }>; // Declare params as a Promise
}) {
  const { id } = await params; // Await the params promise
  const productId = parseInt(id, 10);

  return <ProductItemPage productId={productId} />;
}
