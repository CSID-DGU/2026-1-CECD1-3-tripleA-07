"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import HistoryTable from "@/components/history/HistoryTable";
import { AdHistory } from "@/types/history";
import { historyService } from "@/services/historyService";
import { MOCK_HISTORIES } from "@/mocks/historyMocks";
import { useInspector } from "@/contexts/InspectorContext";

const PAGE_SIZE = 20;

export default function HistoryDashboardClient() {
  const { open, state } = useInspector();

  const [allHistories, setAllHistories] = useState<AdHistory[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const selectedHistoryId = state?.type === "history" ? state.history.id : null;

  const fetchHistories = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await historyService.getHistories();
      setAllHistories(data);
    } catch {
      setAllHistories(MOCK_HISTORIES);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistories();
  }, [fetchHistories]);

  const totalPages = Math.ceil(allHistories.length / PAGE_SIZE);

  const pagedHistories = useMemo(
    () => allHistories.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE),
    [allHistories, currentPage]
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleSelectHistory = useCallback((id: number) => {
    const history = allHistories.find((h) => h.id === id);
    if (history) open({ type: "history", history });
  }, [allHistories, open]);

  return (
    <div className="h-full">
      <HistoryTable
        histories={pagedHistories}
        selectedId={selectedHistoryId}
        onSelect={handleSelectHistory}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        isLoading={isLoading}
      />
    </div>
  );
}
