"use client";

import React, { useState } from "react";
import { Product } from "@/types/product";
import { Button } from "../common/Button";
import { ProductTableRow } from "./ProductTableRow";
export { type Product };

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
}: ProductTableProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch(localSearchTerm);
    }
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
    <section className="flex flex-col gap-6 p-8 h-full overflow-hidden">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">상품 목록</h2>
        <Button onClick={onAddNew}>새 상품 추가 +</Button>
      </div>

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

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">정렬 기준</label>
        <select className="h-10 px-4 pr-10 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#7e62ca]/50 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207L10%2012L15%207%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px_20px] bg-[right_0.5rem_center] bg-no-repeat">
          <option>상품 등록 순</option>
        </select>
      </div>

      <div className="flex-1 overflow-auto border border-gray-200 rounded-xl">
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
          disabled={currentPage === totalPages - 1}
          className="h-8 px-3 rounded-lg bg-gray-200 text-gray-700 text-sm disabled:opacity-50 hover:bg-gray-300 transition-colors flex items-center justify-center"
        >
          다음
        </button>
      </nav>
    </section>
  );
}
