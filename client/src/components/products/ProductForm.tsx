import { Input } from "../common/Input";

interface ProductFormProps {
  formData: any;
  priceInput: string;
  listPriceInput: string;
  quantityInput: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function ProductForm({ formData, priceInput, listPriceInput, quantityInput, onChange }: ProductFormProps) {
  return (
    <>
      <div className="space-y-6">
        <Input label="상품명" name="name" value={formData.name || ""} onChange={onChange} />
        <Input label="카테고리" name="category" value={formData.category || ""} onChange={onChange} />
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Input label="정가" name="listPrice" value={listPriceInput} onChange={onChange} />
          <Input label="판매가" name="price" value={priceInput} onChange={onChange} />
        </div>
        <Input label="수량" name="quantity" value={quantityInput} onChange={onChange} />
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-500 uppercase">상품 설명</h3>
        <textarea
          name="description"
          rows={4}
          value={formData.description || ""}
          onChange={onChange}
          className="w-full p-4 text-gray-900 bg-gray-100 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7e62ca]/50 outline-none transition-all resize-none"
        />
      </div>
    </>
  );
}
