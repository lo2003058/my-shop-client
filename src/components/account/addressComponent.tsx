import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@headlessui/react";
import { useQuery } from "@apollo/client";
import Swal from "sweetalert2";

import AddressFormModal from "@/components/account/form/addressFormModal";
import LoadingComponent from "@/components/common/loadingComponent";
import { GET_CUSTOMER_ADDRESSES } from "@/graphql/account/queries";
import { GetCustomerAddress } from "@/types/customer/types";

interface AddressComponentProps {
  customer?: {
    id: number;
  };
}

/** Duplicate the shape from your editAddress interface if needed */
interface EditAddressData {
  id: number;
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

const AddressComponent: React.FC<AddressComponentProps> = ({ customer }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Track the numeric customerId (if any)
  const [customerId, setCustomerId] = useState<number | undefined>();

  // Modal open/close
  const [isModalOpen, setModalOpen] = useState(false);

  // For create vs. edit mode
  const [editAddress, setEditAddress] = useState<EditAddressData | null>(null);

  // -------------------------------
  // Fetch the user's addresses
  // -------------------------------
  const { data, loading, error, refetch } = useQuery<GetCustomerAddress>(
    GET_CUSTOMER_ADDRESSES,
    {
      variables: { customerId },
      context: {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      },
      fetchPolicy: "network-only",
      skip: !customerId, // don't run query if no customerId
    },
  );

  // -------------------------------
  // Auth & Setup
  // -------------------------------
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      // If user is not authenticated, redirect
      router.push("/auth/signin");
      return;
    }

    if (customer?.id) {
      setCustomerId(Number(customer.id));
    }
  }, [session, status, router, customer?.id]);

  // -------------------------------
  // Loading / Error States
  // -------------------------------
  if (status === "loading" || loading) {
    return <LoadingComponent />;
  }

  if (error) {
    console.error("error: ", error);
    Swal.fire({
      title: "Error",
      text: error.message,
      icon: "error",
      showCancelButton: false,
    }).then((res) => {
      if (res.isConfirmed) {
        signOut();
        router.push("/auth/signin");
      }
    });
  }

  // -------------------------------
  // Handlers
  // -------------------------------
  const handleOpenModalForCreate = () => {
    // Clear any previous edit data so we open in create mode
    setEditAddress(null);
    setModalOpen(true);
  };

  const handleOpenModalForEdit = (addr: EditAddressData) => {
    // Set the address we want to edit
    setEditAddress(addr);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    // After saving or closing, refetch addresses
    refetch().finally(() => setModalOpen(false));
  };

  // -------------------------------
  // Render
  // -------------------------------
  const customerAddress = data?.customerAddress;

  return (
    <div className="min-h-screen p-4">
      {/* Top bar with title + add button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-black">Address</h2>
        {/* Only show "Add" if addresses exist, or the user is loaded */}
        {customerAddress && customerAddress.length > 0 && (
          <Button
            onClick={handleOpenModalForCreate}
            className="bg-indigo-600 text-white py-2 px-6 rounded hover:bg-indigo-700 transition-colors duration-300"
          >
            Add Address
          </Button>
        )}
      </div>

      {customerAddress && customerAddress.length > 0 ? (
        <div className="space-y-4">
          {customerAddress.map((address) => (
            <div
              key={address.id}
              className="border border-gray-200 shadow-sm rounded-lg p-4 bg-white"
            >
              <div className="mb-2">
                <span className="block text-lg font-semibold text-gray-800">
                  {address.firstName} {address.lastName}
                </span>
              </div>
              <div className="mb-2">
                <p className="text-gray-700 text-sm">
                  <span className="font-medium">Phone:</span>{" "}
                  {address.countryCode} {address.phone}
                </p>
              </div>
              <div className="mb-2 text-gray-700 text-sm">
                <p>
                  <span className="font-medium">Address:</span>{" "}
                  {address.address}
                </p>
                <p>
                  {address.city}, {address.state}, {address.country} -{" "}
                  {address.zipCode}
                </p>
              </div>
              {address.isDefault && (
                <span className="inline-block mt-2 py-1 px-2 text-xs bg-indigo-100 text-indigo-700 rounded">
                  Default Address
                </span>
              )}

              {/* Edit button */}
              <div className="mt-4">
                <Button
                  onClick={() => handleOpenModalForEdit(address)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
                >
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* No addresses => show the placeholder + Add button */
        <div className="flex flex-col items-center justify-center mt-20">
          <svg
            className="w-16 h-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">
            No address found.
          </h3>
          <p className="text-gray-500 mb-6">
            You have not added any address yet.
          </p>
          <Button
            onClick={handleOpenModalForCreate}
            className="bg-indigo-600 text-white py-2 px-6 rounded hover:bg-indigo-700 transition-colors duration-300"
          >
            Add address
          </Button>
        </div>
      )}

      {/* AddressFormModal with create/edit mode */}
      <AddressFormModal
        customerId={customerId}
        existingAddressesCount={customerAddress?.length || 0}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editAddress={editAddress} // if null => create mode, if has data => edit mode
      />
    </div>
  );
};

export default AddressComponent;
