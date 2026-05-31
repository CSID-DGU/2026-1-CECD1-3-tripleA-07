"use client";

import { useInspector } from "@/contexts/InspectorContext";
import ProductEditor from "@/components/products/ProductEditor";
import AdDetail from "@/components/ads/AdDetail";

export default function InspectorPanel() {
  const { state, close } = useInspector();

  return (
    <div className="w-[50%] max-w-120 h-full shrink-0 rounded-xl bg-surface">
      {!state ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-sm font-medium text-foreground/48">선택된 항목이 없습니다</p>
        </div>
      ) : state.type === "ad" ? (
        <AdDetail key={state.ad.id} ad={state.ad} />
      ) : state.type === "product-edit" ? (
        <ProductEditor key={state.product.id} product={state.product} onCancel={close} />
      ) : (
        <ProductEditor key="new" onCancel={close} />
      )}
    </div>
  );
}
