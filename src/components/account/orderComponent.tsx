import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingComponent from "@/components/common/loadingComponent";
import Link from "next/link";
import Swal from "sweetalert2";
import { useQuery } from "@apollo/client";
import { GET_CUSTOMER_ORDERS } from "@/graphql/account/queries";
import { GetCustomerOrders } from "@/types/customer/types";
import PaginationButtons from '@/components/common/paginationButtons';

interface OrderComponentProps {
  customer?: {
    id: number;
  };
}

const OrderComponent: React.FC<OrderComponentProps> = ({ customer }) => {
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

  const { data, loading, error, refetch } = useQuery<GetCustomerOrders>(
    GET_CUSTOMER_ORDERS,
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
    });
  }

  const customerOrders = data?.customerOrders;
  const items = customerOrders?.items ?? [];
  const totalPages = customerOrders?.totalPages ?? 1;

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
      <div>
        <h2 className="text-2xl font-bold text-black">Order</h2>
      </div>
      <div className={`text-black`}>
        {items && items.length > 0 ? (
          <>
            {items.map((order) => (
              <div key={order.id} className="border p-4 my-4">
                <p className="text-lg font-semibold">{order.orderNumber}</p>
              </div>
            ))}

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
