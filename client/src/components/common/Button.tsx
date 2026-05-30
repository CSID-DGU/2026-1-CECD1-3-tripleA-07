import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-[#7e62ca] hover:bg-[#6b52b1] text-white shadow-lg shadow-[#7e62ca]/20',
  secondary: 'text-[#7e62ca] hover:bg-gray-200/50',
  danger: 'text-[#ca6262] hover:bg-red-50',
};

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const baseStyles = 'px-5 py-2.5 rounded-xl font-bold transition-colors cursor-pointer';
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
}
