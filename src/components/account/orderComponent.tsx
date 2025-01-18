import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingComponent from "@/components/common/loadingComponent";
import Link from 'next/link';

interface OrderComponentProps {
  customerOrder?: {
    id: number;
    orderNumber: string;
  }[];
}

const OrderComponent: React.FC<OrderComponentProps> = ({ customerOrder }) => {
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
      <div>
        <h2 className="text-2xl font-bold text-black">Order</h2>
      </div>
      <div className={`text-black`}>
        {customerOrder && customerOrder.length > 0 ? (
          <>
            {customerOrder.map((order) => (
              <div key={order.id} className="border p-4 my-4">
                <p className="text-lg font-semibold">{order.orderNumber}</p>
              </div>
            ))}
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
              Your order is empty
            </h3>
            <p className="text-gray-500 mb-6">
              You haven&#39;t placed any orders yet. Start shopping now.
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

export default OrderComponent;
