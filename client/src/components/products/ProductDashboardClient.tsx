"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import ProductTable from "@/components/products/ProductTable";
import { Product } from "@/types/product";
import { SortType, productService } from "@/services/productService";
import { useInspector } from "@/contexts/InspectorContext";

export default function ProductDashboardClient() {
  const { open, state, registerOnSaved } = useInspector();

  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState<SortType>("CREATED_AT_DESC");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchTermRef = useRef("");
  const currentPageRef = useRef(0);
  const sortTypeRef = useRef<SortType>("CREATED_AT_DESC");

  const selectedProductId = state?.type === "product-edit" ? state.product.id : null;

  const fetchProducts = useCallback(async (search: string, page: number, sort: SortType) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await productService.getProducts(search || undefined, page, 20, sort);
      setProducts(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("상품 목록 조회 실패:", error);
      setError("상품 목록을 불러오지 못했습니다.");
      setProducts([]);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts("", 0, "CREATED_AT_DESC");
  }, [fetchProducts]);

  useEffect(() => {
    registerOnSaved(() => fetchProducts(searchTermRef.current, currentPageRef.current, sortTypeRef.current));
  }, [registerOnSaved, fetchProducts]);

  const handleSearch = useCallback((term: string) => {
    searchTermRef.current = term;
    setSearchTerm(term);
    setCurrentPage(0);
    currentPageRef.current = 0;
    fetchProducts(term, 0, sortType);
  }, [fetchProducts, sortType]);

  const handlePageChange = useCallback((page: number) => {
    currentPageRef.current = page;
    setCurrentPage(page);
    fetchProducts(searchTerm, page, sortType);
  }, [fetchProducts, searchTerm, sortType]);

  const handleSortChange = useCallback((sort: SortType) => {
    sortTypeRef.current = sort;
    setSortType(sort);
    setCurrentPage(0);
    currentPageRef.current = 0;
    fetchProducts(searchTerm, 0, sort);
  }, [fetchProducts, searchTerm]);

  const handleSelectProduct = useCallback((id: number) => {
    const product = products.find((p) => p.id === id);
    if (product) open({ type: "product-edit", product });
  }, [products, open]);

  const handleAddNewProduct = useCallback(() => {
    open({ type: "product-new" });
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
        error={error}
      />
    </div>
  );
}
