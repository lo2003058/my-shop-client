import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@apollo/client";
import { GetProducts, Product } from "@/types/product/types";
import { GET_PRODUCTS } from "@/graphql/products/queries";

const RecommendProduct: React.FC = () => {
  const { loading, error, data } = useQuery<GetProducts>(GET_PRODUCTS, {
    variables: { limit: 4 }, // Fetch 4 products
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data || data.products.length === 0) return <p>No products found.</p>;

  // Ensure you have exactly 4 products. If not, handle accordingly.
  const recommendProducts: Product[] = data.products.slice(0, 4);

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      {/* Related Products */}
      {recommendProducts.length > 0 && (
        <section aria-labelledby="related-heading" className="mt-24">
          <h2
            id="related-heading"
            className="text-lg font-medium text-gray-900"
          >
            You may also like&hellip;
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {recommendProducts.map((recommendProduct) => (
              <div key={recommendProduct.id} className="group relative">
                <Image
                  alt={recommendProduct.name}
                  src={
                    recommendProduct.imageUrl ||
                    "https://via.placeholder.com/150"
                  }
                  width={300}
                  height={300}
                  priority
                  className="aspect-square w-full rounded-md object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                />
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <Link href={`/product/${recommendProduct.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {recommendProduct.name}
                      </Link>
                    </h3>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {recommendProduct.stock
                      ? `$${recommendProduct.price}`
                      : "Out of stock"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default RecommendProduct;
