"use client";

import Image from "next/image";
import { Play, Plus, Check, Info } from "lucide-react";
import type { Course } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import clsx from "clsx";

export function Hero({ course }: { course: Course }) {
  const open = useAppStore((s) => s.openCourse);
  const inList = useAppStore((s) => s.myList.includes(course.id));
  const toggle = useAppStore((s) => s.toggleMyList);

  return (
    <section className="relative -mt-[1px] mb-2">
      <div className="relative h-[74dvh] w-full">
        <Image
          src={course.backdrop}
          alt={course.title}
          fill
          priority
          sizes="460px"
          className="object-cover"
        />
        {/* Dégradés : haut pour le topbar, bas pour fondu vers le contenu */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />

        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-4 pb-4">
          <h1 className="mb-2 text-center text-[26px] font-extrabold leading-tight tracking-tight drop-shadow-lg">
            {course.title}
          </h1>

          <div className="mb-4 flex items-center gap-2 text-[12px] font-medium text-white/85">
            {course.tags.slice(0, 3).map((t, i) => (
              <span key={t} className="flex items-center gap-2">
                {i > 0 && <span className="text-white/40">•</span>}
                {t}
              </span>
            ))}
          </div>

          <div className="grid w-full grid-cols-2 gap-2.5">
            <button
              onClick={() => open(course.id)}
              className="tap flex items-center justify-center gap-2 rounded-md bg-white py-2.5 font-bold text-black"
            >
              <Play size={18} className="fill-black" />
              Découvrir
            </button>
            <button
              onClick={() => open(course.id)}
              className="tap flex items-center justify-center gap-2 rounded-md bg-white/15 py-2.5 font-semibold text-white backdrop-blur-sm"
            >
              <Info size={18} />
              Infos
            </button>
          </div>

          <button
            onClick={() => toggle(course.id)}
            className="tap mt-3 flex flex-col items-center gap-1 text-[11px] text-white/80"
          >
            <span
              className={clsx(
                "flex h-9 w-9 items-center justify-center rounded-full border transition-colors",
                inList
                  ? "border-delta-red bg-delta-red/20 text-delta-red"
                  : "border-white/40 text-white"
              )}
            >
              {inList ? <Check size={18} /> : <Plus size={18} />}
            </span>
            Ma liste
          </button>
        </div>
      </div>
    </section>
  );
}
