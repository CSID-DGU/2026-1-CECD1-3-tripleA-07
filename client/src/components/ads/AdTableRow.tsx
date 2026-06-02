import React from "react";
import { Ad } from "@/types/ad";
import { TableCell } from "@/components/common/TableCell";
import { Badge } from "@/components/common/Badge";

interface AdTableRowProps {
  ad: Ad;
  isSelected: boolean;
  onSelect: (id: number) => void;
}

export function AdTableRow({ ad, isSelected, onSelect }: AdTableRowProps) {
  const [year, month, day] = ad.createdAt.slice(0, 10).split("-");
  const date = `${year.slice(2)}.${month}.${day}`;

  return (
    <tr
      onClick={() => onSelect(ad.id)}
      className={`cursor-pointer transition-all h-11 ${
        isSelected ? "bg-primary/16 [&_td]:text-primary" : "hover:bg-info row-divider"
      }`}
    >
      <TableCell>{ad.id}</TableCell>
      <TableCell>{date}</TableCell>
      <TableCell>{ad.adContent}</TableCell>
      <TableCell className="text-center"><Badge variant={ad.eventType} size="sm" /></TableCell>
    </tr>
  );
}
