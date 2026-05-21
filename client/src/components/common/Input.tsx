import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, ...props }: InputProps) {
  return (
    <div className="space-y-3">
      {label && <h3 className="text-sm font-bold text-gray-500 uppercase">{label}</h3>}
      <input
        {...props}
        className="w-full h-12 px-4 text-gray-900 bg-gray-100 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7e62ca]/50 outline-none transition-all"
      />
    </div>
  );
}
