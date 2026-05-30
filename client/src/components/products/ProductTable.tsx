"use client";

import React, { useState } from "react";
import { Product } from "@/types/product";
import { SortType } from "@/services/productService";
import { Button } from "../common/Button";
import { PageHeader } from "../common/PageHeader";
import Pagination from "../common/Pagination";
import { ProductTableRow } from "./ProductTableRow";
export { type Product };

const SORT_OPTIONS: { value: SortType; label: string }[] = [
  { value: "CREATED_AT_DESC", label: "최근 등록 순" },
  { value: "PRICE_ASC",       label: "가격 낮은 순" },
  { value: "PRICE_DESC",      label: "가격 높은 순" },
  { value: "NAME_ASC",        label: "가나다 순" },
  { value: "QUANTITY_DESC",   label: "수량 많은 순" },
];

const COLUMNS = ["상품 ID", "상품 명", "정가", "판매가", "카테고리", "수량", "상품 설명"];

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
}: ProductTableProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch(localSearchTerm);
    }
  };

  return (
    <section className="flex flex-col gap-6 p-8 h-full overflow-hidden">
      <PageHeader
        title="상품 목록"
        actions={[<Button onClick={onAddNew}>새 상품 추가 +</Button>]}
      />

      {/* ... search bar code ... */}
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <input
            type="search"
            placeholder="검색어를 입력해주세요"
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            onKeyDown={handleKeyPress}
            className="w-full h-12 pl-11 pr-4 bg-gray-100 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#7e62ca]/50 transition-all text-gray-900"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <Button onClick={() => onSearch(localSearchTerm)} className="h-12 px-6 bg-gray-900 hover:bg-gray-800">
          검색
        </Button>
      </div>

      {/* ... 정렬 방식 선택 드롭다운 메뉴 ... */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">정렬 기준</label>
        <select
          value={sortType}
          onChange={(e) => onSortChange(e.target.value as SortType)}
          className="h-10 px-4 pr-10 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7e62ca]/50 select-chevron"
        >
          {SORT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-auto border border-gray-200 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-gray-50 z-10 border-b border-gray-200">
            <tr>
              {COLUMNS.map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-r border-gray-200 last:border-r-0"
                >
                  {header}
                </th>
              ))}
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </section>
  );
}
