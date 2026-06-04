"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck, RotateCcw, Save } from "lucide-react";
import { Product } from "@/types/product";
import { productSchema, ProductFormValues, DEFAULT_PRODUCT_FORM_VALUES } from "@/types/productSchema";
import { productService } from "@/services/productService";
import { useInspector } from "@/contexts/InspectorContext";
import { ProductImage } from "./ProductImage";
import { ProductForm } from "./ProductForm";
import { Button } from "../common/Button";

type ProductEditorProps = {
  product?: Product;
};

export default function ProductEditor({
  product,
}: ProductEditorProps) {
  "use no memo";
  const isNew = !product;
  const { close, onSaved } = useInspector();
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: DEFAULT_PRODUCT_FORM_VALUES,
  });

  const description = watch("description");
  const listPrice = watch("listPrice");
  const price = watch("price");

  useEffect(() => {
    if (listPrice && price > listPrice) {
      setValue("price", listPrice);
    }
  }, [listPrice]);

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        imageUrl: product.imageUrl ?? "",
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
      if (!product) {
        await productService.createProduct(data);
        alert("상품이 등록되었습니다.");
      } else {
        await productService.updateProduct(product.id, data);
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

  return (
    <section className="flex flex-col flex-1 min-h-0">
      <form 
        id="product-editor-form" 
        onSubmit={handleSubmit(onSubmit)} 
        onKeyDown={(e) => { 
          if (e.key === "Enter") { 
            e.preventDefault(); 
            (e.target as HTMLElement).blur(); 
          } 
        }} 
        className="flex-1 overflow-y-auto px-6 pb-6 space-y-4"
      >
        {product && (
          <p className="text-sm font-medium text-foreground/48">
            상품 ID: {product.id}
          </p>
        )}
        <ProductForm
            register={register}
            control={control}
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

      </form>

      <div className="px-6 py-4 shrink-0 border-t border-border">
        {isNew ? (
          <Button type="submit" form="product-editor-form" className="w-full">
            <CircleCheck size={16} />
            등록
          </Button>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Button type="button" variant="secondary" onClick={() => reset()} disabled={!isDirty}>
              <RotateCcw size={16} />
              변경사항 취소
            </Button>
            <Button type="submit" form="product-editor-form" disabled={!isDirty}>
              <Save size={16} />
              저장
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
