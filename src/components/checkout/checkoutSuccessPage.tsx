"use client";

import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { clearCart } from "@/redux/cartSlice";
import { useAppDispatch } from "@/redux/store";

const CheckoutSuccessPage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Clear the cart after successful checkout
    dispatch(clearCart());
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 p-6">
      <div className="bg-white rounded-xl shadow-xl p-10 text-center max-w-md">
        <FontAwesomeIcon
          icon={faCheckCircle}
          className="text-green-500 text-7xl mb-6"
        />
        <h1 className="text-3xl font-extrabold text-gray-800 mb-4">Success!</h1>
        <p className="text-gray-600 text-lg mb-6">
          Your purchase was successful. A confirmation email has been sent to
          you.
        </p>
        <Link
          href="/product"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full transition duration-200"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
