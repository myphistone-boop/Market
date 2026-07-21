"use client";

import { useEffect, useState } from "react";
import type { Course } from "@/types";
import clsx from "clsx";

// Affiche une vraie photo thématique ; si elle ne charge pas (réseau, host
// bloqué…), bascule automatiquement sur la cover de marque (SVG local).
// Remplit son parent (qui doit être `relative` + `overflow-hidden`).
export function CourseImg({
  course,
  kind = "poster",
  className,
  priority,
}: {
  course: Course;
  kind?: "poster" | "backdrop";
  className?: string;
  priority?: boolean;
}) {
  const primary = kind === "poster" ? course.photo : course.photoBg;
  const fallback = kind === "poster" ? course.poster : course.backdrop;
  const [src, setSrc] = useState(primary);

  // Si la formation change (réutilisation du composant), on retente la photo.
  useEffect(() => setSrc(primary), [primary]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={course.title}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={() => {
        if (src !== fallback) setSrc(fallback);
      }}
      className={clsx("absolute inset-0 h-full w-full object-cover", className)}
    />
  );
}
