"use client";

import {
  ChevronRight,
  GraduationCap,
  CreditCard,
  Bell,
  Download,
  HelpCircle,
  Settings,
  LogOut,
  Crown,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { useCurrentUser } from "@/lib/auth";

export default function ComptePage() {
  const purchased = useAppStore((s) => s.purchased);
  const { user, signedIn, loaded, signOut } = useCurrentUser();

  if (loaded && !signedIn) return <SignedOut />;
  if (!user) return null;

  return (
    <div className="safe-top px-4 pt-5">
      {/* Profil */}
      <div className="flex items-center gap-3">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-xl text-xl font-extrabold"
          style={{ backgroundColor: user.avatarColor }}
        >
          {user.firstName.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-lg font-bold">{user.fullName}</p>
          <p className="truncate text-[13px] text-white/50">{user.email}</p>
        </div>
      </div>

      {/* Bandeau abonnement */}
      <div className="mt-5 flex items-center gap-3 rounded-xl bg-gradient-to-r from-delta-red/25 to-delta-red/5 p-3.5">
        <Crown size={22} className="text-delta-red" />
        <div className="flex-1">
          <p className="text-sm font-bold">{user.plan}</p>
          <p className="text-[12px] text-white/60">Membre depuis {user.memberSince}</p>
        </div>
        <button className="tap rounded-md bg-white px-3 py-1.5 text-[12px] font-bold text-black">
          Gérer
        </button>
      </div>

      {/* Stats rapides */}
      <div className="mt-4 grid grid-cols-3 gap-2.5">
        <Stat value={purchased.length} label="Formations" />
        <Stat value={12} label="Leçons vues" />
        <Stat value="4 h" label="Cette semaine" />
      </div>

      {/* Raccourcis */}
      <div className="mt-6 overflow-hidden rounded-xl bg-delta-surface">
        <Row href="/mes-formations" icon={GraduationCap} label="Mes formations" />
        <Row icon={Download} label="Téléchargements" />
        <Row icon={CreditCard} label="Paiements & factures" />
        <Row icon={Bell} label="Notifications" />
      </div>

      <div className="mt-4 overflow-hidden rounded-xl bg-delta-surface">
        <Row icon={Settings} label="Paramètres" />
        <Row icon={HelpCircle} label="Aide & support" />
      </div>

      <button
        onClick={signOut}
        className="tap mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-delta-surface py-3.5 font-semibold text-white/90"
      >
        <LogOut size={18} />
        Se déconnecter
      </button>

      <p className="mt-5 text-center text-[11px] text-white/30">
        Delta · v0.1 — paiements Stripe à venir
      </p>
    </div>
  );
}

function SignedOut() {
  return (
    <div className="safe-top flex min-h-[80dvh] flex-col items-center justify-center px-6 text-center">
      <span className="mb-6 text-3xl font-extrabold tracking-tighter text-delta-red">
        DELTA
      </span>
      <p className="text-xl font-bold">Ton espace formations</p>
      <p className="mt-2 max-w-[260px] text-sm text-white/55">
        Connecte-toi pour retrouver tes formations, ta progression et tes achats.
      </p>
      <Link
        href="/connexion"
        className="tap mt-6 w-full max-w-xs rounded-md bg-delta-red py-3 text-center text-sm font-bold"
      >
        Se connecter
      </Link>
      <Link
        href="/inscription"
        className="tap mt-3 w-full max-w-xs rounded-md bg-white/10 py-3 text-center text-sm font-semibold"
      >
        Créer un compte
      </Link>
    </div>
  );
}

function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="rounded-xl bg-delta-surface p-3 text-center">
      <p className="text-xl font-extrabold">{value}</p>
      <p className="text-[11px] text-white/50">{label}</p>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  href,
}: {
  icon: LucideIcon;
  label: string;
  href?: string;
}) {
  const inner = (
    <div className="tap flex items-center gap-3 px-4 py-3.5">
      <Icon size={20} className="text-white/70" />
      <span className="flex-1 text-[14px] font-medium">{label}</span>
      <ChevronRight size={18} className="text-white/30" />
    </div>
  );
  return href ? (
    <Link href={href} className="block border-b border-white/[0.05] last:border-0">
      {inner}
    </Link>
  ) : (
    <div className="border-b border-white/[0.05] last:border-0">{inner}</div>
  );
}
