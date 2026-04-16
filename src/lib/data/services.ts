export type RemedyService = {
  id: string;
  name: string;
  descriptionShort: string;
  descriptionLong: string;
  keywords: string[];
};

export const SERVICES: RemedyService[] = [
  {
    id: "massage",
    name: "Masáž",
    descriptionShort: "Uvolnění, regenerace a práce s přetížením.",
    descriptionLong: "Masáž je vhodná pro regeneraci, uvolnění svalového napětí a celkovou úlevu po fyzické nebo psychické zátěži.",
    keywords: ["masáž", "masaze", "uvolnění", "regenerace", "záda", "svaly"]
  },
  {
    id: "exercise",
    name: "Cvičení",
    descriptionShort: "Aktivní práce s tělem, kondicí a kompenzací potíží.",
    descriptionLong: "Cvičení je vhodné pro zlepšení kondice, kompenzaci jednostranné zátěže a dlouhodobou práci s pohybem.",
    keywords: ["cvičení", "cviceni", "kondice", "kompenzace", "pohyb", "zdravá záda"]
  }
];
