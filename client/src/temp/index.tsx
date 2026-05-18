import { ProductDetailSection } from "./ProductDetailSection";
import { ProductListSection } from "./ProductListSection";

export const Desktop = (): JSX.Element => {
  return (
    <main
      className="relative flex min-h-screen w-full items-stretch bg-white"
      data-id="desktop-root"
    >
      <section
        className="flex min-h-screen w-1/2 min-w-0 items-stretch"
        aria-label="Product list section"
        data-id="product-list-section-wrapper"
      >
        <ProductListSection />
      </section>
      <section
        className="flex min-h-screen w-1/2 min-w-0 items-stretch"
        aria-label="Product detail section"
        data-id="product-detail-section-wrapper"
      >
        <ProductDetailSection />
      </section>
    </main>
  );
};

export default Desktop;
