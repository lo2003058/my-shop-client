export interface Product {
  id: number;
  name: string;
  description: string;
  price: number; // Ensure price is consistently a number
  stock: number;
  isVirtual: boolean;
  imageUrl?: string;
  isCustomerWishListed?: boolean;
}

export interface RecommendProduct {
  id: number;
  name: string;
  description: string;
  price: number; // Changed to number for consistency
  stock: number;
  isVirtual: boolean;
  imageUrl?: string;
}

export interface GetProduct {
  product: Product;
}

export interface GetProductForClient {
  productForClient: Product;
}

export interface GetProducts {
  products: Product[];
}

export interface GetRecommendProducts {
  recommendProducts: Product[];
}
