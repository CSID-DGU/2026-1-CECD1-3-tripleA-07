import React from "react";
import { AdHistory } from "@/types/history";
import { TableCell } from "@/components/products/ProductTableRow";

const EVENT_TYPE_LABEL: Record<string, string> = {
  NEW: "신규 출시",
  DISCOUNT: "할인",
};

interface HistoryTableRowProps {
  history: AdHistory;
  isSelected: boolean;
  onSelect: (id: number) => void;
}

export function HistoryTableRow({ history, isSelected, onSelect }: HistoryTableRowProps) {
  const date = history.createdAt.slice(0, 10);

  return (
    <tr
      onClick={() => onSelect(history.id)}
      style={{
        backgroundImage: isSelected ? "none" : "linear-gradient(to right, transparent 12px, var(--color-border) 12px, var(--color-border) calc(100% - 12px), transparent calc(100% - 12px))",
        backgroundSize: "100% 1px",
        backgroundPosition: "bottom",
        backgroundRepeat: "no-repeat",
      }}
      className={`cursor-pointer transition-all h-11 ${
        isSelected ? "bg-primary/16" : "hover:bg-info"
      }`}
    >
      <TableCell>{history.id}</TableCell>
      <TableCell>{date}</TableCell>
      <TableCell>{history.adContent}</TableCell>
      <TableCell className="text-center">{EVENT_TYPE_LABEL[history.eventType] ?? history.eventType}</TableCell>
    </tr>
  );
}
