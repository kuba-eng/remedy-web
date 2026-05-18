export type TeamMember = {
    name: string;
    role: string;
    bio: string;
    image?: string;
    imagePosition?: string;
    imageTransform?: string;
    reservationLink?: string;
};

export const TEAM_DATA: TeamMember[] = [
    {
        name: "Mgr. Jakub Prášil",
        role: "Manuální terapie",
        bio: "Jakub ve své práci spojuje manuální techniky, masáž a přemýšlení v souvislostech.\n\nNevěří na rychlé nálepky ani na univerzální odpovědi typu „to bude od zad“. Tělo bývá mnohem chytřejší, než si někdy připouštíme — a potíže často nevznikají tam, kde se nejhlasitěji ozývají.\n\nProto ho nezajímá jen místo bolesti, ale i její širší kontext. Hledá možné příčiny, vztahy a souvislosti, které dávají smysl z pohledu moderních poznatků o těle, pohybu a bolesti. Bez mystiky, bez zbytečného strašení a bez potřeby tvářit se, že každé zatuhnutí je životní diagnóza.\n\nZakládá si na precizní práci, lidském přístupu a terapii, která není jen příjemná v danou chvíli, ale dává smysl i dlouhodobě. Chce, abyste odcházeli nejen s úlevou, ale i s lepším pochopením vlastního těla. Protože nejlepší péče není ta, která z vás udělá věčného klienta, ale ta, která vám pomůže fungovat lépe i bez dramatických návratů.",
        image: "/images/team/kuba.jpg",
        imagePosition: "center 25%",
        imageTransform: "scale(1.0)",
        reservationLink: "https://rezervace.remedy.cz/",
    },
    {
        name: "Mgr. Radim Žídek",
        role: "Fyzioterapie",
        bio: "Radim je fyzioterapeut. Věří, že pohyb je život – stejně jako spánek, jídlo a dobrá společnost. Říká se, že pohybem ke zdraví, a právě od toho je tady: aby lidem pomohl zvládnout vše v jednom kuse.\n\nMá rád aktivní život a činí mu radost vidět klienty, jak se vracejí do formy – nebo alespoň k bezbolestnému zavazování tkaniček. Nesnaží se být expertem jen na „levé koleno“, baví ho řešit tělo komplexně a bez škatulek. Ve své ordinaci nekádruje a vítá každého, kdo má zájem.\n\nNemá úzce vymezenou specializaci, protože ho baví rozmanitost lidských diagnóz. Ať už jde o vrcholového sportovce, gaučového povaleče, těhotnou ženu, člověka s neurologickou diagnózou nebo někoho po operaci či úrazu, u Radima jsou dveře otevřené všem.",
        image: "/images/team/radim.jpg",
        imagePosition: "center 0%",
        imageTransform: "scale(1.1)",
        reservationLink: "https://rezervace.remedy.cz/",
    },
    {
        name: "Martina Tresch",
        role: "Masáže",
        bio: "Martina se věnuje masážím a relaxačním technikám, které uvolňují svalové napětí a regenerují tělo i mysl. Její terapie jsou ideálním doplňkem k fyzioterapii a tréninku, pomáhají při stresu a únavě.",
        image: "/images/team/martina.jpg",
    },
    {
        name: "Ondřej Paseka",
        role: "Kraniosakrální terapie",
        bio: "Ondřej je certifikovaný terapeut kraniosakrální terapie a biodynamiky. Tato jemná metoda podporuje samoléčebné schopnosti organismu, uvolňuje hluboké napětí a harmonizuje nervový systém. Je vhodná pro široké spektrum obtíží.",
        image: "/images/team/ondrej.jpg",
        imagePosition: "100% 0%",
        imageTransform: "scale(1.25) translateX(-8%)",
    },
];
