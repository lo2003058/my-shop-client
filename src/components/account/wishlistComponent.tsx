import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGem, faStar } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import LoadingComponent from "@/components/common/loadingComponent";

const GeneralComponent: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // State for user points and tier (assuming these are available in session)
  const [points, setPoints] = useState<number>(0);
  const [tier, setTier] = useState<string>("");

  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!session) router.push("/auth/signin"); // Redirect if not authenticated

    // Assuming session.user has points and tier
    if (session?.user) {
      setPoints(session.user.points || 0);
      setTier(session.user.tier || "Standard");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <LoadingComponent />;
  }

  return (
    <>
      {/* User Information */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="flex flex-col items-center">
          {/* User Avatar */}
          <Image
            src={session?.user.image || "/images/default-avatar.png"} // Replace with a default avatar image path
            alt="User Avatar"
            width={128}
            height={128}
            className="h-24 w-24 rounded-full object-cover"
          />
          <h1 className="mt-4 text-2xl font-semibold text-gray-800">
            Welcome, {session?.user.firstName}!
          </h1>
          <p className="text-gray-600">{session?.user.email}</p>
        </div>
      </div>

      {/* User Stats */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="flex justify-around">
          {/* Points */}
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faStar}
              className="text-yellow-500 h-6 w-6 mr-2"
            />
            <div>
              <p className="text-sm text-gray-500">Points</p>
              <p className="text-lg font-semibold text-gray-700">{points}</p>
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
              <p className="text-lg font-semibold text-gray-700">{tier}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Sections */}
      <div className="space-y-8">
        {/* General Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">General</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="text-lg font-medium text-gray-800">
                  {session?.user.firstName} {session?.user.lastName}
                </p>
              </div>
              <button className="flex items-center text-indigo-600 hover:text-indigo-500">
                <FontAwesomeIcon icon={faStar} className="mr-2" />
                Update
              </button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="text-lg font-medium text-gray-800">
                  {session?.user.email}
                </p>
              </div>
              <button className="flex items-center text-indigo-600 hover:text-indigo-500">
                <FontAwesomeIcon icon={faStar} className="mr-2" />
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GeneralComponent;
