import { NumericFormat } from "react-number-format";

interface NumericInputProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  error?: string;
  suffix?: string;
}

export function NumericInput({ label, value, onChange, error, suffix }: NumericInputProps) {
  return (
    <div className="space-y-2">
      {label && <label className="block text-base font-normal text-foreground">{label}</label>}
      <div className="relative">
        <NumericFormat
          thousandSeparator=","
          allowNegative={false}
          decimalScale={0}
          value={value}
          onValueChange={({ floatValue }) => onChange(floatValue ?? 0)}
          className={`w-full px-3 py-2 text-foreground font-normal border rounded-xl focus:ring-2 focus:ring-primary/48 outline-none transition-all ${suffix ? "pr-8" : ""} ${error ? "border-warn/48" : "border-border"}`}
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
