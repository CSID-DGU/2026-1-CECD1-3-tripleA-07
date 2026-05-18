"use client";

import { useState } from "react";
import ProductTable, { Product } from "@/components/products/ProductTable";
import ProductEditor from "@/components/products/ProductEditor";

const MOCK_DATA: Product[] = [
  {
    id: "12aE9",
    name: "코튼 가디건",
    price: "32,900",
    category: "상의",
    quantity: "10,000",
    description: "편안한 착용감의 데일리 코튼 가디건입니다.",
  },
  {
    id: "1908B",
    name: "크롭 청자켓",
    price: "75,900",
    category: "상의, 외투",
    quantity: "9,000",
    description: "트렌디한 실루엣의 크롭 데님 자켓입니다.",
  },
  {
    id: "23F21",
    name: "와이드 슬랙스",
    price: "45,000",
    category: "하의",
    quantity: "5,500",
    description: "체형을 보정해주는 세미 와이드 핏 슬랙스입니다.",
  },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>(MOCK_DATA);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const selectedProduct =
    products.find((p) => p.id === selectedProductId) || null;

  const handleSelectProduct = (id: string) => {
    setSelectedProductId(id);
  };

  const handleAddNewProduct = () => {
    const newId = Math.random().toString(36).substring(2, 7).toUpperCase();
    const newProduct: Product = {
      id: newId,
      name: "새 상품",
      price: "0",
      category: "카테고리",
      quantity: "0",
      description: "상품 설명을 입력해주세요.",
    };
    setProducts([newProduct, ...products]);
    setSelectedProductId(newId);
  };

  const handleSaveProduct = (updatedProduct: Product) => {
    setProducts(
      products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    alert("변경사항이 저장되었습니다.");
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("정말 이 상품을 삭제하시겠습니까?")) {
      setProducts(products.filter((p) => p.id !== id));
      setSelectedProductId(null);
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
