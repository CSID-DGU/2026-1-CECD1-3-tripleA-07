﻿"use client";

import React, { useState, useRef } from "react";
import { Search, X } from "lucide-react";
import { Ad } from "@/types/ad";
import { PageHeader } from "../common/PageHeader";
import Pagination from "../common/Pagination";
import { AdTableRow } from "./AdTableRow";
import { LABELS } from "@/constants/labels";

const COLUMNS: { label: string; width?: number; center?: boolean }[] = [
  { label: "광고 ID",  width: 80 },
  { label: "발행일",   width: 100 },
  { label: "광고 내용" },
  { label: "광고 유형", width: 100, center: true },
];

interface AdTableProps {
  ads: Ad[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onProductIdSearch: (productId: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function AdTable({
  ads,
  selectedId,
  onSelect,
  currentPage,
  totalPages,
  onPageChange,
  onProductIdSearch,
  isLoading = false,
  error = null,
}: AdTableProps) {
  const [localProductId, setLocalProductId] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalProductId(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onProductIdSearch(value);
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      onProductIdSearch(localProductId);
    }
  };

  const handleClear = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setLocalProductId("");
    onProductIdSearch("");
  };

  return (
    <section className="flex flex-col gap-4 p-6 h-full overflow-hidden">
      <PageHeader title={LABELS.ads.nav} actions={[]} />

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/48" />
        <input
          type="text"
          placeholder="상품 ID로 검색"
          value={localProductId}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="w-full h-10 pl-11 pr-9 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/48 transition-all text-foreground placeholder:text-foreground/48 font-normal"
        />
        {localProductId && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/48 hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className={`flex-1 overflow-auto transition-opacity ${isLoading ? "opacity-50 pointer-events-none" : ""}`}>
        <table className="w-full text-left table-fixed border-separate [border-spacing:0] min-w-[380px]">
          <colgroup>
            {COLUMNS.map(({ label, width }) => (
              <col key={label} style={width ? { width } : undefined} />
            ))}
          </colgroup>
          <thead className="sticky top-0 z-10 relative before:absolute before:inset-0 before:bg-surface before:-z-10 before:rounded-b-xl">
            <tr className="rounded-xl">
              {COLUMNS.map(({ label, center }) => (
                <th
                  key={label}
                  className={`px-4 h-10 text-sm font-light text-foreground uppercase tracking-wider bg-info first:rounded-l-xl last:rounded-r-xl ${center ? "text-center" : ""}`}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ads.length === 0 && !isLoading ? (
              <tr>
                <td colSpan={COLUMNS.length} className={`py-20 text-center text-sm font-medium ${error ? "text-warn" : "text-foreground/48"}`}>
                  {error ?? "광고 이력이 없습니다"}
                </td>
              </tr>
            ) : (
              ads.map((ad) => (
                <AdTableRow
                  key={ad.id}
                  ad={ad}
                  isSelected={selectedId === ad.id}
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
