"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS_PAGINATED } from "@/graphql/products/queries";
import { useAppDispatch, RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { addItem } from "@/redux/cartSlice";
import Swal from "sweetalert2";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import ProductTitle from "@/components/product/productTitle";
import RecommendProduct from "@/components/main/recommendProduct";
import PaginationButtons from "@/components/common/paginationButtons";
import type { Product } from "@/types/product/types";

interface ProductsV2Data {
  productsV2: {
    items: Product[];
    totalCount: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
  };
}

const MAX_QUANTITY = 10;

const ProductPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  // State
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 4;

  // Apollo: useQuery
  const { data, loading, error, refetch } = useQuery<ProductsV2Data>(
    GET_PRODUCTS_PAGINATED,
    {
      variables: {
        page,
        pageSize,
        filter: { searchTerm },
      },
    },
  );

  // On data update
  useEffect(() => {
    if (data?.productsV2) {
      setProducts(data.productsV2.items);
      setTotalPages(data.productsV2.totalPages);
    }
  }, [data]);

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to page 1 on new search
  };

  const handleAddToCart = (product: Product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (existingItem && existingItem.quantity >= MAX_QUANTITY) {
      Swal.fire({
        icon: "error",
        title: "Limit Reached",
        text: `You can only add up to ${MAX_QUANTITY} of this item.`,
        timer: 1500,
        position: "center",
      });
      return;
    }
    dispatch(addItem({ ...product, quantity: 1 }));
  };

  const goToNextPage = useCallback(() => {
    if (page >= totalPages) return;

    const newPage = page + 1;
    refetch({
      page: newPage,
      pageSize,
      filter: { searchTerm },
    })
      .then((res) => {
        if (res.data?.productsV2) {
          setProducts(res.data.productsV2.items);
          setTotalPages(res.data.productsV2.totalPages);
          setPage(newPage);
        }
      })
      .catch((err) => console.error("Error fetching next page:", err));
  }, [page, totalPages, pageSize, searchTerm, refetch]);

  const goToPreviousPage = useCallback(() => {
    if (page <= 1) return;

    const newPage = page - 1;
    refetch({
      page: newPage,
      pageSize,
      filter: { searchTerm },
    })
      .then((res) => {
        if (res.data?.productsV2) {
          setProducts(res.data.productsV2.items);
          setTotalPages(res.data.productsV2.totalPages);
          setPage(newPage);
        }
      })
      .catch((err) => console.error("Error fetching previous page:", err));
  }, [page, pageSize, searchTerm, refetch]);

  // Loading & Error
  if (loading && !products.length) {
    return <p>Loading...</p>;
  }
  if (error) {
    console.error(error);
    return <p className="text-red-500">Error loading products.</p>;
  }

  // Render
  const noProductsFound = !loading && !products.length;

  return (
    <div className="bg-white min-h-screen">
      <ProductTitle />

      {/* Search bar */}
      <div className="max-w-7xl mx-auto px-4 mt-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <input
          type="text"
          placeholder="Search products by name..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="border border-gray-300 rounded px-4 py-2 w-full sm:w-1/3"
        />
        {loading && products.length > 0 && <span>Loading...</span>}
      </div>

      {/* Product list */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-12">
        {noProductsFound ? (
          <p>No products found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => {
              const cartItem = cartItems.find((p) => p.id === product.id);
              const currentQuantity = cartItem?.quantity || 0;
              const isMaxReached = currentQuantity >= MAX_QUANTITY;

              return (
                <div
                  key={product.id}
                  className="group relative border rounded-lg p-4"
                >
                  <Link href={`/product/${product.id}`}>
                    <Image
                      alt={product.name}
                      src={
                        product.imageUrl || "https://via.placeholder.com/450"
                      }
                      width={300}
                      height={300}
                      priority
                      className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75"
                    />
                  </Link>
                  <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                  <p className="mt-1 text-lg font-medium text-gray-900">
                    ${product.price.toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={isMaxReached}
                    className={`mt-2 flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-300 ${
                      isMaxReached
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    <ShoppingCartIcon className="h-5 w-5 mr-2" />
                    {isMaxReached ? "Max Reached" : "Add to Cart"}
                  </button>
                  {currentQuantity > 0 && (
                    <p className="mt-1 text-sm text-gray-500">
                      In Cart: {currentQuantity}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        <PaginationButtons
          currentPage={page}
          totalPages={totalPages}
          onPrevPage={goToPreviousPage}
          onNextPage={goToNextPage}
        />
      </div>

      <RecommendProduct />
    </div>
  );
};

export default ProductPage;
