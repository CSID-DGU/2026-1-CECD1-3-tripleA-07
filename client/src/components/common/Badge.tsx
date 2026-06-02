import React from "react";

const VARIANT_STYLES: Record<string, string> = {
  NEW:      "bg-new/16 text-new",
  DISCOUNT: "bg-update/16 text-update",
};

const SIZE_STYLES: Record<string, string> = {
  sm: "px-2 py-1 text-xs font-medium rounded-lg gap-1",
  md: "px-3 h-10 w-full text-base font-medium rounded-xl gap-1.5",
};

const LABEL: Record<string, string> = {
  NEW:      "새 상품",
  DISCOUNT: "할인",
};

interface BadgeProps {
  variant: string;
  size?: "sm" | "md";
  icon?: React.ReactNode;
}

export function Badge({ variant, size = "sm", icon }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center ${VARIANT_STYLES[variant] ?? "bg-info text-foreground"} ${SIZE_STYLES[size]}`}
    >
      {icon}
      {LABEL[variant] ?? variant}
    </span>
  );
}
