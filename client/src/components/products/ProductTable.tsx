"use client";

import React, { useState, useRef, useEffect } from "react";
import { Product } from "@/types/product";
import { SortType } from "@/services/productService";
import { Button } from "../common/Button";
import { PageHeader } from "../common/PageHeader";
import { ProductTableRow } from "./ProductTableRow";
import { Search, X } from "lucide-react";
const SORT_OPTIONS: { value: SortType; label: string }[] = [
  { value: "CREATED_AT_DESC", label: "최근 등록 순" },
  { value: "PRICE_ASC",       label: "가격 낮은 순" },
  { value: "PRICE_DESC",      label: "가격 높은 순" },
  { value: "NAME_ASC",        label: "가나다 순" },
  { value: "QUANTITY_DESC",   label: "수량 많은 순" },
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

  /**
   * 페이지네이션 가로폭 흔들림 방지(Layout Shift)를 위해 항상 7개의 요소 유지
   */
  const getPaginationItems = (current: number, total: number) => {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i);
    }

    // 앞부분에 붙어있을 때: [0, 1, 2, 3, 4, ..., total-1]
    if (current < 3) {
      return [0, 1, 2, 3, 4, -1, total - 1];
    }

    // 뒷부분에 붙어있을 때: [0, ..., total-5, total-4, total-3, total-2, total-1]
    if (current > total - 4) {
      return [0, -1, total - 5, total - 4, total - 3, total - 2, total - 1];
    }

    // 중간 영역일 때: [0, ..., current-1, current, current+1, ..., total-1]
    return [0, -1, current - 1, current, current + 1, -1, total - 1];
  };

  return (
    <section className="flex flex-col gap-4 p-6 h-full overflow-hidden">
      <PageHeader
        title="상품 목록"
        actions={[<Button onClick={onAddNew} className="h-10">새 상품 추가 +</Button>]}
      />

      

      {/* ... 정렬 방식 선택 드롭다운 메뉴 ... */}
      <div className="flex items-center gap-3">
        <select
          value={sortType}
          onChange={(e) => onSortChange(e.target.value as SortType)}
          className="h-10 px-4 pr-10 border border-border rounded-xl text-base font-regular text-foreground focus:outline-none focus:ring-2 focus:ring-primary/48 select-chevron"
        >
          {SORT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/48" />
            <input
              type="search"
              placeholder="검색어를 입력해주세요"
              value={localSearchTerm}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              className="w-full h-10 pl-11 pr-9 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/48 transition-all text-foreground placeholder:text-foreground/48 font-regular"
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

      <div className={`flex-1 overflow-auto border border-gray-200 rounded-xl transition-opacity ${isLoading ? "opacity-50 pointer-events-none" : ""}`}>
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-gray-50 z-10 border-b border-gray-200">
            <tr>
              {["상품 ID", "상품 명", "정가", "판매가", "카테고리", "수량", "상품 설명"].map(
                (header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-r border-gray-200 last:border-r-0"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {products.map((product) => (
              <ProductTableRow
                key={product.id}
                product={product}
                isSelected={selectedId === product.id}
                onSelect={onSelect}
              />
            ))}
          </tbody>
        </table>
      </div>

      <nav className="flex justify-center items-center gap-1 pt-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="h-8 px-3 rounded-lg bg-gray-200 text-gray-700 text-sm disabled:opacity-50 hover:bg-gray-300 transition-colors flex items-center justify-center"
        >
          이전
        </button>

        {getPaginationItems(currentPage, totalPages).map((p, i) => {
          if (p === -1) return <span key={`ellipsis-${i}`} className="px-2 text-gray-400">...</span>;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg border text-sm transition-all ${
                p === currentPage
                  ? "bg-[#7e62ca] border-[#7e62ca] text-white shadow-sm"
                  : "bg-white border-gray-200 text-gray-600 hover:border-[#7e62ca]"
              }`}
            >
              {p + 1}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1 || totalPages === 0}
          className="h-8 px-3 rounded-lg bg-gray-200 text-gray-700 text-sm disabled:opacity-50 hover:bg-gray-300 transition-colors flex items-center justify-center"
        >
          다음
        </button>
      </nav>
    </section>
  );
}
