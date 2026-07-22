"use client";

import { useEffect, useState } from "react";
import { CATEGORIES } from "@/data/courses";
import clsx from "clsx";

type Props = {
  active: string;
  onSelect: (c: string) => void;
};

export function TopBar({ active, onSelect }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "fixed top-0 left-1/2 z-30 w-full max-w-app -translate-x-1/2 safe-top transition-colors duration-300",
        scrolled ? "bg-black/85 backdrop-blur-md" : "bg-transparent"
      )}
    >
      <div className="flex items-center justify-between px-4 pt-3">
        <span className="chrome-text select-none text-2xl font-extrabold tracking-[0.15em]">
          DELTA
        </span>
      </div>

      <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto px-4 pb-2.5">
        {CATEGORIES.map((c) => {
          const on = c === active;
          return (
            <button
              key={c}
              onClick={() => onSelect(c)}
              className={clsx(
                "tap shrink-0 rounded-full border px-3.5 py-1 text-[13px] font-medium transition-colors",
                on
                  ? "border-white bg-white text-black"
                  : "border-white/30 bg-black/20 text-white"
              )}
            >
              {c}
            </button>
          );
        })}
      </div>
    </header>
  );
}
