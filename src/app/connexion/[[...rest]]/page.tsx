"use client";

import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { clerkEnabled } from "@/lib/auth";

export default function ConnexionPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6 py-16">
      <span className="mb-8 text-3xl font-extrabold tracking-tighter text-delta-red">
        DELTA
      </span>
      {clerkEnabled ? (
        <SignIn
          routing="path"
          path="/connexion"
          signUpUrl="/inscription"
          fallbackRedirectUrl="/compte"
        />
      ) : (
        <Notice />
      )}
    </div>
  );
}

function Notice() {
  return (
    <div className="w-full max-w-sm rounded-2xl bg-delta-surface p-6 text-center">
      <p className="text-lg font-bold">Connexion bientôt disponible</p>
      <p className="mt-2 text-sm text-white/60">
        L&apos;authentification Clerk s&apos;activera dès que les clés seront
        configurées. En attendant, tu peux explorer l&apos;app en mode démo.
      </p>
      <Link
        href="/"
        className="tap mt-5 inline-block rounded-md bg-delta-red px-5 py-2.5 text-sm font-bold"
      >
        Explorer Delta
      </Link>
    </div>
  );
}
