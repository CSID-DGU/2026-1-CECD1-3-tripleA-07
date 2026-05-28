﻿"use client";

import React from "react";
import { AdHistory } from "@/types/history";
import { PageHeader } from "../common/PageHeader";
import { HistoryTableRow } from "./HistoryTableRow";
interface HistoryTableProps {
  histories: AdHistory[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  isLoading?: boolean;
}

export default function HistoryTable({
  histories,
  selectedId,
  onSelect,
  isLoading = false,
}: HistoryTableProps) {

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
    </section>
  );
}
