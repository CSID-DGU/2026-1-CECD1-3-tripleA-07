"use client";

import { useInspector } from "@/contexts/InspectorContext";
import ProductEditor from "@/components/products/ProductEditor";
import HistoryDetail from "@/components/inspector/HistoryDetail";

export default function InspectorPanel() {
  const { state, close } = useInspector();

  return (
    <div className="w-[50%] max-w-120 h-full shrink-0 rounded-xl bg-surface">
      {!state ? (
        <p className="text-sm text-center">
          항목을 선택하면
          <br />
          상세 정보가 표시됩니다.
        </p>
      ) : state.type === "history" ? (
        <HistoryDetail id={state.id} />
      ) : (
        <ProductEditor
          key={state.product === null ? "new" : state.product.id}
          product={state.product}
          isNew={state.product === null}
          onCancel={close}
        />
      )}
    </div>
  );
}
