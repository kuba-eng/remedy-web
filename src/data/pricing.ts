export type PriceRow = {
    label: string;
    price: string;
};

export type IconName = "Hand" | "Bone" | "PersonStanding" | "Waves" | "Bandage" | "Activity" | "User" | "Users" | "Brain" | "Scale" | "Sparkles";

export type PricingItem = {
    id: string; // Unique ID for React keys
    title: string;
    subtitle: string;
    timeRange: string;
    iconName: IconName;
    prices: PriceRow[];
    note?: string;
    highlight?: boolean; // True = Green card, False = Dark card
};

export const PRICING_DATA: PricingItem[] = [
    // 1. Manuální terapie (Hand)
    {
        id: "manualni-terapie",
        title: "Manuální terapie",
        subtitle: "Kuba",
        timeRange: "30 - 150 min",
        iconName: "Hand",
        highlight: true,
        prices: [
            { label: "30 min", price: "600 Kč" },
            { label: "50 min", price: "1 200 Kč" },
            { label: "80 min", price: "1 700Kč" },
            { label: "110 min", price: "2 300 Kč" },
            { label: "150 min", price: "2 900 Kč" },
        ],
        note: "První návštěva může trvat až 150 min (analýza).",
    },
    // 2. Fyzioterapie (PersonStanding - matches Services)
    {
        id: "fyzio",
        title: "Fyzioterapie",
        subtitle: "Radim",
        timeRange: "30 - 50 min",
        iconName: "PersonStanding",
        prices: [
            { label: "30 min", price: "600 Kč" },
            { label: "50 min", price: "1 200 Kč" },
        ],
    },
    // 3. Masáž (Waves - New Item)
    {
        id: "masaz",
        title: "Masáž",
        subtitle: "Martina",
        timeRange: "30 - 50 min",
        iconName: "Waves",
        prices: [
            { label: "30 min", price: "400 Kč" },
            { label: "50 min", price: "800 Kč" },
        ],
    },
    // 4. Kraniosakrální terapie (Brain)
    {
        id: "kranio",
        title: "Kraniosakrální Terapie",
        subtitle: "Ondra",
        timeRange: "60 - 90 min",
        iconName: "Brain",
        prices: [
            { label: "60 min", price: "1 000 Kč" },
            { label: "90 min", price: "1 400 Kč" },
        ],
        note: "Jemná manuální technika pro uvolnění mysli.",
    },
    // 5. Trénink Individual (User - Singular)
    {
        id: "trening-indiv",
        title: "Remedy Trénink Individual",
        subtitle: "Radim nebo Kuba",
        timeRange: "55 min",
        iconName: "User",
        prices: [
            { label: "55 min", price: "800 Kč" },

        ],
    },
    // 6. Trénink Pro Dva (Users - Plural)
    {
        id: "trening-pair",
        title: "Remedy Trénink Pro Dva",
        subtitle: "Radim nebo Kuba",
        timeRange: "55 min",
        iconName: "Users",
        prices: [
            { label: "55 min", price: "1 000 Kč" },
        ],
    },
    // 7. Kinesiotaping (Bandage)
    {
        id: "taping",
        title: "Kinesiotaping",
        subtitle: "Radim & Kuba",
        timeRange: "1 Kč / 1 cm",
        iconName: "Bandage",
        prices: [
            { label: "1–15 min", price: "300 Kč" },
            { label: "20–30 min", price: "600 Kč" },
            { label: "35–45 min", price: "900 Kč" },
        ],
        note: "Cena dle času + materiálu.",
    },
    // 8. InBody Diagnostika (Scale)
    {
        id: "diagnostika",
        title: "InBody Diagnostika",
        subtitle: "Kuba",
        timeRange: "15 min",
        iconName: "Scale",
        prices: [
            { label: "1x analýza ", price: "500 Kč" },
        ],
    },
];
