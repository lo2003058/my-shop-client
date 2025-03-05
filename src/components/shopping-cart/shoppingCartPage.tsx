"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/redux/store";
import { removeItem, updateQuantity } from "@/redux/cartSlice";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashAlt,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Link from "next/link";
import RecommendProduct from "@/components/main/recommendProduct";

const ShoppingCartPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalPrice = useSelector((state: RootState) => state.cart.totalAmount);

  const handleQuantityChange = (id: number, quantity: number) => {
    if (quantity < 1) return;
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleRemoveItem = (id: number) => {
    dispatch(removeItem(id));
  };

  // Access authentication state
  const { data: session } = useSession();

  const handleCheckout = () => {
    if (!session) {
      // Redirect to sign in page if user is not authenticated
      router.push("/auth/signin");
      return;
    }
    router.push("/checkout");
  };

  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Shopping Cart
      </h1>

      {cartItems.length > 0 ? (
        <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          {/* Cart Items */}
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul
              role="list"
              className="divide-y divide-gray-200 border-b border-t border-gray-200"
            >
              {cartItems.map((item, index) => (
                <li key={item.id} className="flex py-6 sm:py-10">
                  <div className="shrink-0">
                    <Image
                      src={item.imageUrl || "/images/no-image-available.webp"}
                      alt={item.name}
                      width={96}
                      height={96}
                      priority
                      className="h-24 w-24 rounded-lg object-cover sm:h-48 sm:w-48"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-sm">
                            <Link
                              href={`/product/${item.id}`}
                              className="font-medium text-gray-700 hover:text-gray-800"
                            >
                              {item.name}
                            </Link>
                          </h3>
                        </div>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>

                      <div className="mt-4 sm:mt-0 sm:pr-9">
                        <div className="inline-grid w-full max-w-16 grid-cols-1">
                          <select
                            id={`quantity-${index}`}
                            name={`quantity-${index}`}
                            aria-label={`Quantity, ${item.name}`}
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                item.id,
                                Number(e.target.value),
                              )
                            }
                            className="col-start-1 row-start-1 appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 outline-gray-300 focus:outline focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                          >
                            {[...Array(10)].map((_, qty) => (
                              <option key={qty + 1} value={qty + 1}>
                                {qty + 1}
                              </option>
                            ))}
                          </select>
                          <FontAwesomeIcon
                            icon={faChevronDown}
                            aria-hidden="true"
                            className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                          />
                        </div>

                        <div className="absolute right-0 top-0">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-gray-500"
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <FontAwesomeIcon
                              icon={faTrashAlt}
                              className="h-5 w-5"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Order Summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
          >
            <h2
              id="summary-heading"
              className="text-lg font-medium text-gray-900"
            >
              Order summary
            </h2>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-sm text-gray-600">
                  Add your Shipping address at checkout to see shipping charges.
                </dt>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">
                  Order total
                </dt>
                <dd className="text-base font-medium text-gray-900">
                  {totalPrice > 0 ? `$${totalPrice.toFixed(2)}` : "$0.00"}
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Checkout
              </button>
            </div>
          </section>
        </form>
      ) : (
        <div className="flex flex-col items-center justify-center mt-20">
          <svg
            className="w-16 h-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">
            Your cart is empty
          </h3>
          <p className="text-gray-500 mb-6">
            You haven&#39;t added any items to your cart yet. Start shopping
            now.
          </p>
          <Link
            href={"/product"}
            className="bg-indigo-600 text-white py-2 px-6 rounded hover:bg-indigo-700 transition-colors duration-300"
          >
            Shop Now
          </Link>
        </div>
      )}

      <RecommendProduct />
    </div>
  );
};

export default ShoppingCartPage;
