"use client";

import { createContext, useContext, useState, useRef, ReactNode } from "react";
import { Product } from "@/types/product";

type InspectorState =
  | { type: "product"; product: Product | null }
  | { type: "history"; id: number }
  | null;

interface InspectorContextType {
  state: InspectorState;
  open: (state: NonNullable<InspectorState>) => void;
  close: () => void;
  onSaved: () => void;
  registerOnSaved: (cb: () => void) => void;
}

const InspectorContext = createContext<InspectorContextType | null>(null);

export function InspectorProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<InspectorState>(null);
  const onSavedRef = useRef<() => void>(() => {});

  return (
    <InspectorContext.Provider
      value={{
        state,
        open: setState,
        close: () => setState(null),
        onSaved: () => onSavedRef.current(),
        registerOnSaved: (cb) => { onSavedRef.current = cb; },
      }}
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
