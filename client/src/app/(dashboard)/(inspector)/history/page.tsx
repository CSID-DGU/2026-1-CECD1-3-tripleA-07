import { Suspense } from "react";
import { historyService } from "@/services/historyService";
import HistoryDashboardClient from "@/components/history/HistoryDashboardClient";
import { AdHistory } from "@/types/history";
import { MOCK_HISTORIES } from "@/mocks/historyMocks";

async function HistoryDataFetcher() {
  let content: AdHistory[] = MOCK_HISTORIES;

  try {
    const data = await historyService.getHistories(0, 100);
    content = data.content;
  } catch {
    // 백엔드 미완성 시 목업 데이터로 fallback
  }

  return <HistoryDashboardClient initialHistories={content} />;
}

export default async function HistoryPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center">광고 발행 이력을 불러오는 중...</div>}>
      <HistoryDataFetcher />
    </Suspense>
  );
}
