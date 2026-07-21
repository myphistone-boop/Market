export function euro(n: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(n);
}

export function totalDuration(count: number): string {
  // Estimation simple pour l'affichage.
  const mins = count * 15;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h} h ${m.toString().padStart(2, "0")}` : `${m} min`;
}
