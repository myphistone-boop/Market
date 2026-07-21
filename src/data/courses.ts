import type { Course } from "@/types";

// Affiches "key art" générées localement (dégradés de marque Delta).
// Remplaçables par les vraies affiches une fois le back-office branché.
const poster = (id: string) => `/covers/${id}.svg`;
const backdrop = (id: string) => `/backdrops/${id}.svg`;

function lessons(n: number, base: string): Course["lessons"] {
  const durations = ["08 min", "12 min", "17 min", "21 min", "09 min", "14 min", "26 min", "11 min"];
  return Array.from({ length: n }).map((_, i) => ({
    title: `${i + 1}. ${base} — partie ${i + 1}`,
    duration: durations[i % durations.length],
  }));
}

const _RAW: Omit<Course, "photo" | "photoBg">[] = [
  {
    id: "growth-systeme",
    title: "Le Système Growth",
    tagline: "Construis une machine à croissance de A à Z",
    description:
      "Une méthode complète pour transformer une idée en business qui tourne : acquisition, offre, tunnel de vente et automatisation. Pensée pour passer à l'action dès la première leçon.",
    category: "Business",
    tags: ["Certifiant", "Pratique", "Rythme libre"],
    year: 2025,
    level: "Intermédiaire",
    price: 149,
    instructor: "Léa Marchand",
    poster: poster("growth"),
    backdrop: backdrop("growth-bg"),
    badge: "TOP 10",
    featured: true,
    lessons: lessons(8, "Growth"),
  },
  {
    id: "mindset-elite",
    title: "Mindset d'Élite",
    tagline: "Reprogramme ta discipline en 21 jours",
    description:
      "Un programme de développement personnel intense pour installer des habitudes solides, gérer ton énergie et rester constant même quand la motivation disparaît.",
    category: "Développement personnel",
    tags: ["Populaire", "Audio + Vidéo"],
    year: 2025,
    level: "Débutant",
    price: 89,
    instructor: "Yanis Cohen",
    poster: poster("mindset"),
    backdrop: backdrop("mindset-bg"),
    badge: "POPULAIRE",
    lessons: lessons(7, "Mindset"),
  },
  {
    id: "design-produit",
    title: "Design Produit UI/UX",
    tagline: "Conçois des apps que les gens adorent",
    description:
      "Du wireframe au prototype cliquable : maîtrise Figma, les systèmes de design, l'ergonomie mobile et les micro-interactions qui font la différence.",
    category: "Créatif",
    tags: ["Certifiant", "Figma", "Projet final"],
    year: 2024,
    level: "Intermédiaire",
    price: 129,
    instructor: "Sofia Nguyen",
    poster: poster("design"),
    backdrop: backdrop("design-bg"),
    lessons: lessons(6, "Design"),
  },
  {
    id: "dev-fullstack",
    title: "Dev Full-Stack Moderne",
    tagline: "React, Next.js et le web de 2025",
    description:
      "Deviens développeur full-stack opérationnel : composants, API, base de données, authentification et déploiement. Beaucoup de code, zéro blabla.",
    category: "Tech",
    tags: ["Certifiant", "Projets", "Live coding"],
    year: 2025,
    level: "Avancé",
    price: 199,
    instructor: "Thomas Riva",
    poster: poster("dev"),
    backdrop: backdrop("dev-bg"),
    badge: "NOUVEAU",
    lessons: lessons(8, "Dev"),
  },
  {
    id: "contenu-viral",
    title: "Contenu Viral",
    tagline: "Le playbook des créateurs qui percent",
    description:
      "Comprends l'algorithme, écris des hooks qui accrochent et produis vite. La stratégie de contenu complète pour faire décoller ta présence.",
    category: "Créatif",
    tags: ["Populaire", "Templates inclus"],
    year: 2025,
    level: "Débutant",
    price: 79,
    instructor: "Camille Dubois",
    poster: poster("viral"),
    backdrop: backdrop("viral-bg"),
    badge: "POPULAIRE",
    lessons: lessons(7, "Contenu"),
  },
  {
    id: "ia-au-quotidien",
    title: "L'IA au Quotidien",
    tagline: "Automatise 80% de ton travail",
    description:
      "Utilise l'intelligence artificielle comme un pro : prompts efficaces, agents, automatisations et intégrations concrètes dans ton métier.",
    category: "Tech",
    tags: ["Nouveau", "Pratique", "Outils"],
    year: 2025,
    level: "Débutant",
    price: 99,
    instructor: "Nadia Fischer",
    poster: poster("ia"),
    backdrop: backdrop("ia-bg"),
    badge: "NOUVEAU",
    lessons: lessons(6, "IA"),
  },
  {
    id: "finance-perso",
    title: "Finances Personnelles",
    tagline: "Reprends le contrôle de ton argent",
    description:
      "Budget, épargne, investissement et mentalité : les bases saines pour construire ta liberté financière, expliquées simplement et sans jargon.",
    category: "Business",
    tags: ["Certifiant", "Modèles Excel"],
    year: 2024,
    level: "Débutant",
    price: 69,
    instructor: "Marc Olivier",
    poster: poster("finance"),
    backdrop: backdrop("finance-bg"),
    lessons: lessons(7, "Finance"),
  },
  {
    id: "prise-de-parole",
    title: "Prise de Parole",
    tagline: "Captive n'importe quelle audience",
    description:
      "Structure ton discours, gère ton trac et parle avec impact. Des exercices concrets pour être à l'aise à l'oral, en réunion comme sur scène.",
    category: "Développement personnel",
    tags: ["Exercices", "Feedback"],
    year: 2024,
    level: "Intermédiaire",
    price: 89,
    instructor: "Inès Laurent",
    poster: poster("speak"),
    backdrop: backdrop("speak-bg"),
    lessons: lessons(6, "Oral"),
  },
  {
    id: "montage-video",
    title: "Montage Vidéo Pro",
    tagline: "De la rush au film qui claque",
    description:
      "Apprends le montage, le rythme, l'étalonnage et le son. Tout ce qu'il faut pour produire des vidéos propres et professionnelles rapidement.",
    category: "Créatif",
    tags: ["Projets", "Presets inclus"],
    year: 2024,
    level: "Intermédiaire",
    price: 119,
    instructor: "Hugo Bertrand",
    poster: poster("video"),
    backdrop: backdrop("video-bg"),
    lessons: lessons(7, "Montage"),
  },
  {
    id: "vente-b2b",
    title: "Maîtriser la Vente",
    tagline: "Closer sans forcer, avec méthode",
    description:
      "Le process de vente moderne : prospection, découverte, gestion des objections et closing. Une approche humaine qui convertit vraiment.",
    category: "Business",
    tags: ["Scripts", "Roleplay"],
    year: 2025,
    level: "Avancé",
    price: 159,
    instructor: "Sarah Meyer",
    poster: poster("sales"),
    backdrop: backdrop("sales-bg"),
    lessons: lessons(8, "Vente"),
  },
  {
    id: "photo-mobile",
    title: "Photo au Smartphone",
    tagline: "Ton téléphone est un vrai studio",
    description:
      "Composition, lumière, retouche : shoote des photos bluffantes avec juste ton mobile. Simple, visuel et immédiatement applicable.",
    category: "Créatif",
    tags: ["Débutant", "Pratique"],
    year: 2024,
    level: "Débutant",
    price: 59,
    instructor: "Elena Rossi",
    poster: poster("photo"),
    backdrop: backdrop("photo-bg"),
    lessons: lessons(6, "Photo"),
  },
  {
    id: "productivite-deep",
    title: "Productivité & Deep Work",
    tagline: "Fais plus, en travaillant moins",
    description:
      "Systèmes de concentration, gestion des priorités et organisation. Retrouve du temps et de la clarté avec une méthode qui tient sur la durée.",
    category: "Développement personnel",
    tags: ["Populaire", "Notion inclus"],
    year: 2025,
    level: "Débutant",
    price: 79,
    instructor: "Julien Faure",
    poster: poster("focus"),
    backdrop: backdrop("focus-bg"),
    badge: "POPULAIRE",
    lessons: lessons(7, "Focus"),
  },
];

