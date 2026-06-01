"use client";

import { useInspector } from "@/contexts/InspectorContext";
import ProductEditor from "@/components/products/ProductEditor";
import AdDetail from "@/components/ads/AdDetail";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/common/Button";

const INSPECTOR_TITLES = {
  "product-new":  "상품 추가하기",
  "product-edit": "상품 상세정보",
  "ad":           "광고 상세 정보",
} as const;

export default function InspectorPanel() {
  const { state, close } = useInspector();

  return (
    <div className={`h-full rounded-xl bg-surface flex flex-col lg:w-[50%] lg:max-w-120 lg:shrink-0 ${state ? "flex-1 lg:flex-none" : "hidden lg:flex"}`}>
      {!state ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-sm font-medium text-foreground/48">선택된 항목이 없습니다</p>
        </div>
      ) : (
        <>
          <div className="px-6 pt-6 pb-4 shrink-0">
            <PageHeader
              title={INSPECTOR_TITLES[state.type]}
              actions={[
                <Button key="close" type="button" variant="tertiary" onClick={close}>
                  닫기
                </Button>,
              ]}
            />
          </div>
          {state.type === "ad" ? (
            <AdDetail key={state.ad.id} ad={state.ad} />
          ) : state.type === "product-edit" ? (
            <ProductEditor key={state.product.id} product={state.product} onCancel={close} />
          ) : (
            <ProductEditor key="new" onCancel={close} />
          )}
        </>
      )}
    </div>
  );
}
