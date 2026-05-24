"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/products", label: "상품 관리" },
  { href: "/history", label: "SNS 광고 발행 이력" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 h-full flex flex-col bg-gray-50 border-r border-gray-200 shrink-0">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">tripleA</h1>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              pathname === href
                ? "bg-[#7e62ca] text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
