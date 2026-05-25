import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  register?: UseFormRegisterReturn;
  error?: string;
}

export function Input({ label, register, error, ...props }: InputProps) {
  const inputId = props.id ?? props.name ?? register?.name;

  return (
    <div className="space-y-2">
      {label && <label htmlFor={inputId} className="block text-base font-regular text-foreground">{label}</label>}
      <input
        id={inputId}
        {...register}
        {...props}
        className={`w-full px-3 py-2.5 text-foreground border rounded-xl focus:ring-2 focus:ring-primary/48 outline-none transition-all ${
          error ? "border-warn/48" : "border-border"
        }`}
      />
      {error && <p className="text-xs text-warn">{error}</p>}
    </div>
  );
}
