import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ProductFormValues } from "@/types/productSchema";
import { Input } from "../common/Input";

interface ProductFormProps {
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  description: string;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function ProductForm({ register, errors, description, onDescriptionChange }: ProductFormProps) {
  "use no memo";
  return (
    <>
      <div className="space-y-6">
        <Input label="상품명" register={register("name")} error={errors.name?.message} />
        <Input label="카테고리" register={register("category")} error={errors.category?.message} />
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Input label="정가" type="number" register={register("listPrice", { valueAsNumber: true })} error={errors.listPrice?.message} />
          <Input label="판매가" type="number" register={register("price", { valueAsNumber: true })} error={errors.price?.message} />
        </div>
        <Input label="수량" type="number" register={register("quantity", { valueAsNumber: true })} error={errors.quantity?.message} />
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-500 uppercase">상품 설명</h3>
        <textarea
          {...register("description")}
          rows={4}
          value={description}
          onChange={onDescriptionChange}
          className={`w-full p-4 text-gray-900 bg-gray-100 border rounded-xl focus:ring-2 focus:ring-[#7e62ca]/50 outline-none transition-all resize-none ${
            errors.description ? "border-red-500" : "border-gray-200"
          }`}
        />
        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
      </div>
    </>
  );
}
