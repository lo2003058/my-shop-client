"use client";

import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { useMutation } from "@apollo/client";
import { UPDATE_CUSTOMER } from "@/graphql/account/mutation";
import { useSession } from "next-auth/react";
import LoadingComponent from "@/components/common/loadingComponent";
import { GqlErrorMessage } from "@/types/error/types";

interface PasswordBoxProps {
  customerId: number; // Ensure this is provided
}

interface UpdatePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const PasswordBox: React.FC<PasswordBoxProps> = ({ customerId }) => {
  const { data: session, status } = useSession();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePasswordFormData>();

  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
  }, [session, status]);

  if (status === "loading") {
    return <LoadingComponent />;
  }

  const [updateCustomer] = useMutation(UPDATE_CUSTOMER);

  const onSubmit: SubmitHandler<UpdatePasswordFormData> = async (data) => {
    try {
      await updateCustomer({
        variables: {
          input: {
            id: customerId,
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
          },
        },
        context: {
          headers: { Authorization: `Bearer ${session?.accessToken}` },
        },
      });

      await Swal.fire({
        position: "center",
        icon: "success",
        title: "Password Updated Successfully",
        text: "Your password has been updated.",
        showConfirmButton: false,
        timer: 1500,
      });
      reset(); // Reset the form after successful submission
    } catch (err: unknown) {
      // Safely narrow 'err' to GqlErrorMessage
      const error = err as GqlErrorMessage;

      // Extract error message
      const errorMessage =
        error?.graphQLErrors?.[0]?.message ||
        error?.message ||
        "An error occurred while updating your password.";

      await Swal.fire({
        position: "center",
        icon: "error",
        title: "Update Password Error",
        text: JSON.stringify(errorMessage),
        timer: 1500,
      });
    }
  };

  // Watch the newPassword field to validate confirmNewPassword
  const newPassword = watch("newPassword", "");

  return (
    <div className="space-y-8 my-2">
      {/* Password Update Form */}
      <div className="bg-white shadow border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Password</h2>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Current Password Field */}
          <div className="mb-4">
            <label
              htmlFor="currentPassword"
              className="block text-gray-700 mb-2"
            >
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              {...register("currentPassword", {
                required: "Current password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              placeholder="Enter your current password"
              className={`text-black w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.currentPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-green-500"
              }`}
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New Password Field */}
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              placeholder="Enter your new password"
              className={`text-black w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.newPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-green-500"
              }`}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm New Password Field */}
          <div className="mb-6">
            <label
              htmlFor="confirmNewPassword"
              className="block text-gray-700 mb-2"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmNewPassword"
              {...register("confirmNewPassword", {
                required: "Please confirm your new password",
                validate: (value) =>
                  value === newPassword || "Passwords do not match",
              })}
              placeholder="Confirm your new password"
              className={`text-black w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.confirmNewPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-green-500"
              }`}
            />
            {errors.confirmNewPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmNewPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordBox;
