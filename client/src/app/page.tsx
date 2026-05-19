"use client";

import { useState, useEffect } from "react";
import ProductTable from "@/components/products/ProductTable";
import { Product } from "@/types/product";
import ProductEditor from "@/components/products/ProductEditor";
import { productService } from "@/services/productService";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts(page, searchTerm);
  }, [page, searchTerm]);

  const fetchProducts = async (pageIndex: number, keyword: string) => {
    try {
      const response = await productService.getProducts(keyword || undefined, pageIndex);
      setProducts(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPage(0); // 검색 시 첫 페이지로 초기화
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

  const handleCancelAdd = () => {
    setIsAdding(false);
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
      fetchProducts(page, searchTerm);
    } catch (error) {
      console.error("Failed to save product:", error);
      alert("저장에 실패했습니다.");
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm("정말 이 상품을 삭제하시겠습니까?")) {
      try {
        await productService.deleteProduct(id);
        fetchProducts(page, searchTerm);
        setSelectedProductId(null);
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  return (
    <main className="flex h-screen w-full bg-white overflow-hidden">
      {/* 왼쪽: 상품 목록 (60%) */}
      <div className="w-[60%] h-full">
        <ProductTable
          products={products}
          selectedId={selectedProductId}
          onSelect={handleSelectProduct}
          onAddNew={handleAddNewProduct}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          searchTerm={searchTerm}
          onSearch={handleSearch}
        />
      </div>

      {/* 오른쪽: 상세 편집 (40%) */}
      <div className="w-[40%] h-full">
        <ProductEditor
          product={selectedProduct}
          onSave={handleSaveProduct}
          onDelete={handleDeleteProduct}
          onCancel={handleCancelAdd}
          isNew={isAdding}
        />
      </div>
    </main>
  );
}
