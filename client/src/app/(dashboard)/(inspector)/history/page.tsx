import { Suspense } from "react";
import { historyService } from "@/services/historyService";
import HistoryDashboardClient from "@/components/history/HistoryDashboardClient";
import { AdHistory } from "@/types/history";
import { MOCK_HISTORIES } from "@/mocks/historyMocks";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

async function HistoryDataFetcher({ page }: { page: number }) {
  let content: AdHistory[] = MOCK_HISTORIES;
  let totalPages = 1;

  try {
    const data = await historyService.getHistories(page, 20);
    content = data.content;
    totalPages = data.totalPages;
  } catch {
    // 백엔드 미완성 시 목업 데이터로 fallback
  }

  return (
    <HistoryDashboardClient
      initialHistories={content}
      initialTotalPages={totalPages}
      currentPage={page}
    />
  );
}

export default async function HistoryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(0, Math.floor(Number(params.page) || 0));

  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center">광고 발행 이력을 불러오는 중...</div>}>
      <HistoryDataFetcher page={page} />
    </Suspense>
  );
}
