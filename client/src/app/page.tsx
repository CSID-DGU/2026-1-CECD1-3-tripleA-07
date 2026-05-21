import { Suspense } from "react";
import { productService, SortType } from "@/services/productService";
import ProductDashboardClient from "@/components/products/ProductDashboardClient";
import { Product } from "@/types/product";

const VALID_SORT_TYPES: SortType[] = ['CREATED_AT_DESC', 'PRICE_ASC', 'PRICE_DESC', 'NAME_ASC', 'QUANTITY_DESC'];

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sort?: string;
  }>;
}

async function ProductDataFetcher({
  page,
  search,
  sort,
}: {
  page: number;
  search: string;
  sort: SortType;
}) {
  try {
    const data = await productService.getProducts(search || undefined, page, 20, sort);
    const { content, totalPages } = data;

    return (
      <ProductDashboardClient
        key={`${search}-${page}-${sort}`}
        initialProducts={content}
        initialTotalPages={totalPages}
        currentPage={page}
        searchTerm={search}
        sortType={sort}
      />
    );
  } catch (error) {
    throw error;
  }
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 0;
  const search = params.search || "";
  const sort: SortType = VALID_SORT_TYPES.includes(params.sort as SortType)
    ? (params.sort as SortType)
    : 'CREATED_AT_DESC';

  return (
    <main className="flex h-screen w-full bg-white overflow-hidden">
      <Suspense fallback={<div className="flex-1 flex items-center justify-center">상품 목록을 불러오는 중...</div>}>
        <ProductDataFetcher page={page} search={search} sort={sort} />
      </Suspense>
    </main>
  );
}
