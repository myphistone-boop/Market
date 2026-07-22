// Utilisateur de démo. Sera remplacé par Clerk (useUser) une fois les clés
// configurées — l'interface consommatrice restera identique.
export type DemoUser = {
  firstName: string;
  fullName: string;
  email: string;
  memberSince: string;
  plan: string;
  avatarColor: string;
};

export const demoUser: DemoUser = {
  firstName: "Mitchel",
  fullName: "Mitchel Delacroix",
  email: "myphistone@gmail.com",
  memberSince: "2025",
  plan: "Accès Premium",
  avatarColor: "#20242a",
};
