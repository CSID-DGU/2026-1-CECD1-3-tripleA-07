import { useId, useMemo, useState } from "react";
import image from "./image.svg";
import vector3 from "./vector-3.svg";

type ProductRow = {
  id: string;
  name: string;
  price: string;
  category: string;
  quantity: string;
  description: string;
  highlighted?: boolean;
};

export const ProductListSection = (): JSX.Element => {
  const searchId = useId();
  const sortId = useId();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortValue, setSortValue] = useState("상품 등록 순");
  const [currentPage, setCurrentPage] = useState(1);

  const products: ProductRow[] = [
    {
      id: "12aE9",
      name: "코튼 가디건",
      price: "32,900",
      category: "상의",
      quantity: "10,000",
      description: "상품 설명",
    },
    {
      id: "12aE9",
      name: "코튼 가디건",
      price: "32,900",
      category: "상의",
      quantity: "10,000",
      description: "상품 설명",
    },
    {
      id: "1908B",
      name: "크롭 청자켓",
      price: "75,900",
      category: "상의, 외투",
      quantity: "9,000",
      description: "상품 설명",
      highlighted: true,
    },
    {
      id: "12aE9",
      name: "코튼 가디건",
      price: "32,900",
      category: "상의",
      quantity: "10,000",
      description: "상품 설명",
    },
    {
      id: "12aE9",
      name: "코튼 가디건",
      price: "32,900",
      category: "상의",
      quantity: "10,000",
      description: "상품 설명",
    },
    {
      id: "12aE9",
      name: "코튼 가디건",
      price: "32,900",
      category: "상의",
      quantity: "10,000",
      description: "상품 설명",
    },
    {
      id: "12aE9",
      name: "코튼 가디건",
      price: "32,900",
      category: "상의",
      quantity: "10,000",
      description: "상품 설명",
    },
    {
      id: "12aE9",
      name: "코튼 가디건",
      price: "32,900",
      category: "상의",
      quantity: "10,000",
      description: "상품 설명",
    },
    {
      id: "12aE9",
      name: "코튼 가디건",
      price: "32,900",
      category: "상의",
      quantity: "10,000",
      description: "상품 설명",
    },
    {
      id: "12aE9",
      name: "코튼 가디건",
      price: "32,900",
      category: "상의",
      quantity: "10,000",
      description: "상품 설명",
    },
    {
      id: "12aE9",
      name: "코튼 가디건",
      price: "32,900",
      category: "상의",
      quantity: "10,000",
      description: "상품 설명",
    },
    {
      id: "12aE9",
      name: "코튼 가디건",
      price: "32,900",
      category: "상의",
      quantity: "10,000",
      description: "상품 설명",
    },
    {
      id: "12aE9",
      name: "코튼 가디건",
      price: "32,900",
      category: "상의",
      quantity: "10,000",
      description: "상품 설명",
    },
    {
      id: "12aE9",
      name: "코튼 가디건",
      price: "32,900",
      category: "상의",
      quantity: "10,000",
      description: "상품 설명",
    },
    {
      id: "12aE9",
      name: "코튼 가디건",
      price: "32,900",
      category: "상의",
      quantity: "10,000",
      description: "상품 설명",
    },
    {
      id: "12aE9",
      name: "코튼 가디건",
      price: "32,900",
      category: "상의",
      quantity: "10,000",
      description: "상품 설명",
    },
    {
      id: "12aE9",
      name: "코튼 가디건",
      price: "32,900",
      category: "상의",
      quantity: "10,000",
      description: "상품 설명",
    },
    {
      id: "12aE9",
      name: "코튼 가디건",
      price: "32,900",
      category: "상의",
      quantity: "10,000",
      description: "상품 설명",
    },
    {
      id: "12aE9",
      name: "코튼 가디건",
      price: "32,900",
      category: "상의",
      quantity: "10,000",
      description: "상품 설명",
    },
    {
      id: "12aE9",
      name: "코튼 가디건",
      price: "32,900",
      category: "상의",
      quantity: "10,000",
      description: "상품 설명",
    },
  ];

  const pages = [1, 2, 3, 4, 5, 6];

  const filteredProducts = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    if (!normalized) {
      return products;
    }

    return products.filter((product) =>
      [
        product.id,
        product.name,
        product.price,
        product.category,
        product.quantity,
        product.description,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [products, searchTerm]);

  return (
    <section
      className="flex flex-col items-start gap-4 p-8 relative flex-1 self-stretch grow"
      aria-labelledby="product-list-heading"
    >
      <h2
        id="product-list-heading"
        className="relative w-fit mt-[-1.00px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-black text-[28px] tracking-[0] leading-[normal]"
      >
        상품 목록
      </h2>
      <div className="relative self-stretch w-full">
        <label htmlFor={searchId} className="sr-only">
          상품 검색
        </label>
        <div className="flex h-10 items-center gap-1.5 px-3 py-0 relative self-stretch w-full bg-[#0000000a] rounded-xl overflow-hidden border border-solid border-[#0000001a] focus-within:ring-1 focus-within:ring-[#7e62ca]">
          <div
            className="relative w-[22px] h-[22px] shrink-0"
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-[url(/vector.svg)] bg-[100%_100%]" />
            <img
              className="absolute w-[87.50%] h-[87.50%] top-[12.50%] left-[12.50%]"
              alt=""
              src={image}
            />
          </div>
          <input
            id={searchId}
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="검색어를 입력해주세요"
            className="h-full w-full bg-transparent outline-none border-0 p-0 [font-family:'Inter-Medium',Helvetica] font-medium text-black placeholder:text-[#0000005c] text-base tracking-[0] leading-[normal]"
          />
        </div>
      </div>
      <div className="flex items-center gap-3 relative self-stretch w-full flex-[0_0_auto]">
        <label
          htmlFor={sortId}
          className="w-fit [font-family:'Inter-Medium',Helvetica] font-medium text-black text-sm relative tracking-[0] leading-[normal]"
        >
          정렬 기준
        </label>
        <div className="relative inline-flex">
          <select
            id={sortId}
            value={sortValue}
            onChange={(event) => setSortValue(event.target.value)}
            className="appearance-none inline-flex h-10 items-center gap-1 px-4 py-0 pr-9 relative flex-[0_0_auto] rounded-xl overflow-hidden border border-solid border-[#0000001a] bg-white [font-family:'Inter-Medium',Helvetica] font-medium text-black text-sm tracking-[0] leading-[normal] outline-none"
            aria-label="정렬 기준"
          >
            <option>상품 등록 순</option>
          </select>
          <div
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6"
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-[url(/vector-2.svg)] bg-[100%_100%]" />
            <img
              className="absolute w-[75.00%] h-[64.21%] top-[35.79%] left-[25.00%]"
              alt=""
              src={vector3}
            />
          </div>
        </div>
        <div className="relative flex-1 self-stretch grow" />
        <button
          type="button"
          className="inline-flex flex-col h-10 items-center justify-center gap-2.5 px-4 py-2.5 relative flex-[0_0_auto] bg-[#7e62ca] rounded-xl overflow-hidden"
        >
          <span className="w-fit [font-family:'Inter-Medium',Helvetica] font-medium text-white text-sm relative tracking-[0] leading-[normal]">
            새 상품 추가 +
          </span>
        </button>
      </div>
      <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] border-b [border-bottom-style:solid] border-[#0000001a] overflow-x-auto">
        <div className="min-w-full">
          <div className="flex h-10 items-start relative self-stretch w-full bg-[#0000000a] border-t [border-top-style:solid] border-[#0000001a]">
            <div className="flex flex-col w-[72px] items-center justify-center gap-2.5 p-2.5 relative self-stretch border-r [border-right-style:solid] border-[#0000001a]">
              <div className="relative w-fit [font-family:'Inter-Regular',Helvetica] font-normal text-black text-[13px] tracking-[0] leading-[normal]">
                상품 ID
              </div>
            </div>
            <div className="flex flex-col w-[121px] items-center justify-center gap-2.5 p-2.5 relative self-stretch border-r [border-right-style:solid] border-[#0000001a]">
              <div className="w-fit [font-family:'Inter-Regular',Helvetica] font-normal text-black text-[13px] relative tracking-[0] leading-[normal]">
                상품 명
              </div>
            </div>
            <div className="flex flex-col w-[87px] items-center justify-center gap-2.5 p-2.5 relative self-stretch border-r [border-right-style:solid] border-[#0000001a]">
              <div className="w-fit [font-family:'Inter-Regular',Helvetica] font-normal text-black text-[13px] relative tracking-[0] leading-[normal]">
                가격
              </div>
            </div>
            <div className="flex flex-col w-[106px] items-center justify-center gap-2.5 p-2.5 relative self-stretch border-r [border-right-style:solid] border-[#0000001a]">
              <div className="w-fit [font-family:'Inter-Regular',Helvetica] font-normal text-black text-[13px] relative tracking-[0] leading-[normal]">
                카테고리
              </div>
            </div>
            <div className="flex flex-col w-[84px] items-center justify-center gap-2.5 p-2.5 relative self-stretch border-r [border-right-style:solid] border-[#0000001a]">
              <div className="w-fit [font-family:'Inter-Regular',Helvetica] font-normal text-black text-[13px] relative tracking-[0] leading-[normal]">
                수량
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-2.5 p-2.5 relative flex-1 self-stretch grow border-r [border-right-style:solid] border-[#0000001a] min-w-[133px]">
              <div className="w-fit [font-family:'Inter-Regular',Helvetica] font-normal text-black text-[13px] relative tracking-[0] leading-[normal]">
                상품 설명
              </div>
            </div>
          </div>
          {filteredProducts.map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              className={`flex h-10 items-start relative self-stretch w-full border-t [border-top-style:solid] border-[#0000001a] ${
                product.highlighted ? "bg-[#7e62ca29]" : ""
              }`}
            >
              <div className="flex flex-col w-[72px] items-center justify-center gap-2.5 p-2.5 relative self-stretch border-r [border-right-style:solid] border-[#0000001a]">
                <div className="relative w-fit [font-family:'Inter-Regular',Helvetica] font-normal text-black text-[13px] tracking-[0] leading-[normal]">
                  {product.id}
                </div>
              </div>
              <div className="flex flex-col w-[121px] items-center justify-center gap-2.5 p-2.5 relative self-stretch border-r [border-right-style:solid] border-[#0000001a]">
                <div className="w-fit [font-family:'Inter-Regular',Helvetica] font-normal text-black text-[13px] relative tracking-[0] leading-[normal]">
                  {product.name}
                </div>
              </div>
              <div className="flex flex-col w-[87px] items-center justify-center gap-2.5 p-2.5 relative self-stretch border-r [border-right-style:solid] border-[#0000001a]">
                <div className="w-fit [font-family:'Inter-Regular',Helvetica] font-normal text-black text-[13px] relative tracking-[0] leading-[normal]">
                  {product.price}
                </div>
              </div>
              <div className="flex flex-col w-[106px] items-center justify-center gap-2.5 p-2.5 relative self-stretch border-r [border-right-style:solid] border-[#0000001a]">
                <div className="w-fit [font-family:'Inter-Regular',Helvetica] font-normal text-black text-[13px] relative tracking-[0] leading-[normal]">
                  {product.category}
                </div>
              </div>
              <div className="flex flex-col w-[84px] items-center justify-center gap-2.5 p-2.5 relative self-stretch border-r [border-right-style:solid] border-[#0000001a]">
                <div className="w-fit [font-family:'Inter-Regular',Helvetica] font-normal text-black text-[13px] relative tracking-[0] leading-[normal]">
                  {product.quantity}
                </div>
              </div>
              <div className="flex flex-col items-center justify-center gap-2.5 p-2.5 relative flex-1 self-stretch grow border-r [border-right-style:solid] border-[#0000001a] min-w-[133px]">
                <div className="w-fit [font-family:'Inter-Regular',Helvetica] font-normal text-black text-[13px] relative tracking-[0] leading-[normal]">
                  {product.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <nav
        className="flex items-center justify-center gap-2 relative self-stretch w-full flex-[0_0_auto]"
        aria-label="페이지네이션"
      >
        {pages.map((page) => {
          const active = currentPage === page;

          return (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col w-6 h-6 items-center justify-center gap-2.5 relative rounded-md overflow-hidden border border-solid border-[#0000001a] ${
                active ? "bg-[#7e62ca]" : "bg-[#0000000a]"
              }`}
            >
              <span
                className={`relative w-fit [font-family:'Inter-Regular',Helvetica] font-normal text-sm tracking-[0] leading-[normal] ${
                  active ? "text-white" : "text-black"
                }`}
              >
                {page}
              </span>
            </button>
          );
        })}
      </nav>
    </section>
  );
};
