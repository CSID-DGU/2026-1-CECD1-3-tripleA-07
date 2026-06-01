import { useRef, useEffect, useState } from "react";
import { UseFormRegister, FieldErrors, Controller, Control } from "react-hook-form";
import { ProductFormValues } from "@/types/productSchema";
import { Input } from "../common/Input";
import { NumericInput } from "../common/NumericInput";
import { Card } from "../common/Card";
import { Info, CircleDollarSign } from "lucide-react";

interface ProductFormProps {
  register: UseFormRegister<ProductFormValues>;
  control: Control<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  description: string;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  listPrice: number;
  price: number;
  onPriceChange: (price: number) => void;
}

function computeDiscountRate(listPrice: number, price: number) {
  if (!listPrice) return 0;
  return Math.round((1 - price / listPrice) * 100000) / 1000;
}

export function ProductForm({ register, control, errors, description, onDescriptionChange, listPrice, price, onPriceChange }: ProductFormProps) {
  "use no memo";
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { ref: registerRef, ...descriptionField } = register("description");
  const [discountInput, setDiscountInput] = useState(() => String(computeDiscountRate(listPrice, price)));

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [description]);

  useEffect(() => {
    setDiscountInput(String(computeDiscountRate(listPrice, price)));
  }, [listPrice, price]);

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiscountInput(e.target.value);
  };

  const handleDiscountBlur = () => {
    const rate = Number(discountInput);
    if (isNaN(rate)) {
      setDiscountInput(String(computeDiscountRate(listPrice, price)));
      return;
    }
    onPriceChange(Math.round(listPrice * (1 - rate / 100)));
  };

  return (
    <>
      <Card>
        <div className="flex items-center space-x-2">
          <Info size={20} className="text-foreground"></Info>
          <h2 className="text-xl font-medium text-foreground">
            기본 정보
          </h2>
        </div>
        <Input label="상품명" placeholder="(필수) 상품 이름을 입력해 주세요" register={register("name")} error={errors.name?.message} />
        <Input label="카테고리" placeholder="카테고리를 입력해 주세요" register={register("category")} error={errors.category?.message} />
        <Controller
          name="quantity"
          control={control}
          render={({ field }) => (
            <NumericInput label="수량" value={field.value} onChange={field.onChange} error={errors.quantity?.message} />
          )}
        />
        <div className="space-y-2">
          <label htmlFor="description" className="block text-base font-normal text-foreground">상품 설명</label>
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
            placeholder="상품의 특징, 소개 등의 내용을 입력해 주세요"
            className={`w-full px-3 py-2.5 text-foreground border rounded-xl focus:ring-2 focus:ring-primary/48 outline-none transition-all resize-none overflow-hidden ${
              errors.description ? "border-warn/48" : "border-border"
            }`}
          />
          <div className="flex justify-between items-center">
            {errors.description ? <p className="text-xs text-warn">{errors.description.message}</p> : <span />}
            <p className={`text-xs ${description.length > 1500 ? "text-warn" : "text-foreground/48"}`}>{description.length} / 1500</p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center space-x-2">
          <CircleDollarSign size={20} className="text-foreground"></CircleDollarSign>
          <h2 className="text-xl font-medium text-foreground">
            가격
          </h2>
        </div>
        <Controller
          name="listPrice"
          control={control}
          render={({ field }) => (
            <NumericInput label="정가" value={field.value} onChange={field.onChange} error={errors.listPrice?.message} />
          )}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input label="할인율" type="number" suffix="%" value={discountInput} onChange={handleDiscountChange} onBlur={handleDiscountBlur} min={0} max={100} step="any" />
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <NumericInput
                label="판매가"
                value={field.value}
                onChange={(newPrice) => { field.onChange(newPrice); onPriceChange(newPrice); }}
                error={errors.price?.message}
              />
            )}
          />
        </div>
      </Card>
    </>
  );
}
