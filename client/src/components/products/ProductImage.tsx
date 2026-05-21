import { Input } from "../common/Input";

interface ProductImageProps {
  imageUrl: string | null;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProductImage({ imageUrl, name, onChange }: ProductImageProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-gray-500 uppercase">상품 이미지</h3>
      <div className="w-48 h-48 bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400 font-medium">이미지 없음</span>
        )}
      </div>
      <Input
        name="imageUrl"
        value={imageUrl || ""}
        onChange={onChange}
        placeholder="이미지 URL을 입력하세요"
      />
    </div>
  );
}
