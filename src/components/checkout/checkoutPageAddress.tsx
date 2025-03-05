import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GetCustomerAddress, CustomerAddress } from "@/types/customer/types";
import { GET_CUSTOMER_ADDRESSES } from "@/graphql/account/queries";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingComponent from "@/components/common/loadingComponent";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPhone,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import CheckoutPageAddressForm from "@/components/checkout/checkoutPageAddressForm";
import Tooltip from "@/components/common/tooltip";

/**
 * Utility function to combine CSS classes.
 */
function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// Extend the CustomerAddress type with an optional "isNew" flag.
type ExtendedCustomerAddress = CustomerAddress & { isNew?: boolean };

type AddressSelection = number | "new" | null;

export interface CheckoutPageAddressProps {
  onSelect: (address: ExtendedCustomerAddress | null) => void;
}

const CheckoutPageAddress: React.FC<CheckoutPageAddressProps> = ({
  onSelect,
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { data, loading, error } = useQuery<GetCustomerAddress>(
    GET_CUSTOMER_ADDRESSES,
    {
      variables: { customerId: session?.user?.id },
      context: { headers: { Authorization: `Bearer ${session?.accessToken}` } },
      fetchPolicy: "network-only",
      skip: !session?.user?.id,
    },
  );

  // Local state for addresses (existing + newly added)
  const [addresses, setAddresses] = useState<ExtendedCustomerAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] =
    useState<AddressSelection>(null);
  const [defaultAddress, setDefaultAddress] = useState<CustomerAddress | null>(
    null,
  );
  // Flag to hide the "Add New Address" option once a new address is saved.
  const [hideAddNew, setHideAddNew] = useState<boolean>(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
  }, [session, status, router]);

  // Initialize addresses only once.
  useEffect(() => {
    if (data?.customerAddress && addresses.length === 0) {
      setAddresses(data.customerAddress);
      if (selectedAddressId === null) {
        const defaultAddress = data.customerAddress.find(
          (addr) => addr.isDefault,
        );
        if (defaultAddress) {
          setDefaultAddress(defaultAddress);
          setSelectedAddressId(defaultAddress.id);
          onSelect(defaultAddress);
        }
      }
    }
  }, [data, addresses.length, onSelect, selectedAddressId]);

  const handleAddNewAddress = () => {
    setSelectedAddressId("new");
    onSelect(null);
    setHideAddNew(false);
  };

  if (status === "loading" || loading) return <LoadingComponent />;
  if (error) {
    console.error("error: ", error);
    Swal.fire({
      title: "Error",
      text: error.message,
      icon: "error",
      showCancelButton: false,
    });
    return null;
  }

  return (
    <fieldset
      aria-label="Select your address"
      className="-space-y-px rounded-xl"
    >
      {/* Existing addresses */}
      {addresses.map((address) => (
        <div key={address.id} className="py-2">
          <label
            className={classNames(
              "group relative flex cursor-pointer border border-gray-200 p-4 focus:outline-none rounded-xl bg-white",
            )}
          >
            <input
              type="radio"
              name="customer-address"
              value={address.id}
              checked={selectedAddressId === address.id}
              onChange={() => {
                setSelectedAddressId(address.id);
                onSelect(address);
              }}
              className="relative mt-0.5 shrink-0 appearance-none rounded-full border border-gray-300 bg-white
              before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600
              checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            />
            <div className="ml-3 flex flex-col">
              <div className="mb-2 flex flex-wrap items-center text-lg font-semibold text-gray-800">
                <span className="mr-2">
                  {address.firstName} {address.lastName}
                </span>
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
              <div className="text-sm text-gray-700 mt-3 space-y-3">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faPhone} className="text-blue-500" />
                  <p>
                    <span className="font-semibold">Phone:</span>{" "}
                    {JSON.parse(address.countryCode).root} {address.phone}
                  </p>
                </div>
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
                {/* If this address is new, display a delete button */}
                {address.isNew && (
                  <button
                    type="button"
                    onClick={() => {
                      // Remove the new address from the list.
                      setAddresses((prev) =>
                        prev.filter((a) => a.id !== address.id),
                      );
                      // Reset selection so that "Add New Address" option reappears.
                      setSelectedAddressId(
                        defaultAddress ? defaultAddress.id : null,
                      );
                      onSelect(defaultAddress);
                      setHideAddNew(false);
                    }}
                    className="absolute top-1 right-4 text-red-600"
                  >
                    <Tooltip text="Delete">
                      <FontAwesomeIcon icon={faTrash} />
                    </Tooltip>
                  </button>
                )}
              </div>
            </div>
          </label>
        </div>
      ))}

      {/* "Add New Address" Option – render only if not hidden */}
      {!hideAddNew && (
        <div className="pt-2">
          <label
            key="new-address"
            className={classNames(
              selectedAddressId === "new" ? "rounded-t-xl" : "rounded-xl",
              "group flex cursor-pointer border border-gray-200 p-4 focus:outline-none bg-white",
            )}
          >
            <input
              type="radio"
              name="customer-address"
              value="new"
              checked={selectedAddressId === "new"}
              onChange={handleAddNewAddress}
              className="relative mt-0.5 shrink-0 appearance-none rounded-full border border-gray-300 bg-white
              before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600
              checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            />
            <div className="ml-3 flex flex-col">
              <span className="block text-lg font-semibold text-gray-800">
                Add New Address
              </span>
            </div>
          </label>
        </div>
      )}

      {/* When "Add New Address" is selected, show the form inline */}
      {selectedAddressId === "new" && !hideAddNew && (
        <div className="p-4 border border-t-0 border-gray-200 bg-white rounded-b-xl">
          <CheckoutPageAddressForm
            onSave={async (newAddressData) => {
              const newAddress: ExtendedCustomerAddress = {
                isDefault: false,
                tag: "",
                ...newAddressData,
                id: Date.now(), // Temporary id; replace with server id when available.
                customerId: Number(session?.user?.id),
                isNew: true,
              };
              setAddresses((prev) => [...prev, newAddress]);
              setSelectedAddressId(newAddress.id);
              onSelect(newAddress);
              setHideAddNew(true);
            }}
            existingCount={addresses.length}
          />
        </div>
      )}
    </fieldset>
  );
};

export default CheckoutPageAddress;
