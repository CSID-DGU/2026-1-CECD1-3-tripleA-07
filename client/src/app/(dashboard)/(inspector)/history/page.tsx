import { Suspense } from "react";
import HistoryDashboardClient from "@/components/history/HistoryDashboardClient";

export default function HistoryPage() {
  return (
    <Suspense>
      <HistoryDashboardClient />
    </Suspense>
  );
}
