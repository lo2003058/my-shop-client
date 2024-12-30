import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface AddressComponentProps {
  customerAddress?: {
    id: number;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    isDefault: boolean;
  }[];
}

const AddressComponent: React.FC<AddressComponentProps> = ({
  customerAddress,
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
  }, [session, status, router]);

  return (
    <div className={`h-screen`}>
      <div>
        <h2 className="text-2xl font-bold text-black">Address</h2>
      </div>
      <div className={`text-black`}>
        {customerAddress && customerAddress.length > 0 ? (
          <>
            {customerAddress.map((address) => (
              <div key={address.id} className="border p-4 my-4">
                <p className="text-lg font-semibold">{address.address}</p>
                <p>
                  {address.city}, {address.state}, {address.zip}
                </p>
                <p>{address.country}</p>
                <p>{address.isDefault ? "Default Address" : ""}</p>
              </div>
            ))}
          </>
        ) : (
          <p>No address found.</p>
        )}
      </div>
    </div>
  );
};

export default AddressComponent;
