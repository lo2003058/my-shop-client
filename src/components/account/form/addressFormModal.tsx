"use client";

import React, { Fragment, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Transition, Dialog } from "@headlessui/react";
import { useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";

import LoadingComponent from "@/components/common/loadingComponent";
import {
  CREATE_CUSTOMER_ADDRESS,
  UPDATE_CUSTOMER_ADDRESS,
} from "@/graphql/account/mutation";

/** Props for the AddressFormModal */
interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;

  /** The ID of the customer who owns this address. */
  customerId?: number;

  /** Number of addresses so far. If 0 => auto isDefault = true. */
  existingAddressesCount?: number;

  /** If editing an existing address, pass its data here. Else we create new. */
  editAddress?: EditAddressData | null;
}

interface EditAddressData {
  id: number;
  tag: string;
  firstName: string;
  lastName: string;
  countryCode: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault: boolean;
}

interface AddressFormData {
  tag: string;
  firstName: string;
  lastName: string;
  countryCode: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault: boolean;
}

const AddressFormModal: React.FC<AddressFormModalProps> = ({
  isOpen,
  onClose,
  customerId,
  existingAddressesCount = 0,
  editAddress,
}) => {
  const { data: session, status } = useSession();

  // If there's an `id`, it's edit mode
  const isEditMode = Boolean(editAddress?.id);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<AddressFormData>({
    defaultValues: {
      tag: "",
      firstName: "",
      lastName: "",
      countryCode: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
      isDefault: false,
    },
  });

  const [createCustomerAddress] = useMutation(CREATE_CUSTOMER_ADDRESS);
  const [updateCustomerAddress] = useMutation(UPDATE_CUSTOMER_ADDRESS);

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && editAddress) {
        // Fill form with existing data
        setValue("tag", editAddress.tag || "");
        setValue("firstName", editAddress.firstName || "");
        setValue("lastName", editAddress.lastName || "");
        setValue("countryCode", editAddress.countryCode || "");
        setValue("phone", editAddress.phone || "");
        setValue("address", editAddress.address || "");
        setValue("city", editAddress.city || "");
        setValue("state", editAddress.state || "");
        setValue("country", editAddress.country || "");
        setValue("zipCode", editAddress.zipCode || "");
        setValue("isDefault", editAddress.isDefault);
      } else {
        // Reset for a new address
        reset({
          tag: "",
          firstName: "",
          lastName: "",
          countryCode: "",
          phone: "",
          address: "",
          city: "",
          state: "",
          country: "",
          zipCode: "",
          isDefault: false,
        });
      }

      // If no existing addresses => auto-default
      if (existingAddressesCount === 0) {
        setValue("isDefault", true);
      }
    }
  }, [
    isOpen,
    isEditMode,
    editAddress,
    existingAddressesCount,
    reset,
    setValue,
  ]);

  if (status === "loading") {
    return <LoadingComponent />;
  }

  const onSubmit: SubmitHandler<AddressFormData> = async (formData) => {
    try {
      if (isEditMode && editAddress?.id) {
        // Update existing address
        await updateCustomerAddress({
          variables: {
            input: {
              id: editAddress.id,
              customerId,
              ...formData,
            },
          },
          context: {
            headers: { Authorization: `Bearer ${session?.accessToken}` },
          },
        });

        await Swal.fire({
          position: "center",
          icon: "success",
          title: "Address Updated Successfully",
          text: "Your address has been updated.",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        // Create new address
        await createCustomerAddress({
          variables: {
            input: {
              customerId,
              ...formData,
            },
          },
          context: {
            headers: { Authorization: `Bearer ${session?.accessToken}` },
          },
        });

        await Swal.fire({
          position: "center",
          icon: "success",
          title: "Address Created Successfully",
          text: "Your new address has been added.",
          showConfirmButton: false,
          timer: 1500,
        });
      }

      reset();
      onClose();
    } catch (err: any) {
      const errorMessage =
        err?.graphQLErrors?.[0]?.message ||
        err?.message ||
        "An error occurred while saving your address.";

      await Swal.fire({
        position: "center",
        icon: "error",
        title: "Address Save Error",
        text: errorMessage,
        timer: 1500,
      });
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        {/* Overlay/backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500/75" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          {/* Centered panel */}
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className="relative transform overflow-hidden
                           rounded-lg bg-white px-4 pb-4 pt-5 text-left
                           shadow-xl transition-all sm:my-8 sm:w-full
                           sm:max-w-2xl sm:p-6"
              >
                {/* Title */}
                <div className="mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-gray-900"
                  >
                    {isEditMode ? "Edit Address" : "Add New Address"}
                  </Dialog.Title>
                  <p className="text-sm text-gray-500">
                    {isEditMode
                      ? "Update the information below."
                      : "Fill out the form below to add a new address."}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  {/*TAG*/}
                  <div className="mb-4">
                    <label
                      htmlFor="tag"
                      className="block mb-1 text-md font-semibold text-gray-800 "
                    >
                      Address Tag
                    </label>
                    <input
                      id="tag"
                      type="text"
                      {...register("tag", {
                        required: "Tag is required",
                      })}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black ${
                        errors.tag
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-green-500"
                      }`}
                    />
                    {errors.tag && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.tag.message}
                      </p>
                    )}
                  </div>

                  {/* CUSTOMER INFO */}
                  <div className="mb-6">
                    <h4 className="text-md font-semibold text-gray-800 mb-2">
                      Customer Info
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* First Name */}
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block text-gray-700 mb-1"
                        >
                          First Name
                        </label>
                        <input
                          id="firstName"
                          type="text"
                          {...register("firstName", {
                            required: "First name is required",
                          })}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black ${
                            errors.firstName
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-green-500"
                          }`}
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.firstName.message}
                          </p>
                        )}
                      </div>

                      {/* Last Name */}
                      <div>
                        <label
                          htmlFor="lastName"
                          className="block text-gray-700 mb-1"
                        >
                          Last Name
                        </label>
                        <input
                          id="lastName"
                          type="text"
                          {...register("lastName", {
                            required: "Last name is required",
                          })}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black ${
                            errors.lastName
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-green-500"
                          }`}
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.lastName.message}
                          </p>
                        )}
                      </div>

                      {/* Country Code */}
                      <div>
                        <label
                          htmlFor="countryCode"
                          className="block text-gray-700 mb-1"
                        >
                          Country Code
                        </label>
                        <input
                          id="countryCode"
                          type="text"
                          placeholder="+1, +44, etc."
                          {...register("countryCode", {
                            required: "Country code is required",
                          })}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black ${
                            errors.countryCode
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-green-500"
                          }`}
                        />
                        {errors.countryCode && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.countryCode.message}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-gray-700 mb-1"
                        >
                          Phone
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          {...register("phone", {
                            required: "Phone number is required",
                          })}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black ${
                            errors.phone
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-green-500"
                          }`}
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ADDRESS INFO */}
                  <div className="mb-6">
                    <h4 className="text-md font-semibold text-gray-800 mb-2">
                      Address Info
                    </h4>
                    {/* Address */}
                    <div className="mb-4">
                      <label
                        htmlFor="address"
                        className="block text-gray-700 mb-1"
                      >
                        Full Address
                      </label>
                      <input
                        id="address"
                        type="text"
                        {...register("address", {
                          required: "Address is required",
                        })}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black ${
                          errors.address
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-green-500"
                        }`}
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.address.message}
                        </p>
                      )}
                    </div>
                    {/* City, State */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label
                          htmlFor="city"
                          className="block text-gray-700 mb-1"
                        >
                          City
                        </label>
                        <input
                          id="city"
                          type="text"
                          {...register("city", {
                            required: "City is required",
                          })}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black ${
                            errors.city
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-green-500"
                          }`}
                        />
                        {errors.city && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.city.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="state"
                          className="block text-gray-700 mb-1"
                        >
                          State / Province
                        </label>
                        <input
                          id="state"
                          type="text"
                          {...register("state", {
                            required: "State is required",
                          })}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black ${
                            errors.state
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-green-500"
                          }`}
                        />
                        {errors.state && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.state.message}
                          </p>
                        )}
                      </div>
                    </div>
                    {/* Country, ZipCode */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label
                          htmlFor="country"
                          className="block text-gray-700 mb-1"
                        >
                          Country
                        </label>
                        <input
                          id="country"
                          type="text"
                          {...register("country", {
                            required: "Country is required",
                          })}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black ${
                            errors.country
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-green-500"
                          }`}
                        />
                        {errors.country && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.country.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="zipCode"
                          className="block text-gray-700 mb-1"
                        >
                          ZIP / Postal Code
                        </label>
                        <input
                          id="zipCode"
                          type="text"
                          {...register("zipCode", {
                            required: "ZIP / Postal code is required",
                          })}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black ${
                            errors.zipCode
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-green-500"
                          }`}
                        />
                        {errors.zipCode && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.zipCode.message}
                          </p>
                        )}
                      </div>
                    </div>
                    {/* isDefault */}
                    {
                      !isEditMode && (
                        <div className="flex items-center mb-6">
                          <input
                            id="isDefault"
                            type="checkbox"
                            {...register("isDefault")}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                            // If it's the first address, we auto-set isDefault => disabling if you prefer
                            disabled={existingAddressesCount === 0}
                          />
                          <label
                            htmlFor="isDefault"
                            className="ml-2 text-sm text-gray-700"
                          >
                            Set as Default Address
                          </label>
                        </div>
                      )
                    }
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isSubmitting}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300 ${
                        isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting
                        ? isEditMode
                          ? "Updating..."
                          : "Saving..."
                        : isEditMode
                          ? "Update Address"
                          : "Save Address"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddressFormModal;
