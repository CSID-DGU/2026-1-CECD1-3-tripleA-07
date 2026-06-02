import Sidebar from "@/components/layout/Sidebar";
import { InspectorProvider } from "@/contexts/InspectorContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <InspectorProvider>
      <div className="flex h-screen bg-canvas overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden py-1 pr-1">{children}</main>
      </div>
    </InspectorProvider>
  );
}
