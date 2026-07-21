"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  Play,
  Plus,
  Check,
  Share2,
  ThumbsUp,
  X,
  Lock,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { getCourse } from "@/data/courses";
import { euro, totalDuration } from "@/lib/format";
import clsx from "clsx";

export function DetailSheet() {
  const id = useAppStore((s) => s.selectedId);
  const close = useAppStore((s) => s.closeCourse);
  const course = id ? getCourse(id) : undefined;

  return (
    <AnimatePresence>
      {course && (
        <Sheet key={course.id} onClose={close}>
          <SheetContent courseId={course.id} />
        </Sheet>
      )}
    </AnimatePresence>
  );
}

function Sheet({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-center">
      <motion.div
        className="absolute inset-0 bg-black/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="absolute bottom-0 h-[94dvh] w-full max-w-app
                   overflow-hidden rounded-t-2xl bg-delta-surface shadow-sheet"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 34, stiffness: 340 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.6 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 120 || info.velocity.y > 600) onClose();
        }}
      >
        <div className="flex justify-center pt-2.5">
          <span className="h-1 w-10 rounded-full bg-white/25" />
        </div>
        {children}
      </motion.div>
    </div>
  );
}

function SheetContent({ courseId }: { courseId: string }) {
  const course = getCourse(courseId)!;
  const close = useAppStore((s) => s.closeCourse);
  const buy = useAppStore((s) => s.buy);
  const purchased = useAppStore((s) => s.purchased.includes(courseId));
  const inList = useAppStore((s) => s.myList.includes(courseId));
  const toggleList = useAppStore((s) => s.toggleMyList);
  const [tab, setTab] = useState<"lecons" | "apropos">("lecons");

  return (
    <div className="no-scrollbar h-[calc(94dvh-20px)] overflow-y-auto pb-16">
      {/* En-tête visuel */}
      <div className="relative h-56 w-full">
        <Image
          src={course.backdrop}
          alt={course.title}
          fill
          sizes="460px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-delta-surface via-delta-surface/70 to-transparent" />
        <button
          onClick={close}
          className="tap absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60"
          aria-label="Fermer"
        >
          <X size={18} />
        </button>
        <h2 className="absolute inset-x-4 bottom-3 text-2xl font-extrabold tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          {course.title}
        </h2>
      </div>

      <div className="mt-3 px-4">
        <p className="mt-1 text-sm text-white/70">{course.tagline}</p>

        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-white/60">
          <span className="text-emerald-400 font-semibold">{course.year}</span>
          <span>{course.level}</span>
          <span className="rounded border border-white/25 px-1 text-[10px]">
            {course.lessons.length} leçons
          </span>
          <span>{totalDuration(course.lessons.length)}</span>
        </div>

        {/* CTA principal : Acheter ou Reprendre */}
        {purchased ? (
          <button className="tap mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-white py-2.5 font-bold text-black">
            <Play size={18} className="fill-black" />
            Reprendre
          </button>
        ) : (
          <button
            onClick={() => buy(course.id)}
            className="tap mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-delta-red py-2.5 font-bold text-white"
          >
            <Play size={18} className="fill-white" />
            Débloquer — {euro(course.price)}
          </button>
        )}

        <button className="tap mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-white/12 py-2.5 font-semibold">
          <Play size={16} />
          Aperçu gratuit
        </button>

        <p className="mt-4 text-[13px] leading-relaxed text-white/85">
          {course.description}
        </p>

        <p className="mt-3 text-[12px] text-white/50">
          Formateur&nbsp;: <span className="text-white/80">{course.instructor}</span>
        </p>

        {/* Actions rondes façon Netflix */}
        <div className="mt-4 flex gap-8">
          <RoundAction
            active={inList}
            icon={inList ? <Check size={22} /> : <Plus size={22} />}
            label="Ma liste"
            onClick={() => toggleList(course.id)}
          />
          <RoundAction icon={<ThumbsUp size={20} />} label="Noter" />
          <RoundAction icon={<Share2 size={20} />} label="Partager" />
        </div>

        {/* Onglets */}
        <div className="mt-6 flex gap-6 border-b border-white/10">
          <TabBtn on={tab === "lecons"} onClick={() => setTab("lecons")}>
            Leçons
          </TabBtn>
          <TabBtn on={tab === "apropos"} onClick={() => setTab("apropos")}>
            À propos
          </TabBtn>
        </div>

        {tab === "lecons" ? (
          <ul className="mt-3 divide-y divide-white/[0.06]">
            {course.lessons.map((l, i) => {
              const locked = !purchased && i > 0;
              return (
                <li key={i} className="flex items-center gap-3 py-3">
                  <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-md bg-delta-surface2">
                    <Image
                      src={course.poster}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-cover opacity-90"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                      {locked ? (
                        <Lock size={16} className="text-white/90" />
                      ) : (
                        <Play size={16} className="fill-white text-white" />
                      )}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold">
                      {l.title}
                    </p>
                    <p className="text-[11px] text-white/50">{l.duration}</p>
                  </div>
                  {i === 0 && !purchased && (
                    <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/80">
                      Gratuit
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="mt-3 space-y-3 text-[13px] text-white/80">
            <p>{course.description}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              {course.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-white/10 px-3 py-1 text-[12px]"
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="text-white/50">
              Catégorie&nbsp;: {course.category} · Niveau {course.level}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function RoundAction({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="tap flex flex-col items-center gap-1.5 text-[11px] text-white/75"
    >
      <span className={clsx(active ? "text-delta-red" : "text-white")}>
        {icon}
      </span>
      {label}
    </button>
  );
}

function TabBtn({
  children,
  on,
  onClick,
}: {
  children: React.ReactNode;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "relative -mb-px pb-2.5 text-sm font-semibold transition-colors",
        on ? "text-white" : "text-white/45"
      )}
    >
      {children}
      {on && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded bg-delta-red" />}
    </button>
  );
}
