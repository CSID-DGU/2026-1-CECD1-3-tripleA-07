"use client";

import { useRouter } from "next/navigation";
import ProductTable from "@/components/products/ProductTable";
import { Product } from "@/types/product";
import { SortType } from "@/services/productService";
import { useInspector } from "@/contexts/InspectorContext";

interface ProductDashboardClientProps {
  initialProducts: Product[];
  initialTotalPages: number;
  currentPage: number;
  searchTerm: string;
  sortType: SortType;
}

export default function ProductDashboardClient({
  initialProducts,
  initialTotalPages,
  currentPage,
  searchTerm,
  sortType,
}: ProductDashboardClientProps) {
  const router = useRouter();
  const { open, state } = useInspector();

  const selectedProductId =
    state?.type === "product" && state.product !== null ? state.product.id : null;

  const handleSearch = (term: string) => {
    const params = new URLSearchParams({ search: term, page: "0", sort: sortType });
    router.push(`/products?${params}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams({ search: searchTerm, page: String(page), sort: sortType });
    router.push(`/products?${params}`);
  };

  const handleSortChange = (sort: SortType) => {
    const params = new URLSearchParams({ search: searchTerm, page: "0", sort });
    router.push(`/products?${params}`);
  };

  const handleSelectProduct = (id: number) => {
    const product = initialProducts.find((p) => p.id === id);
    if (product) open({ type: "product", product });
  };

  const handleAddNewProduct = () => {
    open({ type: "product", product: null });
  };

  return (
    <div className="h-full">
      <ProductTable
        products={initialProducts}
        selectedId={selectedProductId}
        onSelect={handleSelectProduct}
        onAddNew={handleAddNewProduct}
        currentPage={currentPage}
        totalPages={initialTotalPages}
        onPageChange={handlePageChange}
        searchTerm={searchTerm}
        onSearch={handleSearch}
        sortType={sortType}
        onSortChange={handleSortChange}
      />
    </div>
  );
}
