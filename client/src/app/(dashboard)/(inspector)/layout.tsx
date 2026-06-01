"use client";

import { useInspector } from "@/contexts/InspectorContext";
import InspectorPanel from "@/components/layout/InspectorPanel";

export default function InspectorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { state } = useInspector();

  return (
    <div className="flex h-full gap-1.5">
      <div className={`min-w-0 h-full bg-surface rounded-xl ${state ? "hidden lg:block lg:flex-1" : "flex-1"}`}>
        {children}
      </div>
      <InspectorPanel />
    </div>
  );
}
