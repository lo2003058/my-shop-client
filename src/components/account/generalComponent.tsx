import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGem, faStar } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import LoadingComponent from "@/components/common/loadingComponent";
import PasswordBox from "@/components/account/form/passwordBox";
import { useQuery } from "@apollo/client";
import { GET_CUSTOMER } from "@/graphql/account/queries";
import { GetCustomer } from "@/types/customer/types";

const GeneralComponent: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // State for user ID
  const [customerId, setCustomerId] = useState<number | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    if (session.user) {
      setCustomerId(session.user.id);
    }
  }, [session, status, router]);

  const { loading, error, data, refetch } = useQuery<GetCustomer>(
    GET_CUSTOMER,
    {
      variables: { id: customerId },
      skip: !customerId, // Skip the query if customerId is not set
    },
  );

  if (status === "loading" || loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return (
      <div className="text-center mt-20">
        <p className="text-red-500">Error: {error.message}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => refetch()}
        >
          Retry
        </button>
      </div>
    );
  }

  const customer = data?.customer;

  return (
    <>
      {/* for debugging purposes */}
      {/*<p className={`text-black break-all`}>{JSON.stringify(data?.customer)}</p>*/}

      {/* User Information */}
      <div className="bg-white shadow border rounded-lg p-6 my-2">
        <div className="flex flex-col items-center">
          {/* User Avatar */}
          <Image
            src={session?.user.image || "/images/default-avatar.png"} // Ensure this domain is configured in next.config.js
            alt={
              session?.user.email
                ? `${session.user.email}'s avatar`
                : "Default user avatar"
            }
            width={128}
            height={128}
            className="h-24 w-24 rounded-full object-cover border-2 border-gray-800 bg-gray-100"
          />
          <h1 className="mt-4 text-2xl font-semibold text-gray-800">
            {!customer?.firstName || !customer?.lastName
              ? `Welcome!`
              : `Welcome, ${customer.firstName}!`}
          </h1>
          <p className="text-gray-600">{session?.user.email}</p>
        </div>
      </div>

      {/* User Stats */}
      <div className="bg-white shadow border rounded-lg p-6 my-2">
        <div className="flex justify-around">
          {/* Points */}
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faStar}
              className="text-yellow-500 h-6 w-6 mr-2"
            />
            <div>
              <p className="text-sm text-gray-500">Points</p>
              <p className="text-lg font-semibold text-gray-700">
                {customer?.customerPoints.currentPoints}
              </p>
            </div>
          </div>

          {/* Tier */}
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faGem}
              className="text-purple-500 h-6 w-6 mr-2"
            />
            <div>
              <p className="text-sm text-gray-500">Tier</p>
              <p className="text-lg font-semibold text-gray-700">
                {customer?.tier.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Sections */}
      <div className="space-y-8 my-2">
        {/* General Information */}
        <div className="bg-white shadow border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">General</h2>
          <div className="space-y-4">
            {/* Show full name */}
            {customer?.firstName && customer?.lastName && (
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="text-lg font-medium text-gray-800">
                    {customer.firstName} {customer.lastName}
                  </p>
                </div>
              </div>
            )}
            {/* Show email address */}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="text-lg font-medium text-gray-800">
                  {session?.user.email}
                </p>
              </div>
            </div>
            {/* Show phone number */}
            {customer?.country_code && customer?.phone && (
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="text-lg font-medium text-gray-800">
                    {customer.country_code} {customer.phone}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Password Box */}
      {customer ? <PasswordBox customerId={customer.id} /> : null}
    </>
  );
};

export default GeneralComponent;
