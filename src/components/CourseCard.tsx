"use client";

import { Play } from "lucide-react";
import type { Course } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import { CourseImg } from "./CourseImg";
import clsx from "clsx";

type Props = {
  course: Course;
  width?: number; // largeur du poster en px
  showProgress?: boolean; // rangée "Continuer"
};

export function CourseCard({ course, width = 132, showProgress = false }: Props) {
  const open = useAppStore((s) => s.openCourse);
  const progress = useAppStore((s) => s.progress[course.id] ?? 0);

  return (
    <button
      onClick={() => open(course.id)}
      className="tap relative shrink-0 text-left"
      style={{ width }}
      aria-label={course.title}
    >
      <div
        className="relative overflow-hidden rounded-xl bg-delta-surface2"
        style={{ aspectRatio: "2 / 3" }}
      >
        <CourseImg course={course} />

        {course.badge && !showProgress && (
          <span className="absolute left-1.5 top-1.5 rounded bg-delta-red px-1.5 py-0.5 text-[9px] font-bold tracking-wide">
            {course.badge}
          </span>
        )}

        {showProgress && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/25">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/90 bg-black/30 backdrop-blur-sm">
              <Play size={18} className="ml-0.5 fill-white text-white" />
            </span>
          </div>
        )}
      </div>

      {showProgress && (
        <div className="mt-1.5 h-[3px] w-full overflow-hidden rounded-full bg-white/20">
          <div
            className={clsx("h-full rounded-full bg-delta-red")}
            style={{ width: `${Math.max(6, progress * 100)}%` }}
          />
        </div>
      )}
    </button>
  );
}
