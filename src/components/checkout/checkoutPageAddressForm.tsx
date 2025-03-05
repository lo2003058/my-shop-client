"use client";

import React, { useEffect, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { handlePhoneNumberKeyDown } from "@/utils/phoneNumberHelper";
import CountryCodeComboBox, {
  CountryCodeObject,
} from "@/components/account/form/countryCodeComboBox";
import { useJsApiLoader } from "@react-google-maps/api";
import { Library } from "@googlemaps/js-api-loader";

const LIBRARIES: Library[] = ["places"];

export interface AddressFormData {
  id?: number;
  firstName: string;
  lastName: string;
  countryCode: CountryCodeObject | null;
  phone: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

interface CheckoutPageAddressFormProps {
  onSave: (serializedData: {
    id?: number;
    firstName: string;
    lastName: string;
    countryCode: string;
    phone: string;
    address: string;
    address2: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  }) => Promise<void>;
  existingCount?: number;
  isEditMode?: boolean;
}

const CheckoutPageAddressForm: React.FC<CheckoutPageAddressFormProps> = ({
  onSave,
  existingCount = 0,
  isEditMode = false,
}) => {
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddressFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      countryCode: null,
      phone: "",
      address: "",
      address2: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    },
  });

  useEffect(() => {
    register("countryCode", {
      validate: (val) => (val !== null ? true : "Country code is required"),
    });
  }, [isEditMode, existingCount, register, setValue]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string,
    libraries: LIBRARIES,
  });

  const addressInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isLoaded && addressInputRef.current) {
      const options = { componentRestrictions: { country: ["us", "ca"] } };
      const autocomplete = new google.maps.places.Autocomplete(
        addressInputRef.current,
        options,
      );
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place?.address_components) return;
        let streetAddress = "";
        let city = "";
        let state = "";
        let country = "";
        let zipCode = "";
        for (const comp of place.address_components) {
          const types = comp.types;
          if (types.includes("street_number")) {
            streetAddress = comp.long_name + " " + streetAddress;
          }
          if (types.includes("route")) {
            streetAddress += comp.long_name;
          }
          if (types.includes("locality")) {
            city = comp.long_name;
          }
          if (types.includes("administrative_area_level_1")) {
            state = comp.long_name;
          }
          if (types.includes("country")) {
            country = comp.long_name;
          }
          if (types.includes("postal_code")) {
            zipCode = comp.long_name;
          }
        }
        setValue("address", streetAddress.trim());
        setValue("city", city);
        setValue("state", state);
        setValue("country", country);
        setValue("zipCode", zipCode);
      });
    }
    register("countryCode", {
      validate: (val) => (val !== null ? true : "Country code is required"),
    });
  }, [isLoaded, setValue, register]);

  const onSubmit: SubmitHandler<AddressFormData> = async (formData) => {
    const ccString = formData.countryCode
      ? JSON.stringify(formData.countryCode)
      : "";
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      countryCode: ccString,
      phone: formData.phone,
      address: formData.address,
      address2: formData.address2,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      zipCode: formData.zipCode,
    };
    await onSave(payload);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className={`text-gray-700`}
    >
      {/* Customer Info */}
      <div className="mb-6">
        <h4 className="text-md font-semibold text-gray-800 mb-2">
          Customer Info
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              placeholder="John"
              {...register("firstName", { required: "First name is required" })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
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
          <div>
            <label className="block text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              placeholder="Wick"
              {...register("lastName", { required: "Last name is required" })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
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
          <div>
            <CountryCodeComboBox
              value={watch("countryCode")}
              onChange={(newVal) => {
                setValue("countryCode", newVal);
                if (newVal) clearErrors("countryCode");
              }}
              error={!!errors.countryCode}
            />
            {errors.countryCode && (
              <p className="text-red-500 text-sm mt-1">
                {errors.countryCode.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              placeholder="23456789"
              onKeyDown={handlePhoneNumberKeyDown}
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^\+?[1-9]\d{1,14}$/,
                  message: "Invalid phone number (E.164 format). E.g. 23456789",
                },
              })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
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

      {/* Address Info */}
      <div className="mb-6">
        <h4 className="text-md font-semibold text-gray-800 mb-2">
          Address Info
        </h4>
        {(() => {
          const { ref: addressHookFormRef, ...addressField } = register(
            "address",
            { required: "Address is required" },
          );
          return (
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Full Address</label>
              <input
                ref={(el) => {
                  addressInputRef.current = el;
                  addressHookFormRef(el);
                }}
                {...addressField}
                type="text"
                placeholder="1234 Main St"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
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
          );
        })()}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Address 2</label>
          <input
            type="text"
            placeholder="Apt, suite, floor, etc."
            {...register("address2")}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.address2
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-green-500"
            }`}
          />
          {errors.address2 && (
            <p className="text-red-500 text-sm mt-1">
              {errors.address2.message}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-1">City</label>
            <input
              type="text"
              placeholder="New York"
              {...register("city", { required: "City is required" })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.city
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-green-500"
              }`}
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 mb-1">State / Province</label>
            <input
              type="text"
              placeholder="NY"
              {...register("state", { required: "State is required" })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-1">Country</label>
            <input
              type="text"
              placeholder="United States"
              {...register("country", { required: "Country is required" })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
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
            <label className="block text-gray-700 mb-1">
              ZIP / Postal Code
            </label>
            <input
              type="text"
              placeholder="10001"
              {...register("zipCode", {
                required: "ZIP / Postal code is required",
              })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
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
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Saving..." : "Save Address"}
        </button>
      </div>
    </form>
  );
};

export default CheckoutPageAddressForm;
