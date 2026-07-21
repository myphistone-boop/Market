"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Search as SearchIcon, X, Play } from "lucide-react";
import { COURSES } from "@/data/courses";
import { useAppStore } from "@/store/useAppStore";

export default function RecherchePage() {
  const [q, setQ] = useState("");
  const open = useAppStore((s) => s.openCourse);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return COURSES;
    return COURSES.filter((c) =>
      [c.title, c.tagline, c.category, ...c.tags]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [q]);

  const suggestions = q.trim() ? results : COURSES.slice(0, 8);

  return (
    <div className="safe-top px-4 pt-3">
      {/* Barre de recherche */}
      <div className="mb-4 flex items-center gap-2 rounded-lg bg-delta-surface2 px-3">
        <SearchIcon size={18} className="text-white/50" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher une formation, un thème…"
          className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-white/40"
        />
        {q && (
          <button onClick={() => setQ("")} className="tap text-white/50">
            <X size={18} />
          </button>
        )}
      </div>

      <h2 className="mb-3 text-sm font-semibold text-white/70">
        {q.trim() ? `Résultats (${results.length})` : "Explorer les formations"}
      </h2>

      <ul className="space-y-2.5">
        {suggestions.map((c) => (
          <li key={c.id}>
            <button
              onClick={() => open(c.id)}
              className="tap flex w-full items-center gap-3 rounded-lg bg-delta-surface/60 p-1.5 text-left"
            >
              <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-md bg-delta-surface2">
                <Image src={c.poster} alt={c.title} fill sizes="112px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{c.title}</p>
                <p className="truncate text-[12px] text-white/50">{c.category} · {c.level}</p>
              </div>
              <span className="tap mr-1 flex h-8 w-8 items-center justify-center rounded-full border border-white/50">
                <Play size={15} className="ml-0.5 fill-white" />
              </span>
            </button>
          </li>
        ))}
      </ul>

      {results.length === 0 && (
        <p className="mt-10 text-center text-sm text-white/40">
          Aucune formation ne correspond à « {q} ».
        </p>
      )}
    </div>
  );
}
