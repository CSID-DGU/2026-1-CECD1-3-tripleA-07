"use client";

import { useRouter } from "next/navigation";
import { useInspector } from "@/contexts/InspectorContext";
import ProductEditor from "@/components/products/ProductEditor";
import HistoryDetail from "@/components/inspector/HistoryDetail";
import { productService } from "@/services/productService";
import { Product } from "@/types/product";

export default function InspectorPanel() {
  const router = useRouter();
  const { state, close } = useInspector();

  const handleSaveProduct = async (updatedProduct: Product) => {
    try {
      if (state?.type === "product" && state.product === null) {
        await productService.createProduct(updatedProduct);
        alert("상품이 등록되었습니다.");
        close();
      } else {
        await productService.updateProduct(updatedProduct.id, {
          name: updatedProduct.name,
          imageUrl: updatedProduct.imageUrl,
          listPrice: updatedProduct.listPrice,
          price: updatedProduct.price,
          category: updatedProduct.category,
          quantity: updatedProduct.quantity,
          description: updatedProduct.description,
        });
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
        close();
        router.refresh();
      } catch (error) {
        console.error("Failed to delete product:", error);
        alert("삭제에 실패했습니다.");
      }
    }
  };

  return (
    <div className="w-[50%] max-w-140 h-full shrink-0 rounded-xl bg-surface">
      {!state ? (
        <p className="text-sm text-center">
          항목을 선택하면
          <br />
          상세 정보가 표시됩니다.
        </p>
      ) : state.type === "history" ? (
        <HistoryDetail id={state.id} />
      ) : (
        <ProductEditor
          key={state.product === null ? "new" : state.product.id}
          product={state.product}
          isNew={state.product === null}
          onSave={handleSaveProduct}
          onDelete={handleDeleteProduct}
          onCancel={close}
        />
      )}
    </div>
  );
}
