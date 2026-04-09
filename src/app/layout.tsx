import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Market Brain - Interactive Trading Knowledge Map",
  description:
    "Carte interactive du savoir trading et brokerage. Un cerveau qui évolue avec vos connaissances.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
