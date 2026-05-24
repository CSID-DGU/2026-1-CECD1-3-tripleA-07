"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "@/types/product";

type InspectorState =
  | { type: "product"; product: Product | null }
  | { type: "history"; id: number }
  | null;

interface InspectorContextType {
  state: InspectorState;
  open: (state: NonNullable<InspectorState>) => void;
  close: () => void;
}

const InspectorContext = createContext<InspectorContextType | null>(null);

export function InspectorProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<InspectorState>(null);

  return (
    <InspectorContext.Provider
      value={{ state, open: setState, close: () => setState(null) }}
    >
      {children}
    </InspectorContext.Provider>
  );
}

export function useInspector() {
  const ctx = useContext(InspectorContext);
  if (!ctx) throw new Error("useInspector must be used within InspectorProvider");
  return ctx;
}
