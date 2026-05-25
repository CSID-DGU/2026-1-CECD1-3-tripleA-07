import React from "react";
import { Product } from "@/types/product";

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

export function TableCell({ children, className = "" }: TableCellProps) {
  return (
    <td className={`px-4 py-3 text-sm font-regular text-foreground truncate first:rounded-l-xl last:rounded-r-xl ${className}`}>
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
      style={{
        backgroundImage: isSelected ? "none" : "linear-gradient(to right, transparent 12px, var(--color-border) 12px, var(--color-border) calc(100% - 12px), transparent calc(100% - 12px))",
        backgroundSize: "100% 1px",
        backgroundPosition: "bottom",
        backgroundRepeat: "no-repeat",
      }}
      className={`cursor-pointer transition-all h-11 ${
        isSelected
          ? "bg-primary/16"
          : "hover:bg-info"
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
