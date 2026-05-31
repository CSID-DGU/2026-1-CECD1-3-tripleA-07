import { Suspense } from "react";
import ProductDashboardClient from "@/components/products/ProductDashboardClient";

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductDashboardClient />
    </Suspense>
  );
}
