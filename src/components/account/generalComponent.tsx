import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGem, faStar } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import PasswordBox from "@/components/account/form/passwordBox";
import LoadingComponent from "@/components/common/loadingComponent";
import Tooltip from '@/components/common/tooltip';

interface GeneralComponentProps {
  customer?: {
    id: number;
    firstName: string;
    lastName: string;
    countryCode: string;
    phone: string;
    tier: {
      id: number;
      name: string;
    };
    customerPoints: {
      currentPoints: number;
    };
  };
}

const GeneralComponent: React.FC<GeneralComponentProps> = ({ customer }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
  }, [session, status, router]);

  if (!customer) {
    return <LoadingComponent />;
  }

  return (
    <>
      {/* for debugging purposes */}
      {/*<p className={`text-black break-all`}>{JSON.stringify(data?.customer)}</p>*/}

      {/* User Information */}
      <div className="bg-white shadow border rounded-lg p-6 my-2">
        <div className="flex flex-col items-center">
          {/* User Avatar */}
          <Tooltip text={`Don't touch me`} position={"top"}>
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
              priority
            />
          </Tooltip>
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
            {customer?.countryCode && customer?.phone && (
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="text-lg font-medium text-gray-800">
                    {customer.countryCode} {customer.phone}
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
