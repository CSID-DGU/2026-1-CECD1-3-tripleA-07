"use client";

import React, { useState } from "react";

import { Product } from "@/types/product";
export { type Product };

interface ProductTableProps {
  products: Product[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddNew: () => void;
}

export default function ProductTable({
  products,
  selectedId,
  onSelect,
  onAddNew,
}: ProductTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((p) =>
    [p.id, p.name, p.category, p.description]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <section className="flex flex-col gap-6 p-8 h-full overflow-hidden">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">상품 목록</h2>
        <button
          onClick={onAddNew}
          className="bg-[#7e62ca] hover:bg-[#6b52b1] text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
        >
          새 상품 추가 +
        </button>
      </div>

      <div className="relative">
        <input
          type="search"
          placeholder="검색어를 입력해주세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
            {filteredProducts.map((product) => (
              <tr
                key={product.id}
                onClick={() => onSelect(product.id)}
                className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedId === product.id ? "bg-[#7e62ca]/10" : ""
                }`}
              >
                <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                  {product.id}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                  {product.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                  {product.listPrice.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                  {product.price.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                  {product.category}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                  {product.quantity.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-xs">
                  {product.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <nav className="flex justify-center gap-2 pt-2">
        {[1, 2, 3, 4, 5, 6].map((page) => (
          <button
            key={page}
            className={`w-8 h-8 flex items-center justify-center rounded-lg border text-sm transition-all ${
              page === 1
                ? "bg-[#7e62ca] border-[#7e62ca] text-white shadow-sm"
                : "bg-white border-gray-200 text-gray-600 hover:border-[#7e62ca]"
            }`}
          >
            {page}
          </button>
        ))}
      </nav>
    </section>
  );
}
