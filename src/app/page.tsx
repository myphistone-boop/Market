"use client";

import { useMemo, useState } from "react";
import { TopBar } from "@/components/TopBar";
import { Hero } from "@/components/Hero";
import { CourseRow } from "@/components/CourseRow";
import {
  ROWS,
  FEATURED_ID,
  getCourse,
  coursesByCategory,
} from "@/data/courses";
import { useAppStore } from "@/store/useAppStore";

export default function HomePage() {
  const [cat, setCat] = useState("Tout");
  const purchased = useAppStore((s) => s.purchased);

  const featured = getCourse(FEATURED_ID)!;

  const continueCourses = useMemo(
    () => purchased.map((id) => getCourse(id)).filter(Boolean),
    [purchased]
  ) as ReturnType<typeof getCourse>[];

  const filtered = coursesByCategory(cat);

  return (
    <div>
      <TopBar active={cat} onSelect={setCat} />

      {cat === "Tout" ? (
        <>
          <Hero course={featured} />

          <div className="pt-1">
            {continueCourses.length > 0 && (
              <CourseRow
                title="Continuer la formation"
                courses={continueCourses as any}
                showProgress
                cardWidth={150}
              />
            )}

            {ROWS.map((row) => (
              <CourseRow
                key={row.title}
                title={row.title}
                courses={row.ids.map((id) => getCourse(id)!).filter(Boolean)}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="pt-[124px]">
          <CategoryGrid title={cat} />
        </div>
      )}
    </div>
  );
}

function CategoryGrid({ title }: { title: string }) {
  const open = useAppStore((s) => s.openCourse);
  const list = coursesByCategory(title);
  return (
    <section className="px-4">
      <h2 className="mb-3 text-lg font-bold">{title}</h2>
      <div className="grid grid-cols-3 gap-2.5">
        {list.map((c) => (
          <button
            key={c.id}
            onClick={() => open(c.id)}
            className="tap relative overflow-hidden rounded-xl bg-delta-surface2"
            style={{ aspectRatio: "2/3" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.poster} alt={c.title} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </section>
  );
}
