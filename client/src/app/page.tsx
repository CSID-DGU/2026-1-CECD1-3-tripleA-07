"use client";

import { useState, useEffect } from "react";
import ProductTable from "@/components/products/ProductTable";
import { Product } from "@/types/product";
import ProductEditor from "@/components/products/ProductEditor";
import { productService } from "@/services/productService";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const fetchProducts = async (pageIndex: number) => {
    try {
      const response = await productService.getProducts(undefined, pageIndex);
      setProducts(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const selectedProduct =
    products.find((p) => p.id === selectedProductId) || null;

  const handleSelectProduct = (id: number) => {
    setSelectedProductId(id);
  };

  const handleAddNewProduct = async () => {
    const newProduct = {
      name: "새 상품",
      listPrice: 0,
      price: 0,
      category: "카테고리",
      quantity: 0,
      description: "상품 설명을 입력해주세요.",
      imageUrl: "https://placekitten.com/203/203",
    };
    try {
      await productService.createProduct(newProduct);
      fetchProducts(page);
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  const handleSaveProduct = async (updatedProduct: Product) => {
    try {
      const { imageUrl, ...dataToUpdate } = updatedProduct;
      await productService.updateProduct(updatedProduct.id, dataToUpdate);
      alert("변경사항이 저장되었습니다.");
      fetchProducts(page);
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("저장에 실패했습니다.");
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm("정말 이 상품을 삭제하시겠습니까?")) {
      try {
        await productService.deleteProduct(id);
        fetchProducts(page);
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
        />
      </div>

      {/* 오른쪽: 상세 편집 (40%) */}
      <div className="w-[40%] h-full">
        <ProductEditor
          product={selectedProduct}
          onSave={handleSaveProduct}
          onDelete={handleDeleteProduct}
        />
      </div>
    </main>
  );
}
