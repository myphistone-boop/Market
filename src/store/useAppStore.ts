"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type Progress = Record<string, number>; // courseId -> ratio 0..1

type AppState = {
  // Détail (bottom sheet)
  selectedId: string | null;
  openCourse: (id: string) => void;
  closeCourse: () => void;

  // Bibliothèque de l'utilisateur (démo, persistée localement)
  purchased: string[];
  myList: string[];
  progress: Progress;

  buy: (id: string) => void;
  toggleMyList: (id: string) => void;
  setProgress: (id: string, ratio: number) => void;

  hasPurchased: (id: string) => boolean;
  inMyList: (id: string) => boolean;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      selectedId: null,
      openCourse: (id) => set({ selectedId: id }),
      closeCourse: () => set({ selectedId: null }),

      purchased: ["mindset-elite", "productivite-deep"],
      myList: ["dev-fullstack", "design-produit"],
      progress: { "mindset-elite": 0.42, "productivite-deep": 0.15 },

      buy: (id) =>
        set((s) => ({
          purchased: s.purchased.includes(id) ? s.purchased : [...s.purchased, id],
          progress: { ...s.progress, [id]: s.progress[id] ?? 0 },
        })),

      toggleMyList: (id) =>
        set((s) => ({
          myList: s.myList.includes(id)
            ? s.myList.filter((x) => x !== id)
            : [...s.myList, id],
        })),

      setProgress: (id, ratio) =>
        set((s) => ({ progress: { ...s.progress, [id]: ratio } })),

      hasPurchased: (id) => get().purchased.includes(id),
      inMyList: (id) => get().myList.includes(id),
    }),
    {
      name: "delta-store",
      partialize: (s) => ({
        purchased: s.purchased,
        myList: s.myList,
        progress: s.progress,
      }),
    }
  )
);
