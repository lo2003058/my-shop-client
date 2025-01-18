"use client";

import React, { useEffect, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { handlePhoneNumberKeyDown } from "@/utils/phoneNumberHelper";
import CountryCodeComboBox, {
  CountryCodeObject,
} from "@/components/account/form/countryCodeComboBox";
import { useJsApiLoader } from "@react-google-maps/api";
import { Library } from '@googlemaps/js-api-loader';

const LIBRARIES: Library[] = ["places"];

/** The shape of your form data in memory */
export interface AddressFormData {
  tag: string;
  firstName: string;
  lastName: string;
  // We keep the object in memory
  countryCode: CountryCodeObject | null;
  phone: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault: boolean;
}

interface AddressFormProps {
  // This function is called with the final data
  onSave: (serializedData: {
    // Everything the server expects for saving
    // but `countryCode` is now a *string* (JSON)
    tag: string;
    firstName: string;
    lastName: string;
    countryCode: string; // we send a string
    phone: string;
    address: string;
    address2: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    isDefault: boolean;
  }) => Promise<void>;

  // The existing data from server, if any
  // Note we store the string for countryCode from the server,
  // so we parse it into an object for the form
  initialData?: Partial<{
    tag: string;
    firstName: string;
    lastName: string;
    countryCode: string; // This is a *string* from the server
    phone: string;
    address: string;
    address2: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    isDefault: boolean;
  }>;
  existingCount?: number;
  isEditMode?: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({
  onSave,
  initialData = {},
  existingCount = 0,
  isEditMode = false,
}) => {
  /**
   * We'll parse initialData.countryCode (string) into CountryCodeObject
   * so the ComboBox can display the correct item or null.
   */
  function parseCountryCode(str?: string): CountryCodeObject | null {
    if (!str) return null;
    try {
      const obj = JSON.parse(str) as CountryCodeObject;
      if (obj && obj.root && obj.cca3 && obj.name) {
        return obj;
      }
      return null;
    } catch {
      return null;
    }
  }

  // Convert the server string to an object for our local form
  const defaultCountryObj = parseCountryCode(initialData.countryCode);

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
      tag: initialData.tag || "",
      firstName: initialData.firstName || "",
      lastName: initialData.lastName || "",
      countryCode: defaultCountryObj, // store as object
      phone: initialData.phone || "",
      address: initialData.address || "",
      address2: initialData.address2 || "",
      city: initialData.city || "",
      state: initialData.state || "",
      country: initialData.country || "",
      zipCode: initialData.zipCode || "",
      isDefault: initialData.isDefault || false,
    },
  });

  // If user has 0 addresses => auto-set isDefault for new address
  useEffect(() => {
    if (!isEditMode && existingCount === 0) {
      setValue("isDefault", true);
    }
    // We validate countryCode is not null
    register("countryCode", {
      validate: (val) => (val !== null ? true : "Country code is required"),
    });
  }, [isEditMode, existingCount, register, setValue]);

  // Google places ...
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string,
    libraries: LIBRARIES,
  });

  const addressInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isLoaded && addressInputRef.current) {
      const options = {
        componentRestrictions: { country: ["us", "ca"] },
      };

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

        // Update form values
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
  }, [isLoaded, setValue]);

  /**
   * On submit, we stringify the CountryCodeObject
   * so we can pass a string to onSave
   */
  const onSubmit: SubmitHandler<AddressFormData> = async (formData) => {
    // Convert the object to a string
    const ccString = formData.countryCode
      ? JSON.stringify(formData.countryCode)
      : ""; // or maybe null

    const payload = {
      tag: formData.tag,
      firstName: formData.firstName,
      lastName: formData.lastName,
      countryCode: ccString, // pass the string
      phone: formData.phone,
      address: formData.address,
      address2: formData.address2,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      zipCode: formData.zipCode,
      isDefault: formData.isDefault,
    };

    await onSave(payload);
    reset();
  };

  // RENDER
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Tag Field */}
      <div className="mb-4">
        <label className="block mb-1 text-md font-semibold text-gray-800">
          Address Tag
        </label>
        <input
          type="text"
          placeholder="Home, Work, etc."
          {...register("tag", { required: "Tag is required" })}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black ${
            errors.tag
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-green-500"
          }`}
        />
        {errors.tag && (
          <p className="text-red-500 text-sm mt-1">{errors.tag.message}</p>
        )}
      </div>

      {/* Customer Info */}
      <div className="mb-6">
        <h4 className="text-md font-semibold text-gray-800 mb-2">
          Customer Info
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label className="block text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              placeholder="John"
              {...register("firstName", { required: "First name is required" })}
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
            <label className="block text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              placeholder="Wick"
              {...register("lastName", { required: "Last name is required" })}
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

          {/* Country Code => now an object */}
          <div>
            <CountryCodeComboBox
              value={watch("countryCode")}
              onChange={(newVal) => {
                setValue("countryCode", newVal);
                if (newVal) {               // If a valid value is selected
                  clearErrors("countryCode"); // Clear the error state for countryCode
                }
              }}
              error={!!errors.countryCode}
            />

            {errors.countryCode && (
              <p className="text-red-500 text-sm mt-1">
                {errors.countryCode.message}
              </p>
            )}
          </div>

          {/* Phone (E.164) */}
          <div>
            <label className="block text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              placeholder="123456789"
              onKeyDown={handlePhoneNumberKeyDown}
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^\+?[1-9]\d{1,14}$/,
                  message:
                    "Invalid phone number (E.164 format). E.g. +123456789",
                },
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

      {/* Address Info */}
      <div className="mb-6">
        <h4 className="text-md font-semibold text-gray-800 mb-2">
          Address Info
        </h4>

        {/* Full Address w/ Google Autocomplete */}
        {(() => {
          const { ref: addressHookFormRef, ...addressField } = register(
            "address",
            {
              required: "Address is required",
            },
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
          );
        })()}

        {/* Address2 */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Address 2</label>
          <input
            type="text"
            placeholder="Apt, suite, floor, etc."
            {...register("address2")}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black ${
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

        {/* City, State */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-1">City</label>
            <input
              type="text"
              placeholder="New York"
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
              <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 mb-1">State / Province</label>
            <input
              type="text"
              placeholder="NY"
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
            <label className="block text-gray-700 mb-1">Country</label>
            <input
              type="text"
              placeholder="United States"
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
            <label className="block text-gray-700 mb-1">
              ZIP / Postal Code
            </label>
            <input
              type="text"
              placeholder="10001"
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

        {/* isDefault if user is creating first address */}
        {!isEditMode && existingCount === 0 && (
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              {...register("isDefault")}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600"
            />
            <label className="ml-2 text-sm text-gray-700">
              Set as Default Address
            </label>
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-end space-x-2">
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
  );
};

export default AddressForm;
