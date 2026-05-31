"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface SelectOption<T extends string> {
  value: T;
  label: string;
}

interface SelectProps<T extends string> {
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  className?: string;
}

export function Select<T extends string>({ value, options, onChange, className = "" }: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="h-10 px-4 pr-3 flex items-center gap-2 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/48 transition-all cursor-pointer"
      >
        <span>{selected?.label}</span>
        <ChevronDown
          className={`w-4 h-4 text-foreground/48 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`absolute left-0 top-[calc(100%+6px)] z-50 min-w-full bg-surface border border-border rounded-xl shadow-lg overflow-hidden transition-all duration-200 origin-top ${
          open ? "opacity-100 scale-y-100 translate-y-0" : "opacity-0 scale-y-95 -translate-y-1 pointer-events-none"
        }`}
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              onChange(option.value);
              setOpen(false);
            }}
            className={`w-full px-4 py-2 text-sm text-left transition-colors cursor-pointer ${
              option.value === value
                ? "text-primary font-semibold bg-primary/8"
                : "text-foreground hover:bg-info"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
