"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { AdHistory } from "@/types/history";
import { Product } from "@/types/product";
import { productService } from "@/services/productService";
import { useInspector } from "@/contexts/InspectorContext";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "../common/Button";

const EVENT_TYPE_LABEL: Record<string, string> = {
  NEW: "신규 출시",
  DISCOUNT: "할인",
};

export default function HistoryDetail({ history }: { history: AdHistory }) {
  const { open } = useInspector();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    productService.getProductById(history.productId).then(setProduct).catch(() => setProduct(null));
  }, [history.productId]);

  return (
    <section className="flex flex-col h-full">
      <div className="px-6 pt-6 pb-4 shrink-0 space-y-4">
        <PageHeader title="광고 상세 정보" actions={[]} />
        <p className="text-sm font-medium text-foreground/48">
          광고 ID: {history.id} <br />
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
          {product ? (
            <>
              <div className="space-y-2">
                <p className="text-base font-normal text-foreground">상품명</p>
                <p className="text-2xl font-medium text-foreground">{product.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <p className="text-base font-normal text-foreground">정가</p>
                  <p className="text-xl font-medium text-foreground">{product.listPrice.toLocaleString()}원</p>
                </div>
                <div className="space-y-2">
                  <p className="text-base font-normal text-foreground">판매가</p>
                  <p className="text-xl font-medium text-foreground">{product.price.toLocaleString()}원</p>
                </div>
              </div>

              <Button
                type="button"
                variant="tertiary"
                onClick={() => open({ type: "product-edit", product })}
                className="h-10 px-5"
              >
                <p>상품 정보 더보기</p>
                <ChevronRight size={20} className="shrink-0" />
              </Button>
            </>
          ) : (
            <div className="space-y-3">
              <p className="text-xl font-medium text-foreground">상품 ID: {history.productId}</p>
              <p className="text-sm text-foreground/48">상품 정보를 불러올 수 없습니다.</p>
            </div>
          )}
        </div>

        <div className="p-4 rounded-xl space-y-5 border border-border">
          <p className="text-xl font-medium text-foreground">게시물 링크</p>
          {history.adUrl ? (
            <div className="space-y-2">
              <p className="text-base font-normal text-foreground">facebook</p>
              <a
                href={history.adUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 w-full h-10 bg-facebook/16 text-facebook rounded-xl font-medium transition-colors hover:opacity-80 inline-flex items-center justify-between gap-2 text-base"
              >
                <p className="truncate min-w-0">{history.adUrl}</p>
                <ChevronRight size={20} className="shrink-0" />
              </a>
            </div>
          ) : (
            <p className="text-sm text-foreground/48 font-normal">게시물 링크가 없습니다.</p>
          )}
        </div>

        <div className="p-4 rounded-xl space-y-5 border border-border">
          <p className="text-xl font-medium text-foreground">게시물 미리보기</p>
          <div className="px-3 py-3 w-full rounded-xl bg-info text-base text-foreground font-normal">
            {history.adContent}
          </div>
        </div>

      </div>
    </section>
  );
}
