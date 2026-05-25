import { UseFormRegisterReturn } from "react-hook-form";
import { Input } from "../common/Input";
import { Image } from "lucide-react";

interface ProductImageProps {
  imageUrl: string | null;
  name: string;
  register: UseFormRegisterReturn;
  error?: string;
}

export function ProductImage({ imageUrl, name, register, error }: ProductImageProps) {
  return (
    <div className="p-4 rounded-xl space-y-5 border border-border">
      <div className="flex items-center space-x-2">
          <Image size={20} className="text-foreground"></Image>
          <h2 className="text-xl font-medium text-foreground">
            미디어
          </h2>
        </div>
      <div className="w-48 h-48 bg-info border border-border rounded-xl flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-sm text-foreground/48 font-regular">이미지 없음</span>
        )}
      </div>
      <Input
        register={register}
        error={error}
        placeholder="이미지 URL을 입력하세요"
      />
    </div>
  );
}
