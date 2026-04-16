export type RemedyFaq = {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
};

export const FAQ: RemedyFaq[] = [
  {
    id: "location",
    question: "Kde vás najdu?",
    answer: "Remedy medical fitness najdete na adrese Doležalovo náměstí 73/2, Žďár nad Sázavou.",
    keywords: ["kde vás najdu", "kde vas najdu", "adresa", "lokace", "kde jste"]
  },
  {
    id: "booking",
    question: "Jak se objednat?",
    answer: "Objednat se můžete přes rezervační systém. Pokud chcete, mohu vám nejdřív pomoci najít vhodný termín.",
    keywords: ["objednat", "objednání", "rezervace", "jak se objednat", "termin"]
  },
  {
    id: "massage_info",
    question: "K čemu je masáž?",
    answer: "Masáž je vhodná hlavně pro uvolnění svalového napětí, regeneraci a úlevu od přetížení.",
    keywords: ["masáž", "masaze", "na co je masaz", "regenerace", "uvolnění"]
  },
  {
    id: "exercise_info",
    question: "K čemu je cvičení?",
    answer: "Cvičení je vhodné pro aktivní práci s tělem, zlepšení kondice a kompenzaci jednostranné zátěže.",
    keywords: ["cvičení", "cviceni", "na co je cviceni", "kondice", "kompenzace"]
  },
  {
    id: "contact",
    question: "Jak vás kontaktovat?",
    answer: "Pokud chcete, mohu vás nasměrovat na kontaktní informace nebo rovnou pomoci najít vhodný termín.",
    keywords: ["kontakt", "telefon", "email", "spojení"]
  }
];
