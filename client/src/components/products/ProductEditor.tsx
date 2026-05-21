"use client";

import React, { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { ProductImage } from "./ProductImage";
import { ProductForm } from "./ProductForm";

interface ProductEditorProps {
  product: Product | null;
  onSave: (product: Product) => void;
  onDelete: (id: number) => void;
  onCancel?: () => void;
  isNew?: boolean;
}

export default function ProductEditor({
  product,
  onSave,
  onDelete,
  onCancel,
  isNew = false,
}: ProductEditorProps) {
  const [formData, setFormData] = useState<Product | null>(null);
  const [priceInput, setPriceInput] = useState<string>("");
  const [listPriceInput, setListPriceInput] = useState<string>("");
  const [quantityInput, setQuantityInput] = useState<string>("");

  useEffect(() => {
    setFormData(product);
    setPriceInput(product ? product.price.toString() : "");
    setListPriceInput(product ? product.listPrice.toString() : "");
    setQuantityInput(product ? product.quantity.toString() : "");
  }, [product]);

  if (!formData) {
    return (
      <section className="flex flex-col items-center justify-center h-full p-8 bg-gray-50/50 border-l border-gray-200 text-gray-400">
        <svg
          className="w-16 h-16 mb-4 opacity-20"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <p className="text-lg font-medium text-center">
          상품을 선택하거나 <br /> 새 상품을 추가해주세요.
        </p>
      </section>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "price") {
      setPriceInput(value);
    } else if (name === "listPrice") {
      setListPriceInput(value);
    } else if (name === "quantity") {
      setQuantityInput(value);
    } else {
      setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
    }
  };

  const handleSave = () => {
    if (!formData) return;
    
    // 필수 필드 검사
    if (!formData.name.trim()) {
      alert("상품명을 입력해주세요.");
      return;
    }
    
    const numericPrice = Number(priceInput);
    const numericListPrice = Number(listPriceInput);
    const numericQuantity = Number(quantityInput);
    
    if (isNaN(numericPrice) || isNaN(numericListPrice) || isNaN(numericQuantity)) {
      alert("가격, 정가, 수량은 숫자만 입력 가능합니다.");
      return;
    }
    
    // 0 미만 값 검사
    if (numericPrice < 0 || numericListPrice < 0 || numericQuantity < 0) {
      alert("가격, 정가, 수량은 0 이상이어야 합니다.");
      return;
    }
    
    onSave({ ...formData, price: numericPrice, listPrice: numericListPrice, quantity: numericQuantity });
  };

  return (
    <section className="flex flex-col h-full bg-gray-50/50 border-l border-gray-200 overflow-y-auto">
      <div className="p-8 space-y-8">
        <header className="space-y-1">
          <h2 className="text-3xl font-bold text-gray-900">상품 상세정보</h2>
          <p className="text-gray-500 font-medium">상품 ID: {formData.id}</p>
        </header>

        <ProductImage imageUrl={formData.imageUrl} name={formData.name} onChange={handleChange} />
        <ProductForm 
          formData={formData} 
          priceInput={priceInput} 
          listPriceInput={listPriceInput} 
          quantityInput={quantityInput} 
          onChange={handleChange} 
        />

        {/* 작업 버튼 */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={handleSave}
            className="flex-1 h-14 bg-[#7e62ca] hover:bg-[#6b52b1] text-white rounded-xl font-bold transition-colors shadow-lg shadow-[#7e62ca]/20"
          >
            {isNew ? "새 상품 등록하기" : "변경사항 저장하기"}
          </button>
          {!isNew && (
            <button
              onClick={() => setFormData(product)}
              className="px-6 h-14 text-[#7e62ca] font-bold hover:bg-gray-200/50 rounded-xl transition-colors"
            >
              변경사항 되돌리기
            </button>
          )}
        </div>

        <div className="pt-12">
          <button
            onClick={() => isNew ? onCancel?.() : onDelete(formData.id)}
            className="w-full h-14 text-[#ca6262] font-bold hover:bg-red-50 rounded-xl transition-colors"
          >
            {isNew ? "상품 등록 취소하기" : "상품 삭제하기"}
          </button>
        </div>
      </div>
    </section>
  );
}
