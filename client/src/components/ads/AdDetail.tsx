"use client";

import { useEffect, useState } from "react";
import { ChevronRight, Leaf, Flame } from "lucide-react";
import { Ad } from "@/types/ad";
import { Product } from "@/types/product";
import { productService } from "@/services/productService";
import { useInspector } from "@/contexts/InspectorContext";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";

const EVENT_TYPE_ICON: Record<string, React.ReactNode> = {
  NEW:      <Leaf size={18} />,
  DISCOUNT: <Flame size={18} />,
};

export default function AdDetail({ ad }: { ad: Ad }) {
  const { open } = useInspector();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    productService.getProductById(ad.productId).then(setProduct).catch(() => setProduct(null));
  }, [ad.productId]);

  return (
    <section className="flex flex-col h-full">
      <div className="px-6 pt-6 pb-4 shrink-0 space-y-4">
        <PageHeader title="광고 상세 정보" actions={[]} />
        <p className="text-sm font-medium text-foreground/48">
          광고 ID: {ad.id} <br />
          발행일: {ad.createdAt}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-5">

        <Card>
          <p className="text-xl font-medium text-foreground">광고 유형</p>
          <Badge variant={ad.eventType} size="md" icon={EVENT_TYPE_ICON[ad.eventType]} />
        </Card>

        <Card>
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
              <p className="text-xl font-medium text-foreground">상품 ID: {ad.productId}</p>
              <p className="text-sm text-foreground/48">상품 정보를 불러올 수 없습니다.</p>
            </div>
          )}
        </Card>

        <Card>
          <p className="text-xl font-medium text-foreground">게시물 링크</p>
          {ad.adUrl ? (
            <div className="space-y-2">
              <p className="text-base font-normal text-foreground">facebook</p>
              <a
                href={ad.adUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 w-full h-10 bg-facebook/16 text-facebook rounded-xl font-medium transition-colors hover:opacity-80 inline-flex items-center justify-between gap-2 text-base"
              >
                <p className="truncate min-w-0">{ad.adUrl}</p>
                <ChevronRight size={20} className="shrink-0" />
              </a>
            </div>
          ) : (
            <p className="text-sm text-foreground/48 font-normal">게시물 링크가 없습니다.</p>
          )}
        </Card>

        <Card>
          <p className="text-xl font-medium text-foreground">게시물 미리보기</p>
          <div className="px-3 py-3 w-full rounded-xl bg-info text-base text-foreground font-normal">
            {ad.adContent}
          </div>
        </Card>

      </div>
    </section>
  );
}
