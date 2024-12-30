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
  params: { id: string };
}) {
  const { id } = await params;
  const productId = parseInt(id, 10);

  return <ProductItemPage productId={productId} />;
}
