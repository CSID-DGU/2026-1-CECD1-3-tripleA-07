"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers, History, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { ElementType, useState } from "react";

const NAV_SECTIONS: { label: string; items: { href: string; label: string; icon: ElementType }[] }[] = [
  {
    label: "Management",
    items: [{ href: "/products", label: "상품 목록", icon: Layers }],
  },
  {
    label: "Promotion",
    items: [{ href: "/ads", label: "SNS 광고 발행 이력", icon: History }],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`${collapsed ? "w-[76px]" : "w-66"} h-full px-4 py-9 flex flex-col bg-canvas shrink-0 space-y-4 overflow-hidden transition-[width] duration-200`}
    >
      <div className="flex items-center justify-between">
        <div
          className={`overflow-hidden whitespace-nowrap transition-all duration-150 ${
            collapsed ? "w-0 opacity-0" : "opacity-100"
          }`}
        >
          <h1 className="text-2xl font-bold text-primary">tripleA</h1>
          <p className="text-sm font-normal text-foreground">여행사</p>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-foreground/6 transition-colors shrink-0"
        >
          {collapsed ? <PanelLeftOpen size={20} className="text-foreground" /> : <PanelLeftClose size={20} className="text-foreground/48" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto">
        {NAV_SECTIONS.map(({ label, items }) => (
          <div key={label} className="py-3 border-t border-border">
            <div
              className={`overflow-hidden whitespace-nowrap transition-all duration-150 ${
                collapsed ? "h-0 opacity-0" : "h-11 opacity-100"
              }`}
            >
              <div className="h-11 flex items-center justify-start">
                <h2 className="text-base font-medium text-foreground/48 uppercase tracking-wider">
                  {label}
                </h2>
              </div>
            </div>
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
                    className={`shrink-0 ${isActive ? "text-primary" : "text-foreground/48"}`}
                  />
                  <span
                    className={`overflow-hidden whitespace-nowrap transition-all duration-150 ${
                      collapsed ? "w-0 opacity-0" : "opacity-100"
                    }`}
                  >
                    {itemLabel}
                  </span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
