"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product } from "@/types/product";
import { productSchema, ProductFormValues } from "@/types/productSchema";
import { ProductImage } from "./ProductImage";
import { ProductForm } from "./ProductForm";
import { Button } from "../common/Button";
import { PageHeader } from "../common/PageHeader";

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

  // InspectorPanel이 product와 isNew 검증 로직을 담당하도록 변경되어 해당 코드는 현재 도달할 수 없는 코드라 주석처리함.
  // if (!product && !isNew) {
  //   return (
  //     <section className="flex flex-col items-center justify-center h-full p-8 bg-gray-50/50 border-l border-gray-200 text-gray-400">
  //       <p className="text-lg font-medium text-center">상품을 선택하거나 <br /> 새 상품을 추가해주세요.</p>
  //     </section>
  //   );
  // }

  return (
    <section className="flex flex-col h-full">
      <div className="px-6 pt-6 pb-4 shrink-0">
        <PageHeader
          title={isNew? "상품 추가하기" : "상품 상세정보"}
          actions={[
            ...(!isNew ? [
              <Button key="revert" type="button" variant="secondary" onClick={() => reset()} className="h-10 px-5">
                변경사항 취소
              </Button>
            ] : [
              <Button
                type="button"
                variant="danger"
                onClick={() => onCancel?.()}
                className="h-10"
              >
                상품 등록 취소
              </Button>
            ]),
            ,
            <Button key="submit" type="submit" form="product-editor-form" className="h-10 px-5">
              {isNew ? "등록" : "저장"}
            </Button>,
          ]}
        />

        <p className="test-sm font-medium text-foreground/48">
          {product ? `상품 ID: ${product.id}` : undefined}
        </p>
      </div>

      <form id="product-editor-form" onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto px-6 pb-6 space-y-4">
        <ProductForm
            register={register}
            errors={errors}
            description={description}
            onDescriptionChange={(e) => setValue("description", e.target.value)}
        />

        <ProductImage
          imageUrl={watch("imageUrl")}
          name={watch("name")}
          register={register("imageUrl")}
          error={errors.imageUrl?.message}
        />

        {!isNew && (
          <div className="flex justify-end">
            <Button
              type="button"
              variant="danger"
              onClick={() => onDelete(product!.id)}
              className="h-10"
            >
              상품 삭제하기
            </Button>
          </div>
        )}
      </form>
    </section>
  );
}
