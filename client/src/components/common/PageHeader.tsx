import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode[];
}

export function PageHeader({ title, actions }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <h2 className="text-[28px] font-medium text-foreground">{title}</h2>
      </div>
      {actions && actions.length > 0 && (
        <div className="flex items-center gap-3">
          {actions.map((action, i) => (
            <React.Fragment key={i}>{action}</React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
