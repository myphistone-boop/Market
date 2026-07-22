"use client";

import Link from "next/link";
import { SignUp } from "@clerk/nextjs";
import { clerkEnabled } from "@/lib/auth";

export default function InscriptionPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6 py-16">
      <span className="chrome-text mb-8 text-3xl font-extrabold tracking-[0.15em]">
        DELTA
      </span>
      {clerkEnabled ? (
        <SignUp
          routing="path"
          path="/inscription"
          signInUrl="/connexion"
          fallbackRedirectUrl="/compte"
        />
      ) : (
        <div className="w-full max-w-sm rounded-2xl bg-delta-surface p-6 text-center">
          <p className="text-lg font-bold">Inscription bientôt disponible</p>
          <p className="mt-2 text-sm text-white/60">
            La création de compte s&apos;activera une fois Clerk configuré.
          </p>
          <Link
            href="/"
            className="btn-chrome tap mt-5 inline-block rounded-md px-5 py-2.5 text-sm font-bold"
          >
            Explorer Delta
          </Link>
        </div>
      )}
    </div>
  );
}
