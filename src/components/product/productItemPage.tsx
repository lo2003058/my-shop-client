"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useQuery } from "@apollo/client";
import {
  GET_PRODUCT,
  GET_PRODUCT_FOR_CLIENT,
} from "@/graphql/products/queries";
import { GetProduct, GetProductForClient } from "@/types/product/types";
import RecommendProduct from "@/components/main/recommendProduct";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import WishlistButton from "@/components/product/wishlistButton";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { addItem } from "@/redux/cartSlice";
import { RootState, useAppDispatch } from "@/redux/store";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const MAX_QUANTITY = 10;

interface ProductItemPageProps {
  productId: number;
}

const ProductItemPage: React.FC<ProductItemPageProps> = ({ productId }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [customerId, setCustomerId] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (status === "loading") return;
    if (session?.user?.id) {
      setCustomerId(Number(session.user.id));
    }
  }, [status, session, router]);

  const skipQuery = status === "loading" || productId === 0;
  const queryToUse = customerId ? GET_PRODUCT_FOR_CLIENT : GET_PRODUCT;
  const variablesToUse = customerId
    ? { id: productId, cid: customerId }
    : { id: productId };

  const {
    loading: queryLoading,
    error,
    data,
    refetch,
  } = useQuery<GetProductForClient & GetProduct>(queryToUse, {
    variables: variablesToUse,
    skip: skipQuery,
  });

  useEffect(() => {
    if (status === "authenticated") {
      refetch();
    }
  }, [status, refetch]);

  const [quantity, setQuantity] = useState<number>(1);
  const cartItems = useSelector((state: RootState) => state.cart.items);

  if (status === "loading") {
    return <p className="text-center mt-20">Loading session...</p>;
  }

  if (!skipQuery && queryLoading) {
    return <p className="text-center mt-20">Loading product...</p>;
  }

  if (error) {
    return (
      <p className="text-center mt-20 text-red-500">Error: {error.message}</p>
    );
  }

  const product = customerId ? data?.productForClient : data?.product;
  if (!product) {
    return <p className="text-center mt-20">Product not found.</p>;
  }

  const {
    id,
    name,
    description,
    price,
    imageUrl,
    isCustomerWishListed
  } = product;

  const handleIncrement = () => {
    if (quantity < MAX_QUANTITY) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    const existingCartItem = cartItems.find((item) => item.id === id);
    const currentQuantity = existingCartItem ? existingCartItem.quantity : 0;
    if (currentQuantity + quantity > MAX_QUANTITY) {
      await Swal.fire({
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
        id,
        name,
        price,
        imageUrl: imageUrl || "",
        quantity,
      }),
    );
    await Swal.fire({
      icon: "success",
      title: "Added to Cart",
      text: `Added ${quantity} ${name}(s) to your cart.`,
      position: "center",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          <div className="flex flex-col">
            <div className="w-full h-96 relative">
              <Image
                src={
                  `${imageUrl}` ||
                  `/images/no-image-available.webp`
                }
                alt={name}
                fill
                className="rounded-lg shadow-md object-cover"
              />
            </div>
          </div>

          <div className="mt-10 lg:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              {name}
            </h1>

            <div
              className={`mt-4 prose prose-sm text-gray-500 max-w-4xl`}
              dangerouslySetInnerHTML={{ __html: description }}
            />

            <p className="mt-6 text-2xl font-semibold text-gray-900">
              ${price.toFixed(2)}
            </p>
            <div className="mt-6 flex items-center">
              <h3 className="text-sm font-medium text-gray-700">Quantity</h3>
              <div className="ml-4 flex items-center">
                <button
                  onClick={handleDecrement}
                  className="p-2 border border-gray-300 rounded-l-md text-gray-500 hover:bg-gray-50"
                >
                  <FontAwesomeIcon icon={faMinus} />
                </button>
                <span className="px-4 py-2 border-t border-b border-gray-300 text-gray-700">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrement}
                  className="p-2 border border-gray-300 rounded-r-md text-gray-500 hover:bg-gray-50"
                  disabled={quantity >= MAX_QUANTITY}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
            </div>
            <div className="mt-6 flex space-x-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Add to Cart
              </button>
              {session && (
                <WishlistButton
                  productId={id}
                  isFavorite={!!isCustomerWishListed}
                />
              )}
            </div>
          </div>
        </div>
        <RecommendProduct />
      </div>
    </div>
  );
};

export default ProductItemPage;
