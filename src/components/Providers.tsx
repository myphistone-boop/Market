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
          colorPrimary: "#d3d8de",
          colorBackground: "#101216",
          colorText: "#ffffff",
          colorInputBackground: "#181b20",
          colorInputText: "#ffffff",
          borderRadius: "10px",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
