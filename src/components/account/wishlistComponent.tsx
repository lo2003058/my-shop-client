import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingComponent from "@/components/common/loadingComponent";
import { CustomerWishList } from "@/types/customer/types";
import Link from "next/link";
import Image from "next/image";
import WishlistButton from "@/components/product/wishlistButton";

interface WishListComponentProps {
  customerWishList?: CustomerWishList[];
  refetchCustomer: () => void;
}

const WishListComponent: React.FC<WishListComponentProps> = ({
  customerWishList,
  refetchCustomer,
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!session) router.push("/auth/signin"); // Redirect if not authenticated
  }, [session, status, router]);

  if (status === "loading") {
    return <LoadingComponent />;
  }

  return (
    <div className={`h-screen`}>
      <h2 className="text-2xl font-bold text-black pb-4">Wishlist</h2>
      <div className="max-w-6xl mx-auto">
        {customerWishList && customerWishList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {customerWishList.map((wishList) => (
              <div
                key={wishList.product.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
              >
                {wishList.product.imageUrl ? (
                  <Image
                    src={wishList.product.imageUrl}
                    alt={wishList.product.name}
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
                    {wishList.product.name}
                  </h3>
                  <p className="text-gray-600 flex-grow">
                    {wishList.product.description.length > 100
                      ? `${wishList.product.description.slice(0, 100)}...`
                      : wishList.product.description}
                  </p>
                  <div className="mt-4">
                    <span className="text-lg font-bold text-indigo-600">
                      ${wishList.product.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-5 gap-2">
                    <Link
                      href={`/product/${wishList.product.id}`}
                      className="col-span-4 bg-indigo-600 text-white py-3 px-4 rounded hover:bg-indigo-700 transition-colors duration-300"
                    >
                      View Product
                    </Link>
                    <WishlistButton
                      productId={wishList.product.id}
                      refetchCustomer={refetchCustomer}
                      isFavorite={true}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
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
