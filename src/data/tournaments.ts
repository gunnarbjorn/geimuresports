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
  note?: string;
  discordUrl?: string;
  tags?: string[];
}

export const tournaments: Tournament[] = [
  {
    id: "elko-deild-vor-2026",
    name: "Elko-deildin Vor 2026 – Duos",
    dates: ["11. feb", "18. feb", "26. feb", "4. mars (úrslit)"],
    category: "Duo",
    format: "Duos Build",
    ageLimit: "13+ (yngri með leyfi foreldra)",
    location: "Online",
    description: "Fortnite Duo mót fyrir keppendur á Íslandi. Keppt er í Duos Build yfir fjögur mótakvöld með úrslitum í mars.",
    entryFee: "2.000 kr á einstakling",
    prizePool: "Auglýst síðar",
    ctaUrl: "https://linkar.rafithrottir.is/greida-elko-deildina",
    ctaText: "Skrá mig í mót",
    note: "Allir keppendur þurfa að vera með Discord aðgang og skráðir á Fortnite á Íslandi Discord.",
    discordUrl: "https://discord.com/invite/57P9SAy4Fq",
    tags: ["Duo", "Online"],
  },
  {
    id: "arena-lan-coming-soon",
    name: "Stórt Fortnite mót í Arena – Coming Soon",
    dates: [],
    category: "LAN",
    location: "Arena Gaming",
    description: "Stórt staðarmót í Arena Gaming. 100 keppendur í sama lobby, 5 leikir spilaðir, fjör, tilboð, streymi á staðnum og verðlaun.",
    isComingSoon: true,
    ctaText: "Tilkynnt síðar",
    note: "Skráning opnar síðar. Fylgstu með á samfélagsmiðlum.",
    tags: ["LAN", "100 manna lobby"],
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
