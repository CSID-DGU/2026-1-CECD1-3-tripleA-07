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
    <div className="space-y-3">
      {label && <label htmlFor={inputId} className="block text-sm font-bold text-gray-500">{label}</label>}
      <input
        id={inputId}
        {...register}
        {...props}
        className={`w-full h-12 px-4 text-gray-900 bg-gray-100 border rounded-xl focus:ring-2 focus:ring-[#7e62ca]/50 outline-none transition-all ${
          error ? "border-red-500" : "border-gray-200"
        }`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
