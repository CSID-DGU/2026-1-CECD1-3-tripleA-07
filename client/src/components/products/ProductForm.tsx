import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ProductFormValues } from "@/types/productSchema";
import { Input } from "../common/Input";
import { Info, CircleDollarSign } from "lucide-react";

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
      <div className="p-4 rounded-xl space-y-5 border border-border">
        <div className="flex items-center space-x-2">
          <Info size={20} className="text-foreground"></Info>
          <h2 className="text-xl font-medium text-foreground">
            기본 정보
          </h2>
        </div>
        <Input label="상품명" register={register("name")} error={errors.name?.message} />
        <Input label="카테고리" register={register("category")} error={errors.category?.message} />
        <div className="space-y-2">
          <label htmlFor="description" className="block text-base font-regular text-foreground">상품 설명</label>
          <textarea
            id="description"
            {...register("description")}
            rows={4}
            value={description}
            onChange={onDescriptionChange}
            className={`w-full px-3 py-2.5 text-foreground border rounded-xl focus:ring-2 focus:ring-primary/48 outline-none transition-all resize-none ${
              errors.description ? "border-warn/48" : "border-border"
            }`}
          />
          {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
        </div>
      </div>

      <div className="p-4 rounded-xl space-y-5 border border-border">
        <div className="flex items-center space-x-2">
          <CircleDollarSign size={20} className="text-foreground"></CircleDollarSign>
          <h2 className="text-xl font-medium text-foreground">
            가격
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="정가" type="number" register={register("listPrice", { valueAsNumber: true })} error={errors.listPrice?.message} />
          <Input label="판매가" type="number" register={register("price", { valueAsNumber: true })} error={errors.price?.message} />
        </div>
        <Input label="수량" type="number" register={register("quantity", { valueAsNumber: true })} error={errors.quantity?.message} />
      </div>
    </>
  );
}
