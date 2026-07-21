"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { demoUser, type DemoUser } from "./user";

// Clerk est actif uniquement si la clé publique est configurée.
// Sans clé, l'app fonctionne en mode démo (comportement actuel).
export const clerkEnabled =
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export type CurrentUser = {
  loaded: boolean;
  signedIn: boolean;
  user: DemoUser | null;
  signOut: () => void;
};

function useDemo(): CurrentUser {
  return { loaded: true, signedIn: true, user: demoUser, signOut: () => {} };
}

function useReal(): CurrentUser {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  return {
    loaded: isLoaded,
    signedIn: !!user,
    user: user
      ? {
          firstName: user.firstName || user.username || "Membre",
          fullName: user.fullName || user.firstName || "Membre Delta",
          email: user.primaryEmailAddress?.emailAddress || "",
          memberSince: new Date(
            (user.createdAt as Date | null) ?? new Date()
          )
            .getFullYear()
            .toString(),
          plan: "Accès Premium",
          avatarColor: "#E50914",
        }
      : null,
    signOut: () => signOut(),
  };
}

// Choix figé au chargement du module (la valeur ne change jamais à l'exécution),
// donc l'ordre des hooks reste stable.
export const useCurrentUser: () => CurrentUser = clerkEnabled
  ? useReal
  : useDemo;
