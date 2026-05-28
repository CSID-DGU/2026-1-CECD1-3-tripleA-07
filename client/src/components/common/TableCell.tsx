import React from "react";

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
