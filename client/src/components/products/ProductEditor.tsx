"use client";

import React, { useEffect, useState } from "react";
import { Product } from "@/types/product";

interface ProductEditorProps {
  product: Product | null;
  onSave: (product: Product) => void;
  onDelete: (id: string) => void;
}

export default function ProductEditor({
  product,
  onSave,
  onDelete,
}: ProductEditorProps) {
  const [formData, setFormData] = useState<Product | null>(null);
  const [priceInput, setPriceInput] = useState<string>("");
  const [quantityInput, setQuantityInput] = useState<string>("");

  useEffect(() => {
    setFormData(product);
    setPriceInput(product ? product.price.toString() : "");
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
    } else if (name === "quantity") {
      setQuantityInput(value);
    } else {
      setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
    }
  };

  const handleSave = () => {
    if (!formData) return;
    
    const numericPrice = Number(priceInput);
    const numericQuantity = Number(quantityInput);
    
    if (isNaN(numericPrice) || isNaN(numericQuantity)) {
      alert("가격과 수량은 숫자만 입력 가능합니다.");
      return;
    }
    
    onSave({ ...formData, price: numericPrice, quantity: numericQuantity });
  };

  return (
    <section className="flex flex-col h-full bg-gray-50/50 border-l border-gray-200 overflow-y-auto">
      <div className="p-8 space-y-8">
        <header className="space-y-1">
          <h2 className="text-3xl font-bold text-gray-900">상품 상세정보</h2>
          <p className="text-gray-500 font-medium">상품 ID: {formData.id}</p>
        </header>

        {/* 상품 이미지 */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-500 uppercase">상품 이미지</h3>
          <div className="flex gap-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="w-28 h-28 bg-gray-200 border border-gray-300 rounded-xl"
              />
            ))}
            <button className="w-28 h-28 flex flex-col items-center justify-center bg-gray-200 border border-dashed border-gray-400 rounded-xl text-gray-500 hover:bg-gray-300 transition-colors">
              <span className="text-xs text-center font-medium">
                이미지 추가
                <br />+
              </span>
            </button>
          </div>
        </div>

        {/* 상품명 */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-500 uppercase">상품명</h3>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full h-12 px-4 text-gray-900 bg-gray-100 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7e62ca]/50 outline-none transition-all"
          />
        </div>

        {/* 가격 및 수량 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-500 uppercase">상품 가격</h3>
            <input
              name="price"
              value={priceInput}
              onChange={handleChange}
              className="w-full h-12 px-4 text-gray-900 bg-gray-100 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7e62ca]/50 outline-none transition-all"
            />
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-500 uppercase">수량</h3>
            <input
              name="quantity"
              value={quantityInput}
              onChange={handleChange}
              className="w-full h-12 px-4 text-gray-900 bg-gray-100 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7e62ca]/50 outline-none transition-all"
            />
          </div>
        </div>

        {/* 카테고리 */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-500 uppercase">카테고리</h3>
          <div className="flex gap-2">
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full h-12 px-4 text-gray-900 bg-gray-100 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7e62ca]/50 outline-none transition-all"
            />
          </div>
        </div>

        {/* 상품 설명 */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-500 uppercase">상품 설명</h3>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full p-4 text-gray-900 bg-gray-100 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7e62ca]/50 outline-none transition-all resize-none"
          />
        </div>

        {/* 작업 버튼 */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={handleSave}
            className="flex-1 h-14 bg-[#7e62ca] hover:bg-[#6b52b1] text-white rounded-xl font-bold transition-colors shadow-lg shadow-[#7e62ca]/20"
          >
            변경사항 저장하기
          </button>
          <button
            onClick={() => setFormData(product)}
            className="px-6 h-14 text-[#7e62ca] font-bold hover:bg-gray-200/50 rounded-xl transition-colors"
          >
            변경사항 되돌리기
          </button>
        </div>

        <div className="pt-12">
          <button
            onClick={() => onDelete(formData.id)}
            className="w-full h-14 text-[#ca6262] font-bold hover:bg-red-50 rounded-xl transition-colors"
          >
            상품 삭제하기
          </button>
        </div>
      </div>
    </section>
  );
}
