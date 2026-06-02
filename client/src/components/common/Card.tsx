interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={`p-4 rounded-xl space-y-5 border border-border${className ? ` ${className}` : ""}`}>
      {children}
    </div>
  );
}
