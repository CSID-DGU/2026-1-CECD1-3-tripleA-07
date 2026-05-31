"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product } from "@/types/product";
import { productSchema, ProductFormValues, DEFAULT_PRODUCT_FORM_VALUES } from "@/types/productSchema";
import { productService } from "@/services/productService";
import { useInspector } from "@/contexts/InspectorContext";
import { ProductImage } from "./ProductImage";
import { ProductForm } from "./ProductForm";
import { Button } from "../common/Button";
import { PageHeader } from "../common/PageHeader";

interface ProductEditorProps {
  product?: Product;
  onCancel?: () => void;
}

export default function ProductEditor({
  product,
  onCancel,
}: ProductEditorProps) {
  const isNew = !product;
  "use no memo";
  const { close, onSaved } = useInspector();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: DEFAULT_PRODUCT_FORM_VALUES,
  });

  const description = watch("description");
  const listPrice = watch("listPrice");
  const price = watch("price");

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
      reset(DEFAULT_PRODUCT_FORM_VALUES);
    }
  }, [product, reset]);

  const onSubmit = async (data: ProductFormValues) => {
    try {
      if (isNew) {
        await productService.createProduct(data as Product);
        alert("상품이 등록되었습니다.");
      } else {
        if (!product) return;
        await productService.updateProduct(product.id, data as Product);
        alert("변경사항이 저장되었습니다.");
      }
      onSaved();
      close();
    } catch (error) {
      console.error("Failed to save product:", error);
      alert("저장에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    if (!product || !confirm("정말 이 상품을 삭제하시겠습니까?")) return;
    try {
      await productService.deleteProduct(product.id);
      onSaved();
      close();
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("삭제에 실패했습니다.");
    }
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
      <div className="px-6 pt-6 pb-4 shrink-0 space-y-4">
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
            <Button key="submit" type="submit" form="product-editor-form" className="h-10 px-5">
              {isNew ? "등록" : "저장"}
            </Button>,
          ]}
        />

        <p className="text-sm font-medium text-foreground/48">
          {product ? `상품 ID: ${product.id}` : undefined}
        </p>
      </div>

      <form id="product-editor-form" onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto px-6 pb-6 space-y-4">
        <ProductForm
            register={register}
            errors={errors}
            description={description}
            onDescriptionChange={(e) => setValue("description", e.target.value)}
            listPrice={listPrice}
            price={price}
            onPriceChange={(newPrice) => setValue("price", newPrice)}
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
              onClick={handleDelete}
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
