import React from "react";
import { AdHistory } from "@/types/history";
import { TableCell } from "@/components/common/TableCell";
import { Badge } from "@/components/common/Badge";

interface HistoryTableRowProps {
  history: AdHistory;
  isSelected: boolean;
  onSelect: (id: number) => void;
}

export function HistoryTableRow({ history, isSelected, onSelect }: HistoryTableRowProps) {
  const [year, month, day] = history.createdAt.slice(0, 10).split("-");
  const date = `${year.slice(2)}.${month}.${day}`;

  return (
    <tr
      onClick={() => onSelect(history.id)}
      className={`cursor-pointer transition-all h-11 ${
        isSelected ? "bg-primary/16 [&_td]:text-primary" : "hover:bg-info row-divider"
      }`}
    >
      <TableCell>{history.id}</TableCell>
      <TableCell>{date}</TableCell>
      <TableCell>{history.adContent}</TableCell>
      <TableCell className="text-center"><Badge variant={history.eventType} size="sm" /></TableCell>
    </tr>
  );
}
