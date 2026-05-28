import { useRef, useEffect, useState } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ProductFormValues } from "@/types/productSchema";
import { Input } from "../common/Input";
import { Info, CircleDollarSign } from "lucide-react";

interface ProductFormProps {
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  description: string;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  listPrice: number;
  price: number;
  onPriceChange: (price: number) => void;
}

function computeDiscountRate(listPrice: number, price: number) {
  if (!listPrice) return 0;
  return Math.round((1 - price / listPrice) * 100);
}

export function ProductForm({ register, errors, description, onDescriptionChange, listPrice, price, onPriceChange }: ProductFormProps) {
  "use no memo";
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { ref: registerRef, ...descriptionField } = register("description");
  const [discountRate, setDiscountRate] = useState(() => computeDiscountRate(listPrice, price));
  const userChangedDiscount = useRef(false);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [description]);

  useEffect(() => {
    if (!userChangedDiscount.current) {
      setDiscountRate(computeDiscountRate(listPrice, price));
    }
    userChangedDiscount.current = false;
  }, [listPrice, price]);

  const handleDiscountRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rate = Number(e.target.value);
    setDiscountRate(rate);
    userChangedDiscount.current = true;
    onPriceChange(Math.round(listPrice * (1 - rate / 100)));
  };

  return (
    <>
      <div className="p-4 rounded-xl space-y-5 border border-border">
        <div className="flex items-center space-x-2">
          <Info size={20} className="text-foreground"></Info>
          <h2 className="text-xl font-medium text-foreground">
            기본 정보
          </h2>
        </div>
        <Input label="상품명" placeholder="(필수) 상품 이름을 입력해주세요." register={register("name")} error={errors.name?.message} />
        <Input label="카테고리" placeholder="카테고리를 입력해주세요." register={register("category")} error={errors.category?.message} />
        <Input label="수량" type="number" register={register("quantity", { valueAsNumber: true })} error={errors.quantity?.message} />
        <div className="space-y-2">
          <label htmlFor="description" className="block text-base font-regular text-foreground">상품 설명</label>
          <textarea
            id="description"
            {...descriptionField}
            ref={(el) => {
              registerRef(el);
              textareaRef.current = el;
            }}
            rows={2}
            value={description}
            onChange={onDescriptionChange}
            placeholder="상품의 특징, 소개 등의 내용을 입력해주세요."
            className={`w-full px-3 py-2.5 text-foreground border rounded-xl focus:ring-2 focus:ring-primary/48 outline-none transition-all resize-none overflow-hidden ${
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
        <Input label="정가" type="number" register={register("listPrice", { valueAsNumber: true })} error={errors.listPrice?.message} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="할인율" type="number" suffix="%" value={discountRate} onChange={handleDiscountRateChange} min={0} max={100} />
          <Input label="판매가" type="number" register={register("price", { valueAsNumber: true })} error={errors.price?.message} />
        </div>
      </div>
    </>
  );
}
