"use client";

import React, { useState, useRef, useEffect } from "react";
import { Product } from "@/types/product";
import { SortType } from "@/services/productService";
import { Button } from "../common/Button";
import { PageHeader } from "../common/PageHeader";
import Pagination from "../common/Pagination";
import { Select } from "../common/Select";
import { ProductTableRow } from "./ProductTableRow";
import { Search, X } from "lucide-react";
import { LABELS } from "@/constants/labels";
const SORT_OPTIONS: { value: SortType; label: string }[] = [
  { value: "CREATED_AT_DESC", label: "최근 등록 순" },
  { value: "PRICE_ASC",       label: "가격 낮은 순" },
  { value: "PRICE_DESC",      label: "가격 높은 순" },
  { value: "NAME_ASC",        label: "가나다 순" },
  { value: "QUANTITY_DESC",   label: "수량 많은 순" },
];

const COLUMNS: { label: string; width?: number; right?: boolean }[] = [
  { label: "상품 ID", width: 80 },
  { label: "상품 명" },
  { label: "카테고리", width: 100 },
  { label: "정가",    width: 100, right: true },
  { label: "판매가",  width: 100, right: true },
  { label: "수량",    width: 100, right: true },
];

interface ProductTableProps {
  products: Product[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onAddNew: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  searchTerm: string;
  onSearch: (term: string) => void;
  sortType: SortType;
  onSortChange: (sort: SortType) => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function ProductTable({
  products,
  selectedId,
  onSelect,
  onAddNew,
  currentPage,
  totalPages,
  onPageChange,
  searchTerm,
  onSearch,
  sortType,
  onSortChange,
  isLoading = false,
  error = null,
}: ProductTableProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [isComposing, setIsComposing] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const scheduleSearch = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onSearch(value), 300);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    if (!isComposing) scheduleSearch(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      onSearch(localSearchTerm);
    }
  };

  const handleCompositionStart = () => setIsComposing(true);

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    setIsComposing(false);
    scheduleSearch(e.currentTarget.value);
  };

  return (
    <section className="flex flex-col gap-4 p-6 h-full overflow-hidden">
      <PageHeader
        title={LABELS.products.nav}
        actions={[<Button onClick={onAddNew}>상품 추가 +</Button>]}
      />

      

      {/* ... 정렬 방식 선택 드롭다운 메뉴 ... */}
      <div className="flex items-center gap-2">
        <Select
          value={sortType}
          options={SORT_OPTIONS}
          onChange={onSortChange}
        />

        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/48" />
            <input
              type="search"
              placeholder="검색어를 입력해 주세요"
              value={localSearchTerm}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              className="w-full h-10 pl-11 pr-9 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/48 transition-all text-foreground placeholder:text-foreground/48 font-normal"
            />
            {localSearchTerm && (
              <button
                type="button"
                onClick={() => {
                  if (debounceRef.current) clearTimeout(debounceRef.current);
                  setLocalSearchTerm("");
                  onSearch("");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/48 hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5 text-foreground/48" />
              </button>
            )}
        </div>
      </div>

      <div className={`flex-1 overflow-auto transition-opacity ${isLoading ? "opacity-50 pointer-events-none" : ""}`}>
        <table className="w-full text-left table-fixed border-separate [border-spacing:0] min-w-[580px]">
          <colgroup>
            {COLUMNS.map(({ label, width }) => (
              <col key={label} style={width ? { width } : undefined} />
            ))}
          </colgroup>
          <thead className="sticky top-0 z-10 relative before:absolute before:inset-0 before:bg-surface before:-z-10 before:rounded-b-xl">
            <tr className="rounded-xl">
              {COLUMNS.map(({ label, right }) => (
                <th
                  key={label}
                  className={`px-4 h-10 text-sm font-light text-foreground uppercase tracking-wider bg-info first:rounded-l-xl last:rounded-r-xl ${right ? "text-right" : ""}`}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && !isLoading ? (
              <tr>
                <td colSpan={COLUMNS.length} className={`py-20 text-center text-sm font-medium ${error ? "text-warn" : "text-foreground/48"}`}>
                  {error ?? "상품이 없습니다"}
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <ProductTableRow
                  key={product.id}
                  product={product}
                  isSelected={selectedId === product.id}
                  onSelect={onSelect}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </section>
  );
}
