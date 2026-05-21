import { z } from "zod";

export const productSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "상품명을 입력해주세요."),
  imageUrl: z.string().or(z.literal("")),
  listPrice: z.number({ 
    error: "숫자를 입력해 주세요."
  }).nonnegative("정가는 0 이상이어야 합니다."),
  price: z.number({
    error: "숫자를 입력해 주세요."
  }).nonnegative("판매가는 0 이상이어야 합니다."),
  category: z.string().or(z.literal("")),
  quantity: z.number({
    error: "숫자를 입력해 주세요."
  }).int().nonnegative("수량은 0 이상의 정수여야 합니다."),
  description: z.string().or(z.literal("")),
});

export type ProductFormValues = z.infer<typeof productSchema>;
