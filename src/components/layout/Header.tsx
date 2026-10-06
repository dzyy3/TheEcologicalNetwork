"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Map", index: "01" },
  { href: "/network", label: "The Network", index: "02" },
  { href: "/need", label: "Where Support Is Needed", index: "03" },
  { href: "/add", label: "Add Organization", index: "04" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-sand/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-4 py-3.5 md:px-6">
        <Link href="/" className="group min-w-0">
          <span className="flex items-center gap-3">
            <span className="hidden h-8 w-px bg-canopy/40 sm:block" />
            <span>
              <span className="block font-display text-[1.25rem] font-medium leading-none tracking-tight text-ink transition group-hover:text-canopy md:text-[1.4rem]">
                The Ecological Network
              </span>
              <span className="mt-1.5 hidden font-mono text-[10px] uppercase tracking-label text-moss sm:block">
                National Ecological Registry
              </span>
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-baseline gap-2 border-b-2 px-3 py-2 text-[13px] transition duration-200",
                  active
                    ? "border-canopy font-medium text-ink"
                    : "border-transparent text-ink-muted hover:border-lichen hover:text-canopy"
                )}
              >
                <span className="font-mono text-[9px] tracking-label text-ink-faint group-hover:text-moss">
                  {item.index}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="btn-ghost lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-ink/10 bg-sand-bright px-4 py-3 lg:hidden">
          <ul className="flex flex-col gap-0.5">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-ink hover:bg-canopy/[0.05] hover:text-canopy"
                >
                  <span className="font-mono text-[10px] text-ink-faint">{item.index}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
