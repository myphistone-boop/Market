"use client";

import { BottomNav } from "./BottomNav";
import { DetailSheet } from "./DetailSheet";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      {/* Maille hexagonale carbone, fond digital léger */}
      <div className="carbon-mesh" aria-hidden />

      {/* Contenu de la page, avec de la marge pour la nav en bas */}
      <main className="relative z-[1] min-h-[100dvh] pb-[calc(var(--nav-h)+env(safe-area-inset-bottom)+8px)]">
        {children}
      </main>

      <BottomNav />
      <DetailSheet />
    </div>
  );
}
