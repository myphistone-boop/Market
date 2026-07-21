"use client";

import type { Course } from "@/types";
import { CourseCard } from "./CourseCard";

type Props = {
  title: string;
  courses: Course[];
  showProgress?: boolean;
  cardWidth?: number;
};

export function CourseRow({ title, courses, showProgress, cardWidth }: Props) {
  if (courses.length === 0) return null;

  return (
    <section className="mb-6">
      <h2 className="mb-2.5 px-4 text-[15px] font-bold tracking-tight">
        {title}
      </h2>
      <div className="no-scrollbar row-scroll flex gap-2.5 overflow-x-auto px-4">
        {courses.map((c) => (
          <CourseCard
            key={`${title}-${c.id}`}
            course={c}
            width={cardWidth}
            showProgress={showProgress}
          />
        ))}
      </div>
    </section>
  );
}
