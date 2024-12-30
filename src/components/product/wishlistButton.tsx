"use client";

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

export default function WishlistButton() {

  const [isFavorited, setIsFavorited] = useState<boolean>(false);

  // Handle Favorite Toggle
  const handleFavoriteToggle = () => {
    setIsFavorited(!isFavorited);
    // Implement your favorite logic here
  };

  return (
    <>
      <button
        onClick={handleFavoriteToggle}
        className={`p-3 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          isFavorited ? "bg-red-100 border-red-500" : ""
        }`}
        aria-label="Add to favorites"
      >
        <FontAwesomeIcon
          icon={faHeart}
          className={`h-6 w-6 ${
            isFavorited
              ? "text-red-500"
              : "text-gray-400 hover:text-red-500"
          }`}
        />
      </button>
    </>
  );
}
