"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, GraduationCap, User } from "lucide-react";
import clsx from "clsx";

const TABS = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/recherche", label: "Recherche", icon: Search },
  { href: "/mes-formations", label: "Formations", icon: GraduationCap },
  { href: "/compte", label: "Compte", icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-1/2 z-40 w-full max-w-app -translate-x-1/2 safe-bottom
                 border-t border-white/5 bg-black/80 backdrop-blur-xl"
    >
      <ul className="flex h-[var(--nav-h)] items-stretch">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className="tap flex h-full flex-col items-center justify-center gap-1"
              >
                <Icon
                  size={22}
                  strokeWidth={active ? 2.4 : 2}
                  className={clsx(
                    "transition-colors",
                    active ? "text-white" : "text-delta-muted"
                  )}
                />
                <span
                  className={clsx(
                    "text-[10px] font-medium transition-colors",
                    active ? "text-white" : "text-delta-muted"
                  )}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
