"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import HistoryTable from "@/components/history/HistoryTable";
import { AdHistory } from "@/types/history";
import { historyService } from "@/services/historyService";
import { MOCK_HISTORIES } from "@/mocks/historyMocks";
import { useInspector } from "@/contexts/InspectorContext";

export default function HistoryDashboardClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { open, state } = useInspector();

  const initialPage = Math.max(0, Math.floor(Number(searchParams.get("page")) || 0));

  const [histories, setHistories] = useState<AdHistory[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(true);

  const currentPageRef = useRef(initialPage);

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
    fetchHistories(initialPage);
  // 마운트 시 1회만 실행 — 초기값은 URL에서 읽어 state에 반영됨
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = useCallback((page: number) => {
    currentPageRef.current = page;
    setCurrentPage(page);
    router.replace(`?page=${page}`);
    fetchHistories(page);
  }, [fetchHistories, router]);

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
