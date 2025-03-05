"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useMutation } from "@apollo/client";
import { CREATE_PAYMENT_MUTATION } from "@/graphql/checkout/mutation";
import { useSession } from "next-auth/react";
import CheckoutPageAddress from "@/components/checkout/checkoutPageAddress";
import { CustomerAddressFormData } from "@/types/customer/types";
import { Button } from "@headlessui/react";
import { CartItem } from "@/redux/cartSlice";
import { useRouter } from "next/navigation";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const cartItems: CartItem[] = useSelector(
    (state: RootState) => state.cart.items,
  );
  const totalPrice = useSelector((state: RootState) => state.cart.totalAmount);
  const [customerAddress, setCustomerAddress] =
    useState<CustomerAddressFormData | null>(null);
  const [loading, setLoading] = useState(false);

  const [createPaymentSessionUrl] = useMutation(CREATE_PAYMENT_MUTATION);

  const getCustomerAddress = async (
    address: CustomerAddressFormData | null,
  ) => {
    setCustomerAddress(address);
  };

  const handleCheckout = async () => {
    setLoading(true);
    const formattedCartItems = cartItems.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      imageUrl: item.imageUrl || "",
    }));

    const formattedCustomerAddress = {
      firstName: customerAddress?.firstName || "",
      lastName: customerAddress?.lastName || "",
      address: customerAddress?.address || "",
      address2: customerAddress?.address2 || "",
      city: customerAddress?.city || "",
      state: customerAddress?.state || "",
      country: customerAddress?.country || "",
      zipCode: customerAddress?.zipCode || "",
      phone: customerAddress?.phone || "",
      countryCode: customerAddress?.countryCode
        ? JSON.parse(customerAddress.countryCode).root
        : "",
    };
    try {
      const { data } = await createPaymentSessionUrl({
        variables: {
          input: {
            customerId: session?.user.id,
            cartItems: formattedCartItems,
            customerAddress: formattedCustomerAddress,
          },
        },
      });
      if (data?.createPaymentSessionUrl.url) {
        router.push(data?.createPaymentSessionUrl.url);
      }
      setLoading(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message || "Failed to checkout.");
      } else {
        console.log("Failed to checkout.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 h-screen">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          {/* Left Column: Contact, Shipping, and Payment */}
          <div>
            {/* Contact Information */}
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Contact information
              </h2>
              <div className="mt-4">
                <label
                  htmlFor="email-address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-2 text-gray-700">{session?.user.email}</div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="mt-10 border-t border-gray-200 pt-10">
              <h2 className="text-lg font-medium text-gray-900">
                Shipping information
              </h2>
              <CheckoutPageAddress onSelect={getCustomerAddress} />
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="mt-10 lg:mt-0">
            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
            <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
              <ul role="list" className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex px-4 py-6 sm:px-6">
                    <div className="shrink-0">
                      <img
                        src={item.imageUrl || "https://via.placeholder.com/80"}
                        alt={item.name}
                        className="w-20 rounded-md"
                      />
                    </div>
                    <div className="ml-6 flex flex-1 flex-col">
                      <div className="flex">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-medium text-gray-700">
                            {item.name}
                          </h4>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-1 items-end justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          ${item.price} x {item.quantity}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="bg-white p-6 border-t rounded-b-xl border-gray-200">
                <dl className="flex justify-between items-center">
                  <dt className="text-lg font-bold text-gray-800">Total</dt>
                  <dd className="text-lg font-bold text-gray-900">
                    ${totalPrice.toFixed(2)}
                  </dd>
                </dl>
                <p className="mt-3 text-sm text-gray-600">
                  * The total amount <strong>does not</strong> include
                  applicable shipping fees and taxes.
                </p>
              </div>
            </div>

            <div className={`border-gray-200 pt-4`}>
              <Button
                disabled={loading || customerAddress === null}
                className={classNames(
                  loading || customerAddress === null ? "bg-gray-300" : "bg-indigo-600 hover:bg-indigo-700",
                  customerAddress === null ? "cursor-not-allowed" : "cursor-pointer",
                  "w-full rounded-md px-4 py-3 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                )}
                onClick={handleCheckout}
              >
                Pay Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
