import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingComponent from "@/components/common/loadingComponent";

interface WishlistComponentProps {
  customerWishlist?: {
    id: number;
    productId: number;
  }[];
}

const WishlistComponent: React.FC<WishlistComponentProps> = ({
  customerWishlist,
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
      <h2 className="text-2xl font-bold text-black">Wishlist</h2>
      {customerWishlist && customerWishlist.length > 0 ? (
        <>
          {customerWishlist.map((wishlist) => (
            <div key={wishlist.id} className="border p-4 my-4">
              <p className="text-lg font-semibold">{wishlist.productId}</p>
            </div>
          ))}
        </>
      ) : (
        <p className={`text-black`}>No wishlist found.</p>
      )}
    </div>
  );
};

export default WishlistComponent;
