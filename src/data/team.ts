export type TeamMember = {
    name: string;
    role: string;
    bio: string;
    image?: string;
};

export const TEAM_DATA: TeamMember[] = [
    {
        name: "Mgr. Jakub Prášil",
        role: "Manuální terapie",
        bio: "Jakub se specializuje na diagnostiku a terapii funkčních poruch pohybového aparátu. Ve své praxi využívá především manuální techniky v kombinaci s cíleným cvičením. Klade důraz na individuální přístup a hledání příčiny potíží.",
        image: "/images/team/kuba.jpg",
    },
    {
        name: "Mgr. Radim Žídek",
        role: "Fyzioterapie",
        bio: "Radim je zkušený fyzioterapeut s holistickým pohledem na lidské tělo. Pomáhá klientům s akutními i chronickými bolestmi, poúrazovými stavy a vadným držením těla. Jeho cílem je vrátit klienty zpět do aktivního života bez bolesti.",
    },
    {
        name: "Martina Tresch",
        role: "Masáže",
        bio: "Martina se věnuje masážím a relaxačním technikám, které uvolňují svalové napětí a regenerují tělo i mysl. Její terapie jsou ideálním doplňkem k fyzioterapii a tréninku, pomáhají při stresu a únavě.",
    },
    {
        name: "Ondřej Paseka",
        role: "Kraniosakrální terapie",
        bio: "Ondřej je certifikovaný terapeut kraniosakrální terapie. Tato jemná metoda podporuje samoléčebné schopnosti organismu, uvolňuje hluboké napětí a harmonizuje nervový systém. Je vhodná pro široké spektrum obtíží.",
    },
];
