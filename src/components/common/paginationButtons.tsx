import React from "react";

interface PaginationButtonsProps {
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPrevPage: () => void;
}

const PaginationButtons: React.FC<PaginationButtonsProps> = ({
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-8">
      <button
        disabled={currentPage <= 1}
        onClick={onPrevPage}
        className={`px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 ${
          currentPage <= 1 ? "invisible" : ""
        }`}
      >
        Previous
      </button>

      <div className="text-center flex-grow text-black">
        Page {currentPage} of {totalPages}
      </div>

      <button
        disabled={currentPage >= totalPages}
        onClick={onNextPage}
        className={`px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 ${
          currentPage >= totalPages ? "invisible" : ""
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default PaginationButtons;
