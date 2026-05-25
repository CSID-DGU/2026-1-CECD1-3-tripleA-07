import { InspectorProvider } from "@/contexts/InspectorContext";
import InspectorPanel from "@/components/inspector/InspectorPanel";

export default function InspectorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <InspectorProvider>
      <div className="flex h-full space-x-1.5">
        <div className="flex-1 min-w-0 h-full bg-surface rounded-xl">{children}</div>
        <InspectorPanel />
      </div>
    </InspectorProvider>
  );
}
