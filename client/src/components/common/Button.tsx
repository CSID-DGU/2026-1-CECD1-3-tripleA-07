import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary hover:bg-primary/80 text-surface',
  secondary: 'text-primary hover:bg-info border border-primary/48',
  tertiary: 'text-foreground hover:bg-info border border-border',
  danger: 'text-warn hover:bg-warn/12 border border-warn/48',
};

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const baseStyles = 'h-10 px-5 rounded-xl font-medium transition-colors inline-flex shrink-0 items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
}
