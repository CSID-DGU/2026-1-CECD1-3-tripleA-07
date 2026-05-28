"use client";

import { useState, useCallback } from "react";
import HistoryTable from "@/components/history/HistoryTable";
import { AdHistory } from "@/types/history";
import { useInspector } from "@/contexts/InspectorContext";

interface HistoryDashboardClientProps {
  initialHistories: AdHistory[];
}

export default function HistoryDashboardClient({
  initialHistories,
}: HistoryDashboardClientProps) {
  const { open, state } = useInspector();

  const [histories] = useState<AdHistory[]>(initialHistories);
  const [isLoading] = useState(false);

  const selectedHistoryId = state?.type === "history" ? state.history.id : null;

  const handleSelectHistory = useCallback((id: number) => {
    const history = histories.find((h) => h.id === id);
    if (history) open({ type: "history", history });
  }, [histories, open]);

  return (
    <div className="h-full">
      <HistoryTable
        histories={histories}
        selectedId={selectedHistoryId}
        onSelect={handleSelectHistory}
        isLoading={isLoading}
      />
    </div>
  );
}
