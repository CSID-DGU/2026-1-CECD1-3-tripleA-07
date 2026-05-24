"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers, History } from "lucide-react";
import { ElementType } from "react";

const NAV_SECTIONS: { label: string; items: { href: string; label: string; icon: ElementType }[] }[] = [
  {
    label: "Management",
    items: [{ href: "/products", label: "상품 목록", icon: Layers }],
  },
  {
    label: "Promotion",
    items: [{ href: "/history", label: "SNS 광고 발행 이력", icon: History }],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-70 h-full px-5 py-9 flex flex-col bg-canvas shrink-0 space-y-4">
      <div className="">
        <h1 className="text-2xl font-bold text-primary">tripleA</h1>
        <h1 className="text-sm font-bold text-foreground/48">여행사</h1>
      </div>

      <nav className="flex-1 overflow-y-auto">
        {NAV_SECTIONS.map(({ label, items }) => (
          <div key={label} className="py-3 border-t border-border">
            {/*..그룹명..*/}
            <div className="h-11 flex items-center justify-start">
              <p className="mb-1 text-base font-medium text-foreground/48 uppercase tracking-wider">
                {label}
              </p>
            </div>
            {/*..아이템..*/}
            {items.map(({ href, label: itemLabel, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`h-11 flex items-center gap-2 px-3 rounded-xl text-sm font-medium transition-colors text-foreground ${
                    isActive ? "bg-foreground/6" : "hover:bg-foreground/6"
                  }`}
                >
                  <Icon
                    size={20}
                    className={isActive ? "text-primary" : "text-foreground/48"}
                  />
                  {itemLabel}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
