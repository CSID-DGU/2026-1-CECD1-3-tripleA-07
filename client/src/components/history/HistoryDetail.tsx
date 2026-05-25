import { AdHistory } from "@/types/history";

const EVENT_TYPE_LABEL: Record<string, string> = {
  NEW: "신규 출시",
  DISCOUNT: "할인",
};
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/common/Button";
import { useInspector } from "@/contexts/InspectorContext";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-light text-foreground/48 uppercase tracking-wider">{label}</span>
      <span className="text-sm font-regular text-foreground">{value}</span>
    </div>
  );
}

export default function HistoryDetail({ history }: { history: AdHistory }) {
  const date = history.createdAt.slice(0, 10);

  return (
    <section className="flex flex-col h-full">
      <div className="px-6 pt-6 pb-4 shrink-0">
        <PageHeader
          title="광고 상세 정보"
          actions={[]}
        />
        <p className="text-sm font-medium text-foreground/48">광고 ID: {history.id}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-5">
        <div className="rounded-xl bg-info p-4 space-y-4">
          <DetailRow label="생성일" value={date} />
          <DetailRow label="상품 ID" value={String(history.productId)} />
          <DetailRow label="광고 유형" value={EVENT_TYPE_LABEL[history.eventType] ?? history.eventType} />
          <DetailRow label="광고 URL" value={history.adUrl} />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-light text-foreground/48 uppercase tracking-wider">광고 내용</span>
          <p className="text-sm font-regular text-foreground whitespace-pre-wrap leading-relaxed">
            {history.adContent}
          </p>
        </div>
      </div>
    </section>
  );
}
