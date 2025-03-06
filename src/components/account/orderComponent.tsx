import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingComponent from "@/components/common/loadingComponent";
import Link from "next/link";
import Swal from "sweetalert2";
import { useQuery } from "@apollo/client";
import { GET_CUSTOMER_ORDERS } from "@/graphql/account/queries";
import { GetCustomerOrders } from "@/types/customer/types";
import PaginationButtons from "@/components/common/paginationButtons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faCalendarAlt,
  faCreditCard,
  faDollarSign,
  faEye,
  faMapMarkerAlt,
  faReceipt,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Tooltip from "@/components/common/tooltip";
import { Button } from "@headlessui/react";
import moment from "moment";

interface OrderComponentProps {
  customer?: {
    id: number;
  };
}

const OrderComponent: React.FC<OrderComponentProps> = ({ customer }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  // Adding orderStatus filter state ("all" by default)
  const [orderStatus, setOrderStatus] = useState<string>("all");
  const [customerId, setCustomerId] = useState<number | undefined>();
  const [page, setPage] = useState(1);
  const pageSize = 2;

  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!session) router.push("/auth/signin"); // Redirect if not authenticated
    if (customer?.id) {
      const idAsNumber = Number(customer.id);
      setCustomerId(idAsNumber);
    }
  }, [session, status, router, customer]);

  // Include orderStatus in the query variables
  const { data, loading, error, refetch } = useQuery<GetCustomerOrders>(
    GET_CUSTOMER_ORDERS,
    {
      variables: { customerId, page, pageSize, orderStatus },
      context: {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      },
      fetchPolicy: "network-only",
      skip: !customerId,
    },
  );

  if (status === "loading" || loading) {
    return <LoadingComponent />;
  }

  if (error) {
    console.log("error: ", error);
    Swal.fire({
      title: "Error",
      text: error.message,
      icon: "error",
      showCancelButton: false,
    });
  }

  const orders = data?.orders;
  const items = orders?.items ?? [];
  const totalPages = orders?.totalPages ?? 1;

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
      refetch({ customerId, page: page + 1, pageSize, orderStatus });
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
      refetch({ customerId, page: page - 1, pageSize, orderStatus });
    }
  };

  const handleViewOrder = (orderId: number) => {
    alert("view order: " + orderId);
  };

  const handleCancelOrder = (orderId: number) => {
    alert("cancel order: " + orderId);
  };

  // Handler for filtering orders by status.
  const handleStatusFilter = (status: string) => {
    // Reset page to 1 when changing filter.
    setPage(1);
    setOrderStatus(status);
    // Optionally, you can call refetch immediately:
    refetch({ customerId, page: 1, pageSize, orderStatus: status });
  };

  return (
    <div className={`h-screen`}>
      <h2 className="text-2xl font-bold text-black my-2">Order</h2>
      <div className={`text-black max-w-6xl mx-auto`}>
        {/* Add the filter badges */}
        <div className="flex space-x-2 mb-4">
          {/* "All" badge to reset the filter */}
          <span
            onClick={() => handleStatusFilter("all")}
            className={`cursor-pointer inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
              orderStatus === "all"
                ? "bg-blue-100 text-blue-700 ring-1 ring-inset ring-blue-500/10"
                : "bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10"
            }`}
          >
            All
          </span>
          {/* "Pending" badge */}
          <span
            onClick={() => handleStatusFilter("pending")}
            className={`cursor-pointer inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
              orderStatus === "pending"
                ? "bg-yellow-100 text-yellow-700 ring-1 ring-inset ring-yellow-500/10"
                : "bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10"
            }`}
          >
            Pending
          </span>
          <span
            onClick={() => handleStatusFilter("delivered")}
            className={`cursor-pointer inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
              orderStatus === "delivered"
                ? "bg-green-100 text-green-700 ring-1 ring-inset ring-green-500/10"
                : "bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10"
            }`}
          >
            Delivered
          </span>
          <span
            onClick={() => handleStatusFilter("cancelled")}
            className={`cursor-pointer inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
              orderStatus === "cancelled"
                ? "bg-red-100 text-red-700 ring-1 ring-inset ring-red-500/10"
                : "bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10"
            }`}
          >
            Cancelled
          </span>
        </div>

        {items && items.length > 0 ? (
          <>
            <div className="space-y-4">
              {items.map((order) => (
                <div
                  key={order.id}
                  className="relative border border-gray-200 shadow-sm rounded-lg p-4 bg-white"
                >
                  {/* Top-right action buttons */}
                  <div className="absolute top-2 right-2 flex flex-col items-center space-y-1 sm:flex-row sm:space-y-0 sm:space-x-1">
                    {/* View Details button */}
                    <Tooltip text="View Details">
                      <div
                        className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleViewOrder(order.id)}
                      >
                        <Button className="text-black hover:bg-gray-100 hover:text-gray-700">
                          <FontAwesomeIcon icon={faEye} />
                        </Button>
                      </div>
                    </Tooltip>

                    {/* Cancel Order button (only if order isn't already cancelled) */}
                    {order.status.toLowerCase() !== "cancelled" && (
                      <Tooltip text="Cancel Order">
                        <div
                          className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleCancelOrder(order.id)}
                        >
                          <Button className="text-black hover:bg-gray-100 hover:text-gray-700">
                            <FontAwesomeIcon icon={faTimes} />
                          </Button>
                        </div>
                      </Tooltip>
                    )}
                  </div>

                  {/* Main Order Information */}
                  <div className="mb-2">
                    <div className="mb-2 flex flex-wrap items-center text-lg font-semibold text-gray-800">
                      <span className="mr-2">Order #{order.id}</span>
                      {order.status && (
                        <span
                          className={`mr-2 inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium ${
                            order.status.toLowerCase() === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : order.status.toLowerCase() === "delivered"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-sm text-gray-700 mt-3 space-y-3">
                    {/* Order Date */}
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faCalendarAlt}
                        className="text-blue-500"
                      />
                      <p>
                        <span className="font-semibold">Date:</span>{" "}
                        {moment(order.createdAt).format(
                          "DD MMMM YYYY - HH:mm:ss",
                        )}
                      </p>
                    </div>

                    {/* Order Total */}
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faDollarSign}
                        className="text-green-500"
                      />
                      <p>
                        <span className="font-semibold">Total:</span> $
                        {order.total}
                      </p>
                    </div>

                    {/* Tax and Shipping Fee */}
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faReceipt}
                        className="text-gray-500"
                      />
                      <p>
                        <span className="font-semibold">Tax:</span> ${order.tax}{" "}
                        <span className="mx-2">|</span>{" "}
                        <span className="font-semibold">Shipping:</span> $
                        {order.shippingFee}
                      </p>
                    </div>

                    {/* Payment Information */}
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faCreditCard}
                        className="text-purple-500"
                      />
                      <div>
                        <span className="font-semibold">Payment:</span>{" "}
                        <div className={`capitalize`}>
                          {order.payment?.method} ({order.payment?.status})
                        </div>
                      </div>
                    </div>

                    {/* Order Products */}
                    <div className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faBoxOpen}
                        className="mt-0.5 text-indigo-500"
                      />
                      <div>
                        <span className="font-semibold">Products:</span>
                        <ul className="list-disc list-inside">
                          {order.orderProduct.map((item, index) => (
                            <li key={index}>
                              <Link
                                href={`/product/${item.product.id}`}
                                className="text-indigo-500 hover:underline"
                              >
                                {item.product.name}
                              </Link>
                              {` `}x {item.quantity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        className="text-green-500"
                      />
                      <div>
                        <p>
                          <span className="font-semibold">
                            Shipping Address:
                          </span>{" "}
                          {order.orderAddress.address2
                            ? `${order.orderAddress.address2} - `
                            : ""}
                          {order.orderAddress.address},{" "}
                          {order.orderAddress.city}, {order.orderAddress.state},{" "}
                          {order.orderAddress.country} -{" "}
                          {order.orderAddress.zipCode}
                        </p>
                        <p>
                          <span className="font-semibold">Name:</span>{" "}
                          {order.orderAddress.name}
                        </p>
                        <p>
                          <span className="font-semibold">Phone:</span>{" "}
                          {order.orderAddress.phone}
                        </p>
                      </div>
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
