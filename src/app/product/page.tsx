"use client";

import React from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useAppDispatch } from "@/redux/store";
import { addItem } from "@/redux/cartSlice";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "@/graphql/products/queries";
import type { GetProducts, Product } from "@/types/product/types"; // Type-only import
import RecommendProduct from "@/components/main/recommendProduct";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store"; // Adjust the path as necessary
import Swal from "sweetalert2";
import ProductTitle from "@/components/product/productTitle";
import Link from "next/link"; // Import SweetAlert2

const MAX_QUANTITY = 10;

const ProductPage: React.FC = () => {
  // Renamed to avoid potential naming conflicts
  const dispatch = useAppDispatch();

  // Fetch products using GraphQL
  const { loading, error, data } = useQuery<GetProducts>(GET_PRODUCTS);

  // Access cart state
  const cartItems = useSelector((state: RootState) => state.cart.items);

  // Handle loading state
  if (loading) {
    return <p>Loading products...</p>;
  }

  // Handle error state
  if (error) {
    console.error("Error fetching products:", error);
    return <p>Error loading products.</p>;
  }

  // Ensure data is available
  if (!data || !data.products) {
    return <p>No products found.</p>;
  }

  // Function to handle adding a product to the cart
  const handleAddToCart = (product: Product) => {
    const existingCartItem = cartItems.find((item) => item.id === product.id);
    const currentQuantity = existingCartItem ? existingCartItem.quantity : 0;

    if (currentQuantity >= MAX_QUANTITY) {
      Swal.fire({
        icon: "error",
        title: "Limit Reached",
        text: `You can only add up to ${MAX_QUANTITY} of this item.`,
        position: "center",
        timer: 1500,
      });
      return;
    }

    dispatch(
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl || "",
        quantity: 1, // Default quantity
      }),
    );
  };

  return (
    <div className="bg-white">
      <ProductTitle />

      {/* Product Grid */}
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {data.products.map((product) => {
            const existingCartItem = cartItems.find(
              (item) => item.id === product.id,
            );
            const currentQuantity = existingCartItem
              ? existingCartItem.quantity
              : 0;
            const isMaxReached = currentQuantity >= MAX_QUANTITY;

            return (
              <div
                key={product.id}
                className="group relative border rounded-lg p-4"
              >
                <Link href={`/product/${product.id}`}>
                  <Image
                    alt={product.name}
                    src={product.imageUrl || "https://via.placeholder.com/450"}
                    width={300}
                    height={300}
                    priority
                    className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
                  />
                </Link>
                <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">
                  ${product.price.toFixed(2)}
                </p>
                <button
                  onClick={() => handleAddToCart(product)}
                  className={`mt-2 flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isMaxReached
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  } transition-colors duration-300`}
                  disabled={isMaxReached}
                >
                  <ShoppingCartIcon className="h-5 w-5 mr-2" />
                  {isMaxReached ? "Max Reached" : "Add to Cart"}
                </button>
                {currentQuantity > 0 && (
                  <p className="mt-1 text-sm text-gray-500">
                    In Cart: {currentQuantity}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommend Products Section */}
      <RecommendProduct />
    </div>
  );
};

export default ProductPage;
