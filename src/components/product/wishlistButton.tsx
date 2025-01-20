"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useMutation } from "@apollo/client";
import {
  CREATE_CUSTOMER_WISHLIST,
  REMOVE_CUSTOMER_WISHLIST,
} from "@/graphql/account/mutation";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";

interface WishlistButtonProps {
  productId: number;
  isFavorite?: boolean;
  refetchCustomer?: () => void;
}

export default function WishlistButton({
  productId,
  isFavorite = false,
  refetchCustomer,
}: WishlistButtonProps) {
  const { data: session, status } = useSession();
  const [customerId, setCustomerId] = useState<number | null>(null);

  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (session?.user?.id) setCustomerId(Number(session.user.id));
  }, [session, status]);

  const [isFavorited, setIsFavorited] = useState<boolean>(isFavorite || false);

  const [createCustomerWishList] = useMutation(CREATE_CUSTOMER_WISHLIST);
  const [removeCustomerWishList] = useMutation(REMOVE_CUSTOMER_WISHLIST);

  // Handle Favorite Toggle
  const handleFavoriteToggle = async () => {
    // Implement your favorite logic here
    try {
      console.log("customerId:", customerId);
      console.log("productId:", productId);

      if (!customerId) {
        return await Swal.fire({
          position: "center",
          icon: "error",
          title: "Please login to add to wishlist",
          showConfirmButton: false,
          timer: 1500,
        });
      }

      if (isFavorited) {
        // Remove from wishlist
        await removeCustomerWishList({
          variables: {
            customerId: customerId, // Customer ID
            productId: productId, // Product ID
          },
          context: {
            headers: { Authorization: `Bearer ${session?.accessToken}` },
          },
        }).then(async () => {
          await Swal.fire({
            position: "center",
            icon: "success",
            title: "Removed from Wishlist",
            showConfirmButton: false,
            timer: 1500,
          });
          setIsFavorited(false);
          if (refetchCustomer) {
            refetchCustomer();
          }
        });
      } else {
        // Add to wishlist
        await createCustomerWishList({
          variables: {
            input: {
              customerId: customerId, // Customer ID
              productId: productId, // Product ID
            },
          },
          context: {
            headers: { Authorization: `Bearer ${session?.accessToken}` },
          },
        }).then(async () => {
          await Swal.fire({
            position: "center",
            icon: "success",
            title: "Added to Wishlist",
            showConfirmButton: false,
            timer: 1500,
          });
          setIsFavorited(true);
          if (refetchCustomer) {
            refetchCustomer();
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <button
        onClick={handleFavoriteToggle}
        className={`p-3 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          isFavorited ? "bg-red-100 border-red-500" : ""
        }`}
        aria-label="Add to favorites"
      >
        <FontAwesomeIcon
          icon={faHeart}
          className={`h-6 w-6 ${
            isFavorited ? "text-red-500" : "text-gray-400 hover:text-red-500"
          }`}
        />
      </button>
    </>
  );
}
