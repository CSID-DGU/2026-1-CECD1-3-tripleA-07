"use client";

import { useInspector } from "@/contexts/InspectorContext";

const TEST_ITEMS = [
  { id: 1, title: "테스트 캠페인 A", platform: "Instagram", date: "2026-05-01" },
  { id: 2, title: "테스트 캠페인 B", platform: "Facebook", date: "2026-05-10" },
  { id: 3, title: "테스트 캠페인 C", platform: "X (Twitter)", date: "2026-05-20" },
];

export default function HistoryPage() {
  const { open, state } = useInspector();
  const selectedId = state?.type === "history" ? state.id : null;

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">SNS 광고 발행 이력</h1>
      </div>
      <div className="space-y-2">
        {TEST_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => open({ type: "history", id: item.id })}
            className={`w-full text-left px-4 py-3 rounded-xl border transition-colors ${
              selectedId === item.id
                ? "bg-[#7e62ca] text-white border-[#7e62ca]"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div className="font-medium">{item.title}</div>
            <div
              className={`text-sm mt-0.5 ${
                selectedId === item.id ? "text-purple-200" : "text-gray-400"
              }`}
            >
              {item.platform} · {item.date}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
