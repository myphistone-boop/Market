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
  poster: string; // ratio 2:3
  backdrop: string; // large 16:9+
  badge?: "NOUVEAU" | "POPULAIRE" | "TOP 10";
  featured?: boolean;
  lessons: Lesson[];
};
