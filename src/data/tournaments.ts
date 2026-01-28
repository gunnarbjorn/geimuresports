export interface Tournament {
  id: string;
  name: string;
  date: string;
  category: "Solo" | "Duo" | "Squad";
  ageLimit?: string;
  location: string;
  deadline: string;
  description: string;
}

export const tournaments: Tournament[] = [
  {
    id: "fortnite-open-feb",
    name: "Fortnite Opið Mót",
    date: "15. febrúar 2026",
    category: "Solo",
    location: "Online",
    deadline: "12. febrúar 2026",
    description: "Opið mót fyrir alla aldurshópa. Keppt í Solo flokki.",
  },
  {
    id: "fortnite-duo-mars",
    name: "Duo Vorleikur",
    date: "8. mars 2026",
    category: "Duo",
    ageLimit: "12-18 ára",
    location: "Online",
    deadline: "5. mars 2026",
    description: "Duo mót fyrir unglinga. Finndu þér félaga og skráðu þig!",
  },
  {
    id: "fortnite-squad-april",
    name: "Squad Bikar",
    date: "19. apríl 2026",
    category: "Squad",
    location: "Á staðnum (TBD)",
    deadline: "15. apríl 2026",
    description: "Stærsta mót tímabilsins! Squad keppni með verðlaunum.",
  },
];

export const trainingGroups = [
  { value: "nylidar", label: "Nýliðar" },
  { value: "framhald", label: "Framhald" },
  { value: "keppni", label: "Keppnis-hópur" },
];
