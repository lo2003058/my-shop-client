"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faBox,
  faUser,
  faAddressBook,
} from "@fortawesome/free-solid-svg-icons";
import { SecondaryNavigationItem } from "@/types/customer/types";
import SecondaryNavigation from "@/components/account/secondaryNavigation";

const secondaryNavigation: SecondaryNavigationItem[] = [
  { name: "General", href: "/account", current: false, icon: faUser },
  { name: "Order", href: "/order", current: false, icon: faBox },
  {
    name: "Address",
    href: "/account/address",
    current: true,
    icon: faAddressBook,
  },
];

const CustomerAddress: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!session) router.push("/auth/signin"); // Redirect if not authenticated
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <FontAwesomeIcon
            icon={faStar}
            spin
            className="mx-auto h-12 w-12 text-indigo-600"
          />
          <p className="mt-4 text-gray-500">Loading user page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className={`mx-auto max-w-7xl pt-16 lg:flex lg:gap-x-16 lg:px-8`}>
        {/* Secondary Navigation */}
        <SecondaryNavigation navigationItems={secondaryNavigation} />

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">

          here for customer address

        </main>
      </div>
    </div>
  );
};

export default CustomerAddress;
