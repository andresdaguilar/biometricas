"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "@/lib/clsx";

const TABS = [
  { href: "/registro", label: "Registro" },
  { href: "/graficos", label: "Gráficos" },
  { href: "/stats", label: "Stats" },
];

export default function NavTabs() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={clsx(
              "border-b-2 px-3 py-2 text-sm font-medium transition",
              active
                ? "border-neutral-900 text-neutral-900 dark:border-neutral-100 dark:text-neutral-100"
                : "border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
