"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import AdTable from "@/components/ads/AdTable";
import { Ad } from "@/types/ad";
import { adService } from "@/services/adService";
import { useInspector } from "@/contexts/InspectorContext";

const PAGE_SIZE = 20;

export default function AdDashboardClient() {
  const { open, state } = useInspector();

  const [allAds, setAllAds] = useState<Ad[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedAdId = state?.type === "ad" ? state.ad.id : null;

  const fetchAds = useCallback(async (productId?: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adService.getAds(productId);
      setAllAds(data);
    } catch (error) {
      console.error("SNS 광고 이력 조회 실패:", error);
      setError("광고 이력을 불러오지 못했습니다.");
      setAllAds([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  const totalPages = Math.ceil(allAds.length / PAGE_SIZE);

  const pagedAds = useMemo(
    () => allAds.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE),
    [allAds, currentPage]
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleSelectAd = useCallback((id: number) => {
    const ad = allAds.find((a) => a.id === id);
    if (ad) open({ type: "ad", ad });
  }, [allAds, open]);

  const handleProductIdSearch = useCallback((value: string) => {
    const productId = value.trim() === "" ? undefined : Number(value);
    if (productId !== undefined && isNaN(productId)) return;
    setCurrentPage(0);
    fetchAds(productId);
  }, [fetchAds]);

  return (
    <div className="h-full">
      <AdTable
        ads={pagedAds}
        selectedId={selectedAdId}
        onSelect={handleSelectAd}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onProductIdSearch={handleProductIdSearch}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
