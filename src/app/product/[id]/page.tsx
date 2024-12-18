// components/ProductPage.tsx

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_PRODUCT } from "@/graphql/products/queries";
import { GetProduct } from "@/types/product/types";
import RecommendProduct from "@/components/main/recommendProduct";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

const MAX_QUANTITY = 10;

const ProductPage: React.FC = () => {
  const params = useParams();
  const { id } = params;

  const productId = typeof id === "string" ? parseInt(id, 10) : 0;

  const { loading, error, data } = useQuery<GetProduct>(GET_PRODUCT, {
    variables: { id: productId },
    skip: productId === 0, // Skip the query if id is not valid
  });

  const [quantity, setQuantity] = useState<number>(1);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (error)
    return (
      <p className="text-center mt-20 text-red-500">Error: {error.message}</p>
    );
  if (!data || !data.product)
    return <p className="text-center mt-20">Product not found.</p>;

  const {
    name,
    description,
    price,
    imageUrl,
    // rating, // Removed for now
  } = data.product;

  // Handle quantity increment
  const handleIncrement = () => {
    if (quantity < MAX_QUANTITY) {
      setQuantity(quantity + 1);
    }
  };

  // Handle quantity decrement
  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Handle Add to Cart
  const handleAddToCart = () => {
    // Implement your add to cart logic here
    alert(`Added ${quantity} ${name}(s) to cart!`);
  };

  // Handle Favorite Toggle
  const handleFavoriteToggle = () => {
    setIsFavorited(!isFavorited);
    // Implement your favorite logic here
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Product Image */}
          <div className="flex flex-col">
            <div className="w-full h-96 relative">
              <Image
                src={imageUrl || "https://via.placeholder.com/600"}
                alt={name}
                layout="fill"
                objectFit="cover"
                className="rounded-lg shadow-md"
              />
            </div>
          </div>

          {/* Product Information */}
          <div className="mt-10 lg:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              {name}
            </h1>

            {/* Description */}
            <p className="mt-4 text-gray-700">{description}</p>

            {/* Price */}
            <p className="mt-6 text-2xl font-semibold text-gray-900">
              ${price.toFixed(2)}
            </p>

            {/* Quantity Selector */}
            <div className="mt-6 flex items-center">
              <h3 className="text-sm font-medium text-gray-700">Quantity</h3>
              <div className="ml-4 flex items-center">
                <button
                  onClick={handleDecrement}
                  className="p-2 border border-gray-300 rounded-l-md text-gray-500 hover:bg-gray-50"
                  aria-label="Decrease quantity"
                >
                  <FontAwesomeIcon icon={faMinus} />
                </button>
                <span className="px-4 py-2 border-t border-b border-gray-300 text-gray-700">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrement}
                  className="p-2 border border-gray-300 rounded-r-md text-gray-500 hover:bg-gray-50"
                  aria-label="Increase quantity"
                  disabled={quantity >= MAX_QUANTITY}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
            </div>

            {/* Add to Cart & Favorite Buttons */}
            <div className="mt-6 flex space-x-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Add to Cart
              </button>
              <button
                onClick={handleFavoriteToggle}
                className={`p-3 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isFavorited ? "bg-red-100 border-red-500" : ""
                }`}
                aria-label="Add to favorites"
              >
                <FontAwesomeIcon
                  icon={faHeart}
                  className={`h-6 w-6 ${
                    isFavorited
                      ? "text-red-500"
                      : "text-gray-400 hover:text-red-500"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Recommend Products Section */}
        <RecommendProduct />
      </div>
    </div>
  );
};

export default ProductPage;
