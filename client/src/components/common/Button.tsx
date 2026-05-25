import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary hover:bg-primary/80 text-surface',
  secondary: 'text-primary hover:bg-info border border-primary/48',
  danger: 'text-warn hover:bg-warn/12 border border-warn/48',
};

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const baseStyles = 'px-5 rounded-xl font-bold transition-colors inline-flex items-center justify-center gap-2 text-sm';
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
}
