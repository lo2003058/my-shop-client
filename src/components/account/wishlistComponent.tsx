import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingComponent from "@/components/common/loadingComponent";
import Link from "next/link";
import Image from "next/image";
import WishlistButton from "@/components/product/wishlistButton";
import { useQuery } from "@apollo/client";
import { GetCustomerWishList } from "@/types/customer/types";
import { GET_CUSTOMER_WISHLIST } from "@/graphql/account/queries";
import Swal from "sweetalert2";
import PaginationButtons from "@/components/common/paginationButtons";

interface WishListComponentProps {
  customer?: {
    id: number;
  };
}

interface WishListItem {
  product: {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    price: number;
  };
}

const WishListComponent: React.FC<WishListComponentProps> = ({ customer }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [customerId, setCustomerId] = useState<number | undefined>();
  const [page, setPage] = useState(1);
  const pageSize = 4;

  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!session) router.push("/auth/signin"); // Redirect if not authenticated
    if (customer?.id) {
      // Convert to number if needed (or keep as string if your schema expects a string)
      const idAsNumber = Number(customer.id);
      setCustomerId(idAsNumber);
    }
  }, [session, status, router]);

  const { data, loading, error, refetch } = useQuery<GetCustomerWishList>(
    GET_CUSTOMER_WISHLIST,
    {
      variables: { customerId, page, pageSize },
      context: {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      },
      fetchPolicy: "network-only",
    },
  );

  if (status === "loading" || loading) {
    return <LoadingComponent />;
  }

  // If the query has an error, show it
  if (error) {
    console.log("error: ", error);
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

  const wishlistData = data?.customerWishList;
  const items = wishlistData?.items ?? [];
  const totalPages = wishlistData?.totalPages ?? 1;

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
      refetch({ page: page + 1, pageSize });
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
      refetch({ page: page - 1, pageSize });
    }
  };

  return (
    <div className={`h-screen`}>
      <h2 className="text-2xl font-bold text-black pb-4">Wishlist</h2>

      <div className="max-w-6xl mx-auto">
        {items && items.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {items.map((item: WishListItem) => (
                <div
                  key={item.product.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
                >
                  {item.product.imageUrl ? (
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      height={256}
                      width={256}
                      className="h-48 w-full object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="h-48 w-full bg-gray-200 flex items-center justify-center rounded-t-lg">
                      <span className="text-gray-500">No Image Available</span>
                    </div>
                  )}
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {item.product.name}
                    </h3>
                    <p className="text-gray-600 flex-grow">
                      {item.product.description.length > 100
                        ? `${item.product.description.slice(0, 100)}...`
                        : item.product.description}
                    </p>
                    <div className="mt-4">
                      <span className="text-lg font-bold text-indigo-600">
                        ${item.product.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-5 gap-2">
                      <Link
                        href={`/product/${item.product.id}`}
                        className="col-span-4 bg-indigo-600 text-white py-3 px-4 rounded hover:bg-indigo-700 transition-colors duration-300"
                      >
                        View Product
                      </Link>
                      <WishlistButton
                        productId={item.product.id}
                        refetchCustomer={refetch}
                        isFavorite={true}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <PaginationButtons
              currentPage={page}
              totalPages={totalPages}
              onNextPage={handleNextPage}
              onPrevPage={handlePrevPage}
            />
          </>
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
              Your wishlist is empty
            </h3>
            <p className="text-gray-500 mb-6">
              Browse our products and add your favorite items to your wishlist.
            </p>
            <Link
              href={"/product"}
              className="bg-indigo-600 text-white py-2 px-6 rounded hover:bg-indigo-700 transition-colors duration-300"
            >
              Shop Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishListComponent;
