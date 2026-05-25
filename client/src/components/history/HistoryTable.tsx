"use client";

import React from "react";
import { AdHistory } from "@/types/history";
import { PageHeader } from "../common/PageHeader";
import { HistoryTableRow } from "./HistoryTableRow";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HistoryTableProps {
  histories: AdHistory[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export default function HistoryTable({
  histories,
  selectedId,
  onSelect,
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: HistoryTableProps) {
  const getPaginationItems = (current: number, total: number) => {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i);
    }
    if (current < 3) {
      return [0, 1, 2, 3, 4, -1, total - 1];
    }
    if (current > total - 4) {
      return [0, -1, total - 5, total - 4, total - 3, total - 2, total - 1];
    }
    return [0, -1, current - 1, current, current + 1, -1, total - 1];
  };

  return (
    <section className="flex flex-col gap-4 p-6 h-full overflow-hidden">
      <PageHeader title="SNS 광고 발행 이력" actions={[]} />

      <div className={`flex-1 overflow-auto transition-opacity ${isLoading ? "opacity-50 pointer-events-none" : ""}`}>
        <table className="w-full text-left table-fixed border-separate [border-spacing:0]">
          <colgroup>
            <col style={{ width: 80 }} />
            <col style={{ width: 100 }} />
            <col />
            <col style={{ width: 100 }} />
          </colgroup>
          <thead className="sticky top-0 z-10 relative before:absolute before:inset-0 before:bg-surface before:-z-10 before:rounded-b-xl">
            <tr className="rounded-xl">
              {(["광고 ID", "생성일", "광고 내용", "광고 유형"] as const).map((label) => (
                <th
                  key={label}
                  className={`px-4 h-10 text-sm font-light text-foreground uppercase tracking-wider bg-info first:rounded-l-xl last:rounded-r-xl ${label === "광고 유형" ? "text-center" : ""}`}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {histories.map((history) => (
              <HistoryTableRow
                key={history.id}
                history={history}
                isSelected={selectedId === history.id}
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
          className="h-9 w-9 rounded-lg text-foreground/64 disabled:opacity-20 hover:bg-info transition-colors flex items-center justify-center"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex justify-center p-1 border border-border gap-1 rounded-lg">
          {getPaginationItems(currentPage, totalPages).map((p, i) => {
            if (p === -1) return <span key={`ellipsis-${i}`} className="px-2 text-gray-400">...</span>;
            return (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`w-7 h-7 flex items-center justify-center rounded-md text-sm font-regular transition-all ${
                  p === currentPage
                    ? "bg-primary text-surface"
                    : "text-foreground hover:bg-info"
                }`}
              >
                {p + 1}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1 || totalPages === 0}
          className="h-9 w-9 rounded-lg text-foreground/64 disabled:opacity-20 hover:bg-info transition-colors flex items-center justify-center"
        >
          <ChevronRight size={20} />
        </button>
      </nav>
    </section>
  );
}
