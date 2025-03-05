import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const CheckoutCancelPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 p-6">
      <div className="bg-white rounded-xl shadow-xl p-10 text-center max-w-md">
        <FontAwesomeIcon
          icon={faXmarkCircle}
          className="text-red-500 text-7xl mb-6"
        />
        <h1 className="text-3xl font-extrabold text-gray-800 mb-4">
          Payment Cancelled
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          Your payment was cancelled. Please try again.
        </p>
        <Link
          href="/checkout"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full transition duration-200"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
};

export default CheckoutCancelPage;
