const imageSlots = [
  { id: "image-1", type: "preview" },
  { id: "image-2", type: "preview" },
  { id: "image-3", type: "add" },
] as const;

const categories = [
  { id: "category-1", label: "상의", muted: false },
  { id: "category-2", label: "외투", muted: false },
  { id: "category-3", label: "+", muted: true },
] as const;

export const ProductDetailSection = (): JSX.Element => {
  return (
    <section
      aria-labelledby="product-detail-title"
      className="flex flex-col items-start gap-4 p-8 relative flex-1 self-stretch grow bg-[#0000000a] border-l [border-left-style:solid] border-[#0000001a]"
    >
      <header className="inline-flex flex-col items-start justify-center relative flex-[0_0_auto]">
        <h2
          id="product-detail-title"
          className="relative w-fit mt-[-1.00px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-black text-[28px] tracking-[0] leading-[normal]"
        >
          상품 상세정보
        </h2>
        <p className="relative w-fit [font-family:'Inter-Regular',Helvetica] font-normal text-[#000000a3] text-base tracking-[0] leading-[normal] whitespace-nowrap">
          상품 ID: 1908B
        </p>
      </header>
      <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
        <h3 className="w-fit mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#000000a3] text-base whitespace-nowrap relative tracking-[0] leading-[normal]">
          상품 이미지
        </h3>
        <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
          {imageSlots.map((slot) =>
            slot.type === "preview" ? (
              <div
                key={slot.id}
                aria-label="상품 이미지 미리보기"
                className="relative w-[120px] h-[120px] bg-[#0000000a] rounded-xl border border-solid border-[#0000001a]"
              />
            ) : (
              <button
                key={slot.id}
                type="button"
                aria-label="이미지 추가"
                className="flex w-[120px] h-[120px] items-center justify-center gap-1.5 px-4 py-2.5 relative bg-[#0000000a] rounded-xl overflow-hidden border border-solid border-[#0000001a]"
              >
                <span className="w-fit [font-family:'Inter-Regular',Helvetica] font-normal text-[#000000a3] text-base text-center relative tracking-[0] leading-[normal]">
                  이미지 추가
                  <br />+
                </span>
              </button>
            ),
          )}
        </div>
      </div>
      <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
        <h3 className="w-fit mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#000000a3] text-base whitespace-nowrap relative tracking-[0] leading-[normal]">
          상품명
        </h3>
        <div className="flex items-center gap-1.5 px-3 py-2.5 relative self-stretch w-full flex-[0_0_auto] bg-[#0000000a] rounded-xl overflow-hidden border border-solid border-[#0000001a]">
          <p className="w-fit mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-black text-base whitespace-nowrap relative tracking-[0] leading-[normal]">
            크롭 청자켓
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 relative self-stretch w-full flex-[0_0_auto]">
        <div className="flex flex-col items-start gap-2 relative flex-1 grow">
          <h3 className="w-fit mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#000000a3] text-base whitespace-nowrap relative tracking-[0] leading-[normal]">
            상품 가격
          </h3>
          <div className="flex items-center gap-1.5 px-3 py-2.5 relative self-stretch w-full flex-[0_0_auto] bg-[#0000000a] rounded-xl overflow-hidden border border-solid border-[#0000001a]">
            <p className="w-fit mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-black text-base whitespace-nowrap relative tracking-[0] leading-[normal]">
              75,900
            </p>
          </div>
        </div>
        <div className="flex flex-col items-start gap-2 relative flex-1 grow">
          <h3 className="w-fit mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#000000a3] text-base whitespace-nowrap relative tracking-[0] leading-[normal]">
            수량
          </h3>
          <div className="flex items-center gap-1.5 px-3 py-2.5 relative self-stretch w-full flex-[0_0_auto] bg-[#0000000a] rounded-xl overflow-hidden border border-solid border-[#0000001a]">
            <p className="w-fit mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-black text-base whitespace-nowrap relative tracking-[0] leading-[normal]">
              9,000
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
        <h3 className="w-fit mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#000000a3] text-base whitespace-nowrap relative tracking-[0] leading-[normal]">
          카테고리
        </h3>
        <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
          {categories.map((category) => (
            <div
              key={category.id}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 relative flex-[0_0_auto] bg-[#0000000a] rounded-xl overflow-hidden border border-solid border-[#0000001a]"
            >
              <span
                className={`w-fit mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-base whitespace-nowrap relative tracking-[0] leading-[normal] ${
                  category.muted ? "text-[#000000a3]" : "text-black"
                }`}
              >
                {category.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
        <h3 className="w-fit mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#000000a3] text-base whitespace-nowrap relative tracking-[0] leading-[normal]">
          상품 설명
        </h3>
        <div className="flex items-center gap-1.5 px-3 py-2.5 relative self-stretch w-full flex-[0_0_auto] bg-[#0000000a] rounded-xl overflow-hidden border border-solid border-[#0000001a]">
          <p className="flex-1 mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-black text-base relative tracking-[0] leading-[normal]">
            상품 설명 예시입니다. 상품 설명 예시입니다. 상품 설명 예시입니다.
            <br />
            상품 설명 예시입니다. 상품 설명 예시입니다.
            <br />
            상품 설명 예시입니다. 상품 설명 예시입니다. 상품 설명 예시입니다.
            상품 설명 예시입니다. 상품 설명 예시입니다.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 relative self-stretch w-full flex-[0_0_auto]">
        <button
          type="button"
          className="inline-flex flex-col h-12 items-center justify-center gap-2.5 px-6 py-2.5 relative flex-[0_0_auto] bg-[#7e62ca] rounded-xl overflow-hidden"
        >
          <span className="w-fit [font-family:'Inter-Medium',Helvetica] font-medium text-white text-sm relative tracking-[0] leading-[normal]">
            변경사항 저장하기
          </span>
        </button>
        <button
          type="button"
          className="inline-flex flex-col h-12 items-center justify-center gap-2.5 px-6 py-2.5 relative flex-[0_0_auto] rounded-xl overflow-hidden"
        >
          <span className="w-fit [font-family:'Inter-Medium',Helvetica] font-medium text-[#7e62ca] text-sm relative tracking-[0] leading-[normal]">
            변경사항 되돌리기
          </span>
        </button>
      </div>
      <div aria-hidden="true" className="relative w-[100px] h-[100px]" />
      <button
        type="button"
        className="flex flex-col h-12 items-center justify-center gap-2.5 px-6 py-2.5 relative self-stretch w-full rounded-xl overflow-hidden"
      >
        <span className="w-fit [font-family:'Inter-Medium',Helvetica] font-medium text-[#ca6262] text-sm relative tracking-[0] leading-[normal]">
          상품 삭제하기
        </span>
      </button>
    </section>
  );
};
