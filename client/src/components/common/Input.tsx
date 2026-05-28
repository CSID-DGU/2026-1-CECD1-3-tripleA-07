import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  register?: UseFormRegisterReturn;
  error?: string;
  suffix?: string;
}

export function Input({ label, register, error, suffix, ...props }: InputProps) {
  const inputId = props.id ?? props.name ?? register?.name;

  return (
    <div className="space-y-2">
      {label && <label htmlFor={inputId} className="block text-base font-regular text-foreground">{label}</label>}
      <div className="relative">
        <input
          id={inputId}
          {...register}
          {...props}
          className={`w-full px-3 py-2 text-foreground font-regular border rounded-xl focus:ring-2 focus:ring-primary/48 outline-none transition-all ${
            suffix ? "pr-8" : ""
          } ${error ? "border-warn/48" : "border-border"}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-foreground/48 pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-warn">{error}</p>}
    </div>
  );
}
