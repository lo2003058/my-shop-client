"use client";

import React, { Fragment } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { useMutation } from "@apollo/client";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

import LoadingComponent from "@/components/common/loadingComponent";
import {
  CREATE_CUSTOMER_ADDRESS,
  UPDATE_CUSTOMER_ADDRESS,
} from "@/graphql/account/mutation";
import { GqlErrorMessage } from "@/types/error/types";
import { AddressFormData, EditAddressData } from "@/types/customer/types";
import AddressForm from "@/components/account/form/addressForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** The ID of the customer who owns this address. */
  customerId?: number;
  /** Number of existing addresses. If 0 => isDefault is checked. */
  existingAddressesCount?: number;
  /** If editing an existing address, pass data. Otherwise, new. */
  editAddress?: EditAddressData | null;
}

const AddressFormModal: React.FC<AddressFormModalProps> = ({
  isOpen,
  onClose,
  customerId,
  existingAddressesCount = 0,
  editAddress,
}) => {
  const { data: session, status } = useSession();

  // If session loading, show spinner
  if (status === "loading") {
    return <LoadingComponent />;
  }

  const isEditMode = Boolean(editAddress?.id);

  // Apollo Mutations
  const [createCustomerAddress] = useMutation(CREATE_CUSTOMER_ADDRESS);
  const [updateCustomerAddress] = useMutation(UPDATE_CUSTOMER_ADDRESS);

  // "onSave" is called by <AddressForm> upon final submission
  const handleSave = async (formData: AddressFormData) => {
    try {
      if (isEditMode && editAddress?.id) {
        // Update
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
        // Create
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

      onClose(); // close modal after success
    } catch (err: unknown) {
      const error = err as GqlErrorMessage;

      // Extract error message
      const errorMessage =
        error?.graphQLErrors?.[0]?.message ||
        error?.message ||
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

  // Combine any existing data for the form
  const initialData = editAddress
    ? {
        tag: editAddress.tag,
        firstName: editAddress.firstName,
        lastName: editAddress.lastName,
        countryCode: editAddress.countryCode,
        phone: editAddress.phone,
        address: editAddress.address,
        address2: editAddress.address2,
        city: editAddress.city,
        state: editAddress.state,
        country: editAddress.country,
        zipCode: editAddress.zipCode,
        isDefault: editAddress.isDefault,
      }
    : {};

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        {/* Fade-in backdrop */}
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

        {/* Centered modal */}
        <div className="fixed inset-0 z-10 overflow-y-auto">
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
              <Dialog.Panel className="relative transform overflow-hidden w-full max-w-3xl rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:p-6">
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
                      : "Fill out the form to add a new address."}
                  </p>
                </div>

                {/* AddressForm */}
                <AddressForm
                  onSave={handleSave}
                  initialData={initialData}
                  existingCount={existingAddressesCount}
                  isEditMode={isEditMode}
                />

                {/* Close (X) button in the top-right */}
                <div
                  className="absolute top-3 right-3 flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 cursor-pointer"
                  onClick={onClose}
                >
                  <button
                    type="button"
                    className="text-black hover:bg-gray-100 hover:text-gray-700 transition-colors"
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddressFormModal;
