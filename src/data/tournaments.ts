export interface Tournament {
  id: string;
  name: string;
  dates: string[];
  category: "Solo" | "Duo" | "Squad" | "LAN";
  format?: string;
  ageLimit?: string;
  location: string;
  description: string;
  entryFee?: string;
  prizePool?: string;
  ctaUrl?: string;
  ctaText?: string;
  isComingSoon?: boolean;
  hidden?: boolean;
  note?: string;
  discordUrl?: string;
  tags?: string[];
}

export const tournaments: Tournament[] = [
  {
    id: "elko-deild-vor-2026",
    name: "Elko Deildin – Duos – Vor 2026",
    dates: ["25. feb", "26. feb", "4. mars (úrslit)"],
    category: "Duo",
    format: "Duos Build",
    ageLimit: "13+ (yngri með leyfi foreldra)",
    location: "Online",
    description: "Opinber Fortnite deild á Íslandi. Keppt í neti, sýnt í sjónvarpi. Heildarverðlaunafé 100.000 kr.",
    entryFee: "2.000 kr á einstakling",
    prizePool: "100.000 kr.",
    ctaUrl: "https://linkar.rafithrottir.is/greida-elko-deildina",
    ctaText: "Skrá lið",
    note: "Allir keppendur þurfa að vera með Discord aðgang og skráðir á Fortnite á Íslandi Discord.",
    discordUrl: "https://discord.com/invite/57P9SAy4Fq",
    tags: ["Duo", "Online", "Build"],
    hidden: true,
  },
  {
    id: "arena-lan-coming-soon",
    name: "Fortnite DUO LAN",
    dates: ["28. feb"],
    category: "LAN",
    location: "Arena Gaming",
    description: "Staðarmót í Arena Gaming. 2 manna lið, 5 leikir, fjör, pizza, streymi á staðnum og verðlaun.",
    entryFee: "4.440 kr á keppanda",
    ctaText: "Skrá lið",
    note: "Skráning opin. Greiðsla fer fram við skráningu.",
    tags: ["LAN", "Duo"],
  },
  {
    id: "allt-undir",
    name: "ALLT UNDIR – Solo",
    dates: ["5. mars", "12. mars", "19. mars", "26. mars"],
    category: "Solo",
    format: "Solo",
    ageLimit: "13+",
    location: "Online",
    description: "Solo keppni á netinu. 1 leikur, verðlaunapottur byggist á fjölda skráðra. Á hverjum fimmtudegi í mars.",
    entryFee: "3.057 kr",
    ctaText: "Skrá mig",
    tags: ["Solo", "Online"],
    hidden: true,
  },
];

export const trainingGroups = [
  { 
    value: "nylidar", 
    label: "Nýliðar", 
    description: "Fyrir þá sem eru að byrja",
    sessionsPerWeek: "1x í viku",
    price: "12.900 kr/mán"
  },
  { 
    value: "framhald", 
    label: "Framhald", 
    description: "Fyrir þá sem vilja þróast",
    sessionsPerWeek: "2x í viku",
    price: "19.900 kr/mán",
    featured: true
  },
  { 
    value: "foreldri-barn", 
    label: "Foreldri + barn", 
    description: "Spilaðu saman",
    sessionsPerWeek: "1x í viku",
    price: "16.900 kr/mán"
  },
];
