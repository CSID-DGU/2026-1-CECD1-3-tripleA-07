"use client";

import { useState, useCallback } from "react";
import ProductTable from "@/components/products/ProductTable";
import { Product } from "@/types/product";
import { SortType, productService } from "@/services/productService";
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
  currentPage: initialPage,
  searchTerm: initialSearch,
  sortType: initialSort,
}: ProductDashboardClientProps) {
  const { open, state } = useInspector();

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortType, setSortType] = useState<SortType>(initialSort);
  const [isLoading, setIsLoading] = useState(false);

  const selectedProductId =
    state?.type === "product" && state.product !== null ? state.product.id : null;

  const fetchProducts = useCallback(async (search: string, page: number, sort: SortType) => {
    setIsLoading(true);
    try {
      const data = await productService.getProducts(search || undefined, page, 20, sort);
      setProducts(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('상품 목록 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(0);
    fetchProducts(term, 0, sortType);
  }, [fetchProducts, sortType]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    fetchProducts(searchTerm, page, sortType);
  }, [fetchProducts, searchTerm, sortType]);

  const handleSortChange = useCallback((sort: SortType) => {
    setSortType(sort);
    setCurrentPage(0);
    fetchProducts(searchTerm, 0, sort);
  }, [fetchProducts, searchTerm]);

  const handleSelectProduct = useCallback((id: number) => {
    const product = products.find((p) => p.id === id);
    if (product) open({ type: "product", product });
  }, [products, open]);

  const handleAddNewProduct = useCallback(() => {
    open({ type: "product", product: null });
  }, [open]);

  return (
    <div className="h-full">
      <ProductTable
        products={products}
        selectedId={selectedProductId}
        onSelect={handleSelectProduct}
        onAddNew={handleAddNewProduct}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        searchTerm={searchTerm}
        onSearch={handleSearch}
        sortType={sortType}
        onSortChange={handleSortChange}
        isLoading={isLoading}
      />
    </div>
  );
}
