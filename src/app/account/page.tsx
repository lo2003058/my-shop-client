"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SecondaryNavigation from "@/components/account/secondaryNavigation";
import { secondaryNavigationRoute } from "@/config/secondaryNavigationRoute";
import GeneralComponent from "@/components/account/generalComponent";
import OrderComponent from "@/components/account/orderComponent";
import AddressComponent from "@/components/account/addressComponent";
import WishlistComponent from "@/components/account/wishlistComponent";
import LoadingComponent from "@/components/common/loadingComponent";

const Account: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [current, setCurrent] = useState("General");

  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!session) router.push("/auth/signin"); // Redirect if not authenticated
  }, [session, status, router]);

  if (status === "loading") {
    return <LoadingComponent />;
  }

  const selectedComponent = () => {
    switch (current) {
      case "General":
        return <GeneralComponent />;
      case "Order":
        return <OrderComponent />;
      case "Address":
        return <AddressComponent />;
      case "Wishlist":
        return <WishlistComponent />;
      default:
        return <GeneralComponent />;
    }
  };

  return (
    <div className="bg-white">
      <div className={`mx-auto max-w-7xl pt-16 lg:flex lg:gap-x-16 lg:px-8`}>
        {/* Secondary Navigation */}
        <SecondaryNavigation
          navigationItems={secondaryNavigationRoute}
          setCurrent={setCurrent}
        />

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">{selectedComponent()}</main>
      </div>
    </div>
  );
};

export default Account;