// Mots-clés pour de vraies photos thématiques (via loremflickr, réseau public).
// Univers visuel : sport, finance, costumes, luxe / réussite (rien d'autre).
const KW: Record<string, string> = {
  "growth-systeme": "businessman,suit",
  "mindset-elite": "gym,fitness",
  "design-produit": "luxury,watch",
  "dev-fullstack": "businessman,office",
  "contenu-viral": "luxury,car",
  "ia-au-quotidien": "businessman,suit",
  "finance-perso": "finance,money",
  "prise-de-parole": "businessman,success",
  "montage-video": "luxury,car",
  "vente-b2b": "businessman,handshake",
  "photo-mobile": "luxury,watch",
  "productivite-deep": "gym,fitness",
};
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}
const photo = (id: string) =>
  `https://loremflickr.com/600/900/${KW[id] ?? "learning"}?lock=${hash(id) % 900}`;
const photoBg = (id: string) =>
  `https://loremflickr.com/1200/1500/${KW[id] ?? "learning"}?lock=${hash(id) % 900}`;

// poster/backdrop = cover de marque (repli SVG local) ; photo/photoBg = vraie photo.
export const COURSES: Course[] = _RAW.map((c) => ({
  ...c,
  poster: poster(c.id),
  backdrop: backdrop(c.id),
  photo: photo(c.id),
  photoBg: photoBg(c.id),
}));

export const CATEGORIES = [
  "Tout",
  "Business",
  "Créatif",
  "Tech",
  "Développement personnel",
] as const;

export function getCourse(id: string): Course | undefined {
  return COURSES.find((c) => c.id === id);
}

export function coursesByCategory(cat: string): Course[] {
  if (cat === "Tout") return COURSES;
  return COURSES.filter((c) => c.category === cat);
}

// Sélections pour les rangées de la page d'accueil.
export const ROWS: { title: string; ids: string[] }[] = [
  {
    title: "Populaire sur Delta",
    ids: ["growth-systeme", "mindset-elite", "contenu-viral", "dev-fullstack", "productivite-deep"],
  },
  {
    title: "Tendances actuelles",
    ids: ["ia-au-quotidien", "vente-b2b", "design-produit", "finance-perso", "growth-systeme"],
  },
  {
    title: "Nouveautés",
    ids: ["dev-fullstack", "ia-au-quotidien", "growth-systeme", "montage-video"],
  },
  {
    title: "Pour progresser vite",
    ids: ["prise-de-parole", "productivite-deep", "mindset-elite", "photo-mobile", "finance-perso"],
  },
];

export const FEATURED_ID = "growth-systeme";
