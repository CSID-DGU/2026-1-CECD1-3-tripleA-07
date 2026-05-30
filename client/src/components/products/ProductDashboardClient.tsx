"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProductTable from "@/components/products/ProductTable";
import ProductEditor from "@/components/products/ProductEditor";
import { Product } from "@/types/product";
import { productService, SortType } from "@/services/productService";
import { DEFAULT_PRODUCT_FORM_VALUES } from "@/types/productSchema";

interface ProductDashboardClientProps {
  initialProducts: Product[];
  initialTotalPages: number;
  currentPage: number;
  searchTerm: string;
  sortType: SortType;
}

export default function ProductDashboardClient({
  initialProducts,
  initialTotalPages,
  currentPage,
  searchTerm,
  sortType,
}: ProductDashboardClientProps) {
  const router = useRouter();
  
  // 상태 관리: 선택된 상품 및 추가 모드
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleSearch = (term: string) => {
    router.push(`/?search=${encodeURIComponent(term)}&page=0&sort=${sortType}`);
  };

  const handlePageChange = (page: number) => {
    router.push(`/?search=${encodeURIComponent(searchTerm)}&page=${page}&sort=${sortType}`);
  };

  const handleSortChange = (sort: SortType) => {
    router.push(`/?search=${encodeURIComponent(searchTerm)}&page=0&sort=${sort}`);
  };

  const selectedProduct = isAdding
    ? { id: 0, ...DEFAULT_PRODUCT_FORM_VALUES }
    : initialProducts.find((p) => p.id === selectedProductId) || null;

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
        const dataToUpdate = {
          name: updatedProduct.name,
          imageUrl: updatedProduct.imageUrl,
          listPrice: updatedProduct.listPrice,
          price: updatedProduct.price,
          category: updatedProduct.category,
          quantity: updatedProduct.quantity,
          description: updatedProduct.description,
        };
        await productService.updateProduct(updatedProduct.id, dataToUpdate);
        alert("변경사항이 저장되었습니다.");
      }
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
        alert("삭제에 실패했습니다.");
      }
    }
  };

  return (
    <>
      {/* 왼쪽: 상품 목록 (60%) */}
      <div className="w-[60%] h-full border-r">
        <ProductTable
          products={initialProducts}
          selectedId={selectedProductId}
          onSelect={handleSelectProduct}
          onAddNew={handleAddNewProduct}
          currentPage={currentPage}
          totalPages={initialTotalPages}
          onPageChange={handlePageChange}
          searchTerm={searchTerm}
          onSearch={handleSearch}
          sortType={sortType}
          onSortChange={handleSortChange}
        />
      </div>

      {/* 오른쪽: 상세 편집 (40%) */}
      <div className="w-[40%] h-full">
        <ProductEditor
          key={isAdding ? "new" : (selectedProductId ?? "none")}
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
