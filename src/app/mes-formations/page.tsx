"use client";

import Image from "next/image";
import { Play, Plus } from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { getCourse } from "@/data/courses";
import { totalDuration } from "@/lib/format";

export default function MesFormationsPage() {
  const purchased = useAppStore((s) => s.purchased);
  const myList = useAppStore((s) => s.myList);
  const progress = useAppStore((s) => s.progress);
  const open = useAppStore((s) => s.openCourse);

  const owned = purchased.map((id) => getCourse(id)!).filter(Boolean);
  const saved = myList
    .filter((id) => !purchased.includes(id))
    .map((id) => getCourse(id)!)
    .filter(Boolean);

  return (
    <div className="safe-top px-4 pt-4">
      <h1 className="mb-5 text-2xl font-extrabold tracking-tight">Mes formations</h1>

      {owned.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="space-y-3">
          {owned.map((c) => {
            const ratio = progress[c.id] ?? 0;
            return (
              <li key={c.id}>
                <button
                  onClick={() => open(c.id)}
                  className="tap flex w-full gap-3 rounded-xl bg-delta-surface p-2 text-left"
                >
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg">
                    <Image src={c.poster} alt={c.title} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="truncate text-[15px] font-bold">{c.title}</p>
                    <p className="truncate text-[12px] text-white/50">
                      {c.lessons.length} leçons · {totalDuration(c.lessons.length)}
                    </p>
                    <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-white/15">
                      <div className="h-full rounded-full bg-delta-red" style={{ width: `${Math.max(4, ratio * 100)}%` }} />
                    </div>
                    <span className="mt-1 text-[11px] text-white/45">
                      {Math.round(ratio * 100)}% terminé
                    </span>
                    <span className="mt-auto flex items-center gap-1.5 pt-2 text-[13px] font-semibold text-white">
                      <Play size={15} className="fill-white" />
                      {ratio > 0 ? "Reprendre" : "Commencer"}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {saved.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-bold">Ma liste</h2>
          <div className="grid grid-cols-3 gap-2.5">
            {saved.map((c) => (
              <button
                key={c.id}
                onClick={() => open(c.id)}
                className="tap relative overflow-hidden rounded-xl bg-delta-surface2"
                style={{ aspectRatio: "2/3" }}
              >
                <Image src={c.poster} alt={c.title} fill sizes="140px" className="object-cover" />
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-16 flex flex-col items-center text-center">
      <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-delta-surface2">
        <Plus size={28} className="text-white/60" />
      </span>
      <p className="text-base font-semibold">Aucune formation pour l'instant</p>
      <p className="mt-1 max-w-[240px] text-sm text-white/50">
        Explore le catalogue et débloque ta première formation.
      </p>
      <Link
        href="/"
        className="tap mt-5 rounded-md bg-delta-red px-5 py-2.5 text-sm font-bold"
      >
        Voir le catalogue
      </Link>
    </div>
  );
}
