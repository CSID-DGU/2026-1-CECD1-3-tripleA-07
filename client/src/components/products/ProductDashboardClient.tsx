"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductTable from "@/components/products/ProductTable";
import ProductEditor from "@/components/products/ProductEditor";
import { Product } from "@/types/product";
import { productService } from "@/services/productService";

interface ProductDashboardClientProps {
  initialProducts: Product[];
  initialTotalPages: number;
  currentPage: number;
  searchTerm: string;
}

export default function ProductDashboardClient({
  initialProducts,
  initialTotalPages,
  currentPage,
  searchTerm,
}: ProductDashboardClientProps) {
  const router = useRouter();
  
  // 클라이언트 상태: 선택된 상품 및 추가 모드
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [error, setError] = useState<string | null>(null);

  // 서버 데이터가 변경될 때 클라이언트 상태 동기화
  useEffect(() => {
    setProducts(initialProducts);
    setTotalPages(initialTotalPages);
    setError(null);
  }, [initialProducts, initialTotalPages]);

  const handleSearch = (term: string) => {
    router.push(`/?search=${encodeURIComponent(term)}&page=0`);
  };

  const handlePageChange = (page: number) => {
    router.push(`/?search=${encodeURIComponent(searchTerm)}&page=${page}`);
  };

  const selectedProduct = isAdding
    ? { id: 0, name: "", listPrice: 0, price: 0, category: "", quantity: 0, description: "", imageUrl: "" }
    : products.find((p) => p.id === selectedProductId) || null;

  const handleSelectProduct = (id: number) => {
    setIsAdding(false);
    setSelectedProductId(id);
  };

  const handleAddNewProduct = () => {
    setIsAdding(true);
    setSelectedProductId(null);
  };

  const handleSaveProduct = async (updatedProduct: Product) => {
    try {
      if (isAdding) {
        await productService.createProduct(updatedProduct);
        alert("상품이 등록되었습니다.");
        setIsAdding(false);
      } else {
        const { imageUrl, ...dataToUpdate } = updatedProduct;
        await productService.updateProduct(updatedProduct.id, dataToUpdate);
        alert("변경사항이 저장되었습니다.");
      }
      // 데이터 갱신을 위해 현재 페이지 새로고침
      router.refresh();
    } catch (error) {
      console.error("Failed to save product:", error);
      alert("저장에 실패했습니다.");
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm("정말 이 상품을 삭제하시겠습니까?")) {
      try {
        await productService.deleteProduct(id);
        setSelectedProductId(null);
        router.refresh();
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  return (
    <>
      {/* 왼쪽: 상품 목록 (60%) */}
      <div className="w-[60%] h-full border-r">
        {error ? (
          <div className="flex h-full items-center justify-center text-red-600 p-8">
            <p>상품 목록을 불러오는 중 오류가 발생했습니다.</p>
          </div>
        ) : (
          <ProductTable
            products={products}
            selectedId={selectedProductId}
            onSelect={handleSelectProduct}
            onAddNew={handleAddNewProduct}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            searchTerm={searchTerm}
            onSearch={handleSearch}
          />
        )}
      </div>

      {/* 오른쪽: 상세 편집 (40%) */}
      <div className="w-[40%] h-full">
        <ProductEditor
          product={selectedProduct}
          onSave={handleSaveProduct}
          onDelete={handleDeleteProduct}
          onCancel={() => setIsAdding(false)}
          isNew={isAdding}
        />
      </div>
    </>
  );
}
