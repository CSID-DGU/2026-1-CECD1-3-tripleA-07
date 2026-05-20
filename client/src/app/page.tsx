import { Suspense } from "react";
import { productService } from "@/services/productService";
import ProductDashboardClient from "@/components/products/ProductDashboardClient";
import { Product } from "@/types/product";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

async function ProductDataFetcher({ 
  page, 
  search 
}: { 
  page: number; 
  search: string 
}) {
  try {
    const data = await productService.getProducts(search || undefined, page);
    const { content, totalPages } = data;

    return (
      <ProductDashboardClient 
        initialProducts={content} 
        initialTotalPages={totalPages}
        currentPage={page}
        searchTerm={search}
      />
    );
  } catch (error) {
    // 서버 컴포넌트 에러는 error.tsx에서 처리하거나 
    // 하위 컴포넌트에 에러 상태를 전달할 수 있습니다.
    throw error; 
  }
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 0;
  const search = params.search || "";

  return (
    <main className="flex h-screen w-full bg-white overflow-hidden">
      <Suspense fallback={<div className="flex-1 flex items-center justify-center">상품 목록을 불러오는 중...</div>}>
        <ProductDataFetcher page={page} search={search} />
      </Suspense>
    </main>
  );
}
