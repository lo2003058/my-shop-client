"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";

export default function EmailVerifyPage() {
  const [email, setEmail] = useState("");

  const resendVerificationEmail = async () => {
    setEmail("lo2003058@gmail.com");

    await Swal.fire({
      icon: "success",
      title: "Email Resent",
      text: `Verification email resent to ${email}!`,
      timer: 1500,
      showConfirmButton: false,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <FontAwesomeIcon
          icon="check-circle"
          className="text-green-500 text-6xl mb-4"
        />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Verify Your Email
        </h2>
        <p className="text-gray-600 mb-6">
          A verification link has been sent to your email address. Please check
          your inbox and click on the link to verify your account.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={resendVerificationEmail}
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
          >
            <FontAwesomeIcon icon="redo" className="mr-2" />
            Resend Email
          </button>
        </div>
      </div>
    </div>
  );
}
