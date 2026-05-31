import React from "react";
import { Product } from "@/types/product";
import { TableCell } from "@/components/common/TableCell";

interface ProductTableRowProps {
  product: Product;
  isSelected: boolean;
  onSelect: (id: number) => void;
}

export function ProductTableRow({ product, isSelected, onSelect }: ProductTableRowProps) {
  return (
    <tr
      onClick={() => onSelect(product.id)}
      className={`cursor-pointer transition-all h-11 ${
        isSelected ? "bg-primary/16 [&_td]:text-primary [&_td]:font-medium" : "hover:bg-info row-divider"
      }`}
    >
      <TableCell>{product.id}</TableCell>
      <TableCell>{product.name}</TableCell>
      <TableCell>{product.category}</TableCell>
      <TableCell className="text-right">{product.listPrice.toLocaleString()}</TableCell>
      <TableCell className="text-right">{product.price.toLocaleString()}</TableCell>
      <TableCell className="text-right">{product.quantity.toLocaleString()}</TableCell>
    </tr>
  );
}
