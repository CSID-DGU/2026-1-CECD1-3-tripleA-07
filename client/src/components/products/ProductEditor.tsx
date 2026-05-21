"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product } from "@/types/product";
import { productSchema, ProductFormValues } from "@/types/productSchema";
import { ProductImage } from "./ProductImage";
import { ProductForm } from "./ProductForm";
import { Button } from "../common/Button";

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
  "use no memo";
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
      listPrice: 0,
      price: 0,
      category: "",
      quantity: 0,
      description: "",
    },
  });

  const description = watch("description");

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        imageUrl: product.imageUrl,
        listPrice: product.listPrice,
        price: product.price,
        category: product.category,
        quantity: product.quantity,
        description: product.description,
      });
    } else {
      reset({
        name: "",
        imageUrl: "",
        listPrice: 0,
        price: 0,
        category: "",
        quantity: 0,
        description: "",
      });
    }
  }, [product, reset]);

  const onSubmit = (data: ProductFormValues) => {
    const productData = {
      ...data,
      id: product?.id || 0,
    } as Product;
    onSave(productData);
  };

  if (!product && !isNew) {
    return (
      <section className="flex flex-col items-center justify-center h-full p-8 bg-gray-50/50 border-l border-gray-200 text-gray-400">
        {/* Placeholder content unchanged */}
        <p className="text-lg font-medium text-center">상품을 선택하거나 <br /> 새 상품을 추가해주세요.</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col h-full bg-gray-50/50 border-l border-gray-200 overflow-y-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
        <header className="space-y-1">
          <h2 className="text-3xl font-bold text-gray-900">상품 상세정보</h2>
          <p className="text-gray-500 font-medium">상품 ID: {product?.id}</p>
        </header>

        <ProductImage 
            imageUrl={watch("imageUrl")} 
            name={watch("name")} 
            register={register("imageUrl")} 
            error={errors.imageUrl?.message} 
        />
        <ProductForm 
            register={register} 
            errors={errors} 
            description={description} 
            onDescriptionChange={(e) => setValue("description", e.target.value)} 
        />

        {/* 작업 버튼 */}
        <div className="flex gap-4 pt-4">
          <Button type="submit" className="flex-1 h-14">
            {isNew ? "새 상품 등록하기" : "변경사항 저장하기"}
          </Button>
          {!isNew && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => reset()}
              className="px-6 h-14"
            >
              변경사항 되돌리기
            </Button>
          )}
        </div>

        <div className="pt-12">
          <Button
            type="button"
            variant="danger"
            onClick={() => isNew ? onCancel?.() : onDelete(product!.id)}
            className="w-full h-14"
          >
            {isNew ? "상품 등록 취소하기" : "상품 삭제하기"}
          </Button>
        </div>
      </form>
    </section>
  );
}
