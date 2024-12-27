// components/Header.tsx
"use client";

import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const navigation = [
  { name: "Product", href: "/product" },
  { name: "About Us", href: "/about-us" },
  { name: "FAQs", href: "/faqs" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Select cart items from Redux store
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Access authentication state
  const { data: session } = useSession();

  return (
    <header className="bg-gray-200">
      <nav
        aria-label="Global"
        className="relative flex items-center justify-between p-4 lg:px-8 max-w-8xl mx-auto"
      >
        {/* Mobile Menu Button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold text-gray-900 hover:text-gray-700"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Centered Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link href="/">
            <span className="sr-only">Yin Company</span>
            <Image
              src={"/images/happy-pepe.png"}
              alt={"Yin Company"}
              className="h-16 w-auto"
              width={64}
              height={64}
            />
          </Link>
        </div>

        {/* User and Cart Icons */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end space-x-6">
          {/* User Icon */}
          <Link
            href={session ? "/account" : "/auth/signin"}
            className="text-gray-900 hover:text-gray-700 flex items-center"
            aria-label={session ? "User" : "Sign In"}
          >
            {/* Optionally Display User Avatar */}
            {session?.user.image ? (
              <Image
                src={session.user.image || "/images/default-avatar.png"}
                alt={session.user.firstName || "User Avatar"}
                className="h-6 w-6 rounded-full object-cover"
                width={32}
                height={32}
              />
            ) : (
              <Image
                src={"/images/default-avatar.png"}
                alt={"User Avatar"}
                className="h-10 w-10 rounded-full object-cover border-2 border-gray-600 bg-gray-100"
                width={32}
                height={32}
              />
              // <FontAwesomeIcon icon={faUser} className="h-6 w-6" />
            )}
          </Link>

          {/* Cart Icon with Badge */}
          <Link
            href="/shopping-cart"
            className="relative text-gray-900 hover:text-gray-700 flex items-center"
            aria-label="Shopping Cart"
          >
            <FontAwesomeIcon icon={faShoppingCart} className="h-6 w-6" />
            {totalItems > 0 && (
              <span className="absolute -top-4 -right-4 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* Mobile Menu Dialog */}
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full max-w-sm overflow-y-auto bg-white px-6 py-6 shadow-xl ring-1 ring-gray-900/10">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Yin Company</span>
              <Image
                src={"/images/happy-pepe.png"}
                alt={"Yin Company"}
                className="h-12 w-auto"
                width={64}
                height={64}
              />
            </Link>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="mt-6">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6 flex items-center space-x-4">
                {/* User Icon */}
                <Link
                  href={session ? "/account" : "/auth/signin"}
                  className="text-gray-900 hover:text-gray-700 flex items-center"
                  aria-label={session ? "User" : "Sign In"}
                >
                  {/* Optionally Display User Avatar */}
                  {session?.user.image ? (
                    <Image
                      src={session.user.image || "/images/default-avatar.png"}
                      alt={session.user.firstName || "User Avatar"}
                      className="h-6 w-6 rounded-full object-cover"
                      width={32}
                      height={32}
                    />
                  ) : (
                    <Image
                      src={"/images/default-avatar.png"}
                      alt={"User Avatar"}
                      className="h-10 w-10 rounded-full object-cover border-2 border-gray-600 bg-gray-100"
                      width={32}
                      height={32}
                    />
                    // <FontAwesomeIcon icon={faUser} className="h-6 w-6" />
                  )}
                </Link>

                {/* Cart Icon with Badge */}
                <Link
                  href="/shopping-cart"
                  className="relative text-gray-900 hover:text-gray-700 flex items-center"
                  aria-label="Shopping Cart"
                >
                  <FontAwesomeIcon icon={faShoppingCart} className="h-6 w-6" />
                  {totalItems > 0 && (
                    <span className="absolute -top-4 -right-4 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                      {totalItems > 99 ? "99+" : totalItems}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
