export type Level = "Débutant" | "Intermédiaire" | "Avancé";

export type Lesson = {
  title: string;
  duration: string; // ex: "12 min"
};

export type Course = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  tags: string[]; // ex: ["Certifiant", "Pratique"]
  year: number;
  level: Level;
  price: number; // en euros
  instructor: string;
  poster: string; // cover de marque (SVG local, repli)
  backdrop: string; // backdrop de marque (SVG local, repli)
  photo: string; // vraie photo thématique (portrait)
  photoBg: string; // vraie photo thématique (large)
  badge?: "NOUVEAU" | "POPULAIRE" | "TOP 10";
  featured?: boolean;
  lessons: Lesson[];
};
