"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import HistoryTable from "@/components/history/HistoryTable";
import { AdHistory } from "@/types/history";
import { historyService } from "@/services/historyService";
import { useInspector } from "@/contexts/InspectorContext";

const PAGE_SIZE = 20;

export default function HistoryDashboardClient() {
  const { open, state } = useInspector();

  const [allHistories, setAllHistories] = useState<AdHistory[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedHistoryId = state?.type === "history" ? state.history.id : null;

  const fetchHistories = useCallback(async (productId?: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await historyService.getHistories(productId);
      setAllHistories(data);
    } catch (error) {
      console.error("SNS 광고 이력 조회 실패:", error);
      setError("광고 이력을 불러오지 못했습니다.");
      setAllHistories([]);
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

  const handleProductIdSearch = useCallback((value: string) => {
    const productId = value.trim() === "" ? undefined : Number(value);
    if (productId !== undefined && isNaN(productId)) return;
    setCurrentPage(0);
    fetchHistories(productId);
  }, [fetchHistories]);

  return (
    <div className="h-full">
      <HistoryTable
        histories={pagedHistories}
        selectedId={selectedHistoryId}
        onSelect={handleSelectHistory}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onProductIdSearch={handleProductIdSearch}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
