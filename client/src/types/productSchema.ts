import { z } from "zod";

export const productSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "상품명을 입력해주세요."),
  imageUrl: z.string().url("올바른 이미지 URL을 입력해주세요.").or(z.literal("")),
  listPrice: z.coerce.number().nonnegative("정가는 0 이상이어야 합니다."),
  price: z.coerce.number().nonnegative("판매가는 0 이상이어야 합니다."),
  category: z.string().min(1, "카테고리를 입력해주세요."),
  quantity: z.coerce.number().int().nonnegative("수량은 0 이상의 정수여야 합니다."),
  description: z.string().min(1, "상품 설명을 입력해주세요."),
});

export type ProductFormValues = z.infer<typeof productSchema>;
