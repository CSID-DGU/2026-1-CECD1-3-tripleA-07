"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductTable from "@/components/products/ProductTable";
import { Product } from "@/types/product";
import { SortType, productService } from "@/services/productService";
import { useInspector } from "@/contexts/InspectorContext";

const VALID_SORT_TYPES: SortType[] = ["CREATED_AT_DESC", "PRICE_ASC", "PRICE_DESC", "NAME_ASC", "QUANTITY_DESC"];

export default function ProductDashboardClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { open, state, registerOnSaved } = useInspector();

  const initialPage = Math.max(0, Math.floor(Number(searchParams.get("page")) || 0));
  const initialSearch = searchParams.get("search") || "";
  const initialSort: SortType = VALID_SORT_TYPES.includes(searchParams.get("sort") as SortType)
    ? (searchParams.get("sort") as SortType)
    : "CREATED_AT_DESC";

  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortType, setSortType] = useState<SortType>(initialSort);
  const [isLoading, setIsLoading] = useState(true);

  const searchTermRef = useRef(initialSearch);
  const currentPageRef = useRef(initialPage);
  const sortTypeRef = useRef(initialSort);

  const selectedProductId = state?.type === "product-edit" ? state.product.id : null;

  const fetchProducts = useCallback(async (search: string, page: number, sort: SortType) => {
    setIsLoading(true);
    try {
      const data = await productService.getProducts(search || undefined, page, 20, sort);
      setProducts(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("상품 목록 조회 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(initialSearch, initialPage, initialSort);
  // 마운트 시 1회만 실행 — 초기값은 URL에서 읽어 state에 반영됨
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    registerOnSaved(() => fetchProducts(searchTermRef.current, currentPageRef.current, sortTypeRef.current));
  }, [registerOnSaved, fetchProducts]);

  const updateUrl = useCallback((search: string, page: number, sort: SortType) => {
    const params = new URLSearchParams({ search, page: String(page), sort });
    router.replace(`?${params}`);
  }, [router]);

  const handleSearch = useCallback((term: string) => {
    searchTermRef.current = term;
    setSearchTerm(term);
    setCurrentPage(0);
    currentPageRef.current = 0;
    updateUrl(term, 0, sortType);
    fetchProducts(term, 0, sortType);
  }, [fetchProducts, sortType, updateUrl]);

  const handlePageChange = useCallback((page: number) => {
    currentPageRef.current = page;
    setCurrentPage(page);
    updateUrl(searchTerm, page, sortType);
    fetchProducts(searchTerm, page, sortType);
  }, [fetchProducts, searchTerm, sortType, updateUrl]);

  const handleSortChange = useCallback((sort: SortType) => {
    sortTypeRef.current = sort;
    setSortType(sort);
    setCurrentPage(0);
    currentPageRef.current = 0;
    updateUrl(searchTerm, 0, sort);
    fetchProducts(searchTerm, 0, sort);
  }, [fetchProducts, searchTerm, updateUrl]);

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
      />
    </div>
  );
}
