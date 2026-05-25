"use client";

import { useState, useCallback, useRef } from "react";
import HistoryTable from "@/components/history/HistoryTable";
import { AdHistory } from "@/types/history";
import { historyService } from "@/services/historyService";
import { useInspector } from "@/contexts/InspectorContext";

interface HistoryDashboardClientProps {
  initialHistories: AdHistory[];
  initialTotalPages: number;
  currentPage: number;
}

export default function HistoryDashboardClient({
  initialHistories,
  initialTotalPages,
  currentPage: initialPage,
}: HistoryDashboardClientProps) {
  const { open, state } = useInspector();

  const [histories, setHistories] = useState<AdHistory[]>(initialHistories);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);

  const currentPageRef = useRef(initialPage);

  const selectedHistoryId = state?.type === "history" ? state.history.id : null;

  const fetchHistories = useCallback(async (page: number) => {
    setIsLoading(true);
    try {
      const data = await historyService.getHistories(page, 20);
      setHistories(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("광고 발행 이력 조회 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
