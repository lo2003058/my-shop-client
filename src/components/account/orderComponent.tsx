import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingComponent from "@/components/common/loadingComponent";

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
          <p className={`text-black`}>No order found.</p>
        )}
      </div>
    </div>
  );
};

export default OrderComponent;
