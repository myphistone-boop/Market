"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { clerkEnabled } from "@/lib/auth";

// N'active ClerkProvider que si les clés sont présentes.
// Sinon, passe-plat : l'app tourne en mode démo sans dépendance runtime.
export function Providers({ children }: { children: React.ReactNode }) {
  if (!clerkEnabled) return <>{children}</>;
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#E50914",
          colorBackground: "#141414",
          colorText: "#ffffff",
          colorInputBackground: "#1f1f1f",
          colorInputText: "#ffffff",
          borderRadius: "10px",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
