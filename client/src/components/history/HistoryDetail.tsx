import { AdHistory } from "@/types/history";
import { ChevronRight } from "lucide-react";

const EVENT_TYPE_LABEL: Record<string, string> = {
  NEW: "신규 출시",
  DISCOUNT: "할인",
};
import { PageHeader } from "@/components/common/PageHeader";

export default function HistoryDetail({ history }: { history: AdHistory }) {
  const date = history.createdAt.slice(0, 10);

  return (
    <section className="flex flex-col h-full">
      <div className="px-6 pt-6 pb-4 shrink-0 space-y-4">
        <PageHeader
          title="광고 상세 정보"
          actions={[]}
        />
        <p className="text-sm font-medium text-foreground/48">
          광고 ID: {history.id} <br/>
          발행일: {history.createdAt}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-5">

        <div className="p-4 rounded-xl space-y-5 border border-border">
          <p className="text-xl font-medium text-foreground">
            광고 유형: {EVENT_TYPE_LABEL[history.eventType] ?? history.eventType}
          </p>
        </div>
        
        <div className="p-4 rounded-xl space-y-5 border border-border">
          <div className="space-y-2">
            <p className="text-base font-regular text-foreground">
              상품 ID
            </p>
            <p className="text-2xl font-medium text-foreground">
              {String(history.productId)}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl space-y-5 border border-border">
          <p className="text-xl font-medium text-foreground">
            게시물 링크
          </p>
          {history.adUrl ? (
            <div className="space-y-2">
              <p className="text-base font-regular text-foreground">
                facebook
              </p>
              <a
                href={history.adUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 w-full h-10 bg-primary/16 text-primary rounded-xl font-medium transition-colors hover:opacity-80 inline-flex items-center justify-between gap-2 text-base"
              >
                <p className="truncate min-w-0">
                  {history.adUrl}
                </p>
                <ChevronRight size={20} className="shrink-0" />
              </a>
            </div>
          ) : (
            <p className="text-sm text-foreground/48">SNS 연동 전입니다.</p>
          )}
        </div>

        <div className="p-4 rounded-xl space-y-5 border border-border">
          <p className="text-xl font-medium text-foreground">
            게시물 미리보기
          </p>
          <div className="px-3 py-3 w-full rounded-xl bg-info text-base text-foreground font-regular">
            {history.adContent}
          </div>
        </div>
      </div>
    </section>
  );
}
