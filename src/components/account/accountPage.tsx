"use client";

import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SecondaryNavigation from "@/components/account/secondaryNavigation";
import { secondaryNavigationRoute } from "@/config/secondaryNavigationRoute";
import { useQuery } from "@apollo/client";
import { GetCustomer } from "@/types/customer/types";
import { GET_CUSTOMER } from "@/graphql/account/queries";
import Swal from "sweetalert2";

import GeneralComponent from "@/components/account/generalComponent";
import OrderComponent from "@/components/account/orderComponent";
import AddressComponent from "@/components/account/addressComponent";
import WishlistComponent from "@/components/account/wishlistComponent";
import LoadingComponent from "@/components/common/loadingComponent";

const AccountPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // State for user ID
  const [customerId, setCustomerId] = useState<number | undefined>();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      // If no session, redirect to sign-in
      router.push("/auth/signin");
      return;
    }

    if (session.user?.id) {
      // Convert to number if needed (or keep as string if your schema expects a string)
      const idAsNumber = Number(session.user.id);
      setCustomerId(idAsNumber);
    }
  }, [status, session, router]);

  // Skip the query if customerId is not yet set
  const { loading, error, data } = useQuery<GetCustomer>(
    GET_CUSTOMER,
    {
      skip: !customerId,
      variables: { id: customerId },
      context: {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      },
    },
  );

  const [current, setCurrent] = useState("General");

  // If session is loading or the query is loading, show loading spinner
  if (status === "loading" || loading || !customerId) {
    return <LoadingComponent />;
  }

  // If the query has an error, show it
  if (error) {
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

  // Now you can safely use `data` since the query won’t run until `customerId` is ready
  const customer = data?.customer;

  // Simple component selector
  const selectedComponent = () => {
    switch (current) {
      case "General":
        return <GeneralComponent customer={customer} />;
      case "Order":
        return <OrderComponent customerOrder={[]} />;
      case "Address":
        return <AddressComponent customer={customer}/>;
      case "Wishlist":
        return (
          <WishlistComponent customer={customer}/>
        );
      default:
        return <GeneralComponent customer={customer} />;
    }
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl pt-16 lg:flex lg:gap-x-16 lg:px-8">
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

export default AccountPage;
