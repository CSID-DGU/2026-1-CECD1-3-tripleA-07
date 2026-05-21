import React from "react";
import { Product } from "@/types/product";

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

export function TableCell({ children, className = "" }: TableCellProps) {
  return (
    <td className={`px-4 py-3 text-sm text-gray-900 border-r border-gray-200 last:border-r-0 ${className}`}>
      {children}
    </td>
  );
}

interface ProductTableRowProps {
  product: Product;
  isSelected: boolean;
  onSelect: (id: number) => void;
}

export function ProductTableRow({ product, isSelected, onSelect }: ProductTableRowProps) {
  return (
    <tr
      onClick={() => onSelect(product.id)}
      className={`cursor-pointer hover:bg-gray-50 transition-colors ${
        isSelected ? "bg-[#7e62ca]/10" : ""
      }`}
    >
      <TableCell>{product.id}</TableCell>
      <TableCell>{product.name}</TableCell>
      <TableCell>{product.listPrice.toLocaleString()}</TableCell>
      <TableCell>{product.price.toLocaleString()}</TableCell>
      <TableCell>{product.category}</TableCell>
      <TableCell>{product.quantity.toLocaleString()}</TableCell>
      <TableCell className="text-gray-600 truncate max-w-xs">{product.description}</TableCell>
    </tr>
  );
}
