"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import HistoryTable from "@/components/history/HistoryTable";
import { AdHistory } from "@/types/history";
import { historyService } from "@/services/historyService";
import { MOCK_HISTORIES } from "@/mocks/historyMocks";
import { useInspector } from "@/contexts/InspectorContext";

export default function HistoryDashboardClient() {
  const { open, state } = useInspector();

  const [histories, setHistories] = useState<AdHistory[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const currentPageRef = useRef(0);

  const selectedHistoryId = state?.type === "history" ? state.history.id : null;

  const fetchHistories = useCallback(async (page: number) => {
    setIsLoading(true);
    try {
      const data = await historyService.getHistories(page, 20);
      setHistories(data.content);
      setTotalPages(data.totalPages);
    } catch {
      setHistories(MOCK_HISTORIES);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistories(0);
  }, [fetchHistories]);

  const handlePageChange = useCallback((page: number) => {
    currentPageRef.current = page;
    setCurrentPage(page);
    fetchHistories(page);
  }, [fetchHistories]);

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
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        isLoading={isLoading}
      />
    </div>
  );
}
