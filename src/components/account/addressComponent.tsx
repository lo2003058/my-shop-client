import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@headlessui/react";
import { useMutation, useQuery } from "@apollo/client";
import Swal from "sweetalert2";

import AddressFormModal from "@/components/account/form/addressFormModal";
import LoadingComponent from "@/components/common/loadingComponent";
import { GET_CUSTOMER_ADDRESSES } from "@/graphql/account/queries";
import { EditAddressData, GetCustomerAddress } from "@/types/customer/types";
import {
  REMOVE_CUSTOMER_ADDRESS,
  UPDATE_CUSTOMER_DEFAULT_ADDRESS,
} from "@/graphql/account/mutation";
import { GqlErrorMessage } from "@/types/error/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faMapPin,
  faPen,
  faPhone,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Tooltip from "@/components/common/tooltip";

interface AddressComponentProps {
  customer?: {
    id: number;
  };
}

const AddressComponent: React.FC<AddressComponentProps> = ({ customer }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [customerId, setCustomerId] = useState<number | undefined>();

  const [isModalOpen, setModalOpen] = useState(false);

  const [editAddress, setEditAddress] = useState<EditAddressData | null>(null);

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

  const [updateCustomerDefaultAddress] = useMutation(
    UPDATE_CUSTOMER_DEFAULT_ADDRESS,
  );
  const [deleteCustomerAddress] = useMutation(REMOVE_CUSTOMER_ADDRESS);

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

  const handleOpenModalForCreate = () => {
    setEditAddress(null);
    setModalOpen(true);
  };

  const handleOpenModalForEdit = (addr: EditAddressData) => {
    setEditAddress(addr);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    refetch().finally(() => setModalOpen(false));
  };

  const handleUpdateDefaultAddress = async (addressId: number) => {
    try {
      await updateCustomerDefaultAddress({
        variables: {
          addressId: addressId,
          customerId: customerId,
        },
        context: {
          headers: { Authorization: `Bearer ${session?.accessToken}` },
        },
      })
        .then(async () => {
          await Swal.fire({
            position: "center",
            icon: "success",
            title: "Default Address Updated",
            text: "Your default address has been updated.",
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .finally(() => {
          refetch(); // or any other state update needed
        });
    } catch (err: unknown) {
      // Safely narrow 'err' to GqlErrorMessage
      const error = err as GqlErrorMessage;

      // Extract error message
      const errorMessage =
        error?.graphQLErrors?.[0]?.message ||
        error?.message ||
        "An error occurred while updating your default address.";

      await Swal.fire({
        position: "center",
        icon: "error",
        title: "Update Default Address Error",
        text: errorMessage,
        timer: 1500,
      });
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    try {
      await Swal.fire({
        title: "Delete Address",
        text: "Are you sure you want to delete this address?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        confirmButtonColor: "red",
        cancelButtonText: "Cancel",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deleteCustomerAddress({
            variables: {
              id: addressId,
            },
            context: {
              headers: { Authorization: `Bearer ${session?.accessToken}` },
            },
          })
            .then(async () => {
              await Swal.fire({
                position: "center",
                icon: "success",
                title: "Address Deleted Successfully",
                text: "Your address has been removed.",
                showConfirmButton: false,
                timer: 1500,
              });
            })
            .finally(() => {
              refetch(); // or any other state update needed
            });
        }
      });
    } catch (err: unknown) {
      // Safely narrow 'err' to GqlErrorMessage
      const error = err as GqlErrorMessage;

      // Extract error message
      const errorMessage =
        error?.graphQLErrors?.[0]?.message ||
        error?.message ||
        "An error occurred while deleting your address.";

      await Swal.fire({
        position: "center",
        icon: "error",
        title: "Delete Address Error",
        text: errorMessage,
        timer: 1500,
      });
    }
  };

  const customerAddress = data?.customerAddress;

  return (
    <div className="min-h-screen p-4">
      {/* Top bar with title + add button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-black">Address</h2>
        {/* Only show "Add" if addresses exist, or the user is loaded */}
        {customerAddress && customerAddress.length > 0 && (
          // Show tooltip if max address limit reached
          <Tooltip
            text={
              customerAddress.length >= 5
                ? "You have reached the maximum address limit."
                : ""
            }
            position={`bottom`}
          >
            <Button
              onClick={handleOpenModalForCreate}
              className={
                customerAddress.length >= 5
                  ? "bg-gray-500 text-white py-2 px-6 rounded transition-colors duration-300 cursor-not-allowed "
                  : "bg-indigo-600 text-white py-2 px-6 rounded hover:bg-indigo-700 transition-colors duration-300"
              }
              disabled={customerAddress.length >= 5}
            >
              Add address
            </Button>
          </Tooltip>
        )}
      </div>

      {customerAddress && customerAddress.length > 0 ? (
        <div className="space-y-4">
          {customerAddress.map((address) => (
            <div
              key={address.id}
              className="relative border border-gray-200 shadow-sm rounded-lg p-4 bg-white"
            >
              {/* Top-right buttons */}
              <div className="absolute top-2 right-2 flex flex-col items-center space-y-1 sm:flex-row sm:space-y-0 sm:space-x-1">
                {/* Not default => Show 'Set to default' */}
                {!address.isDefault && (
                  <Tooltip text="Set to default">
                    <div
                      className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleUpdateDefaultAddress(address.id)}
                    >
                      <Button className="text-black hover:bg-gray-100 hover:text-gray-700">
                        <FontAwesomeIcon icon={faMapPin} />
                      </Button>
                    </div>
                  </Tooltip>
                )}

                {/* Edit button */}
                <Tooltip text="Edit">
                  <div
                    className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleOpenModalForEdit(address)}
                  >
                    <Button className="text-black hover:bg-gray-100 hover:text-gray-700">
                      <FontAwesomeIcon icon={faPen} />
                    </Button>
                  </div>
                </Tooltip>

                {/* Delete button (hidden if there's only one address or if it's default) */}
                {customerAddress.length > 1 && !address.isDefault && (
                  <Tooltip text="Delete">
                    <div
                      className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleDeleteAddress(address.id)}
                    >
                      <Button className="text-black hover:bg-gray-100 hover:text-gray-700">
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </div>
                  </Tooltip>
                )}
              </div>

              {/* Main Address Info */}
              <div className="mb-2">
                <div className="mb-2 flex flex-wrap items-center text-lg font-semibold text-gray-800">
                  {/* Full Name */}
                  <span className="mr-2">
                    {address.firstName} {address.lastName}
                  </span>

                  {/* Default Address Badge */}
                  {address.isDefault && (
                    <span className="mr-2 inline-flex items-center gap-x-1.5 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                      <svg
                        viewBox="0 0 6 6"
                        aria-hidden="true"
                        className="h-1.5 w-1.5 fill-blue-500"
                      >
                        <circle r={3} cx={3} cy={3} />
                      </svg>
                      Default Address
                    </span>
                  )}

                  {/* Tag Badge */}
                  {address.tag && (
                    <span className="inline-flex items-center gap-x-1.5 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                      <svg
                        viewBox="0 0 6 6"
                        aria-hidden="true"
                        className="h-1.5 w-1.5 fill-green-500"
                      >
                        <circle r={3} cx={3} cy={3} />
                      </svg>
                      {address.tag}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-700 mt-3 space-y-3">
                {/* Phone Row */}
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faPhone} className="text-blue-500" />
                  <p>
                    <span className="font-semibold">Phone:</span>{" "}
                    {JSON.parse(address.countryCode).root} {address.phone}
                  </p>
                </div>

                {/* Address Block */}
                <div className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="mt-0.5 text-green-500"
                  />
                  <div>
                    <p>
                      <span className="font-semibold">Address:</span>{" "}
                      {address.address2 ? address.address2 + `-` : ``}
                      {address.address}
                    </p>
                    <p>
                      {address.city}, {address.state}, {address.country} -{" "}
                      {address.zipCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/*add reminder to customer, if your address not correct, it will affect shipping time*/}
          <div className="flex items-center justify-center mt-4">
            <p className="text-sm text-gray-500">
              Please make sure your address is correct. Incorrect address may
              make delivery time longer.
            </p>
          </div>
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
