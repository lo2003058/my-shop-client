import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const LoadingComponent: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <FontAwesomeIcon
          icon={faStar}
          spin
          className="mx-auto h-12 w-12 text-indigo-600"
        />
        <p className="mt-4 text-gray-500">Loading page...</p>
      </div>
    </div>
  );
};

export default LoadingComponent;
