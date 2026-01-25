export type TipCategory = 'krk' | 'bedra' | 'rameno' | 'stres';

export interface Tip {
    id: string;
    category: TipCategory;
    headline: string;
    description: string;
    duration: string;
}

export const REMEDY_TIPS: Tip[] = [
    // KRK / HLAVA
    {
        id: 'krk-1',
        category: 'krk',
        headline: 'Zasuň bradu, vytáhni temeno',
        description: 'Představ si, že tě někdo táhne za temeno hlavy vzhůru. Bradu lehce zasuň dozadu (udělej "dvojitou bradu"). Uvolni čelisti.',
        duration: '20 s'
    },
    {
        id: 'krk-2',
        category: 'krk',
        headline: 'Uvolnění šíje',
        description: 'Chyť se jednou rukou za židli a ukloň hlavu na opačnou stranu. Rameno nech klesnout dolů. Prodýchej napětí.',
        duration: '30 s'
    },
    {
        id: 'krk-3',
        category: 'krk',
        headline: 'Kroužky nosem',
        description: 'Představ si, že máš na nose tužku. Kresli s ní ve vzduchu malé ležaté osmičky. Uvolníš tím hluboké svaly pod lebkou.',
        duration: '30 s'
    },

    // BEDRA
    {
        id: 'bedra-1',
        category: 'bedra',
        headline: 'Prodýchnutí do břicha',
        description: 'Polož si ruce na spodní břicho. S nádechem pošli vzduch až do dlaní (ne do hrudníku). S výdechem uvolni.',
        duration: '40 s'
    },
    {
        id: 'bedra-2',
        category: 'bedra',
        headline: 'Kočičí hřbet v sedě',
        description: 'Opři se rukama o kolena. S výdechem vykul záda dozadu, s nádechem se prohni a otevři hrudník dopředu.',
        duration: '30 s'
    },
    {
        id: 'bedra-3',
        category: 'bedra',
        headline: 'Aktivní sed',
        description: 'Posuň se na židli dopředu, ať se neopíráš. Nohy dej na šířku pánve celou plochou na zem. Vytáhni se z pasu nahoru.',
        duration: 'Trvale'
    },

    // RAMENO / LOPATKY
    {
        id: 'rameno-1',
        category: 'rameno',
        headline: 'Otevři hrudník',
        description: 'Spoj ruce za zády, propleť prsty a lehce je stáhni dolů k zemi. Ramena jdou od uší, hrudník se otevírá.',
        duration: '20 s'
    },
    {
        id: 'rameno-2',
        category: 'rameno',
        headline: 'Lopatky k sobě',
        description: 'S výdechem stáhni lopatky k sobě a dolů (jako bys mezi nimi chtěl/a udržet tužku). S nádechem povol.',
        duration: '10x'
    },
    {
        id: 'rameno-3',
        category: 'rameno',
        headline: 'Kroužení rameny',
        description: 'Dělej velké, pomalé kruhy rameny dozadu. Soustřeď se na pohyb lopatek po žebrech. Dopředu ne, tam jsou už celý den.',
        duration: '30 s'
    },

    // STRES / ÚNAVA
    {
        id: 'stres-1',
        category: 'stres',
        headline: 'Boxový dech',
        description: 'Nádech na 4 doby, zádrž na 4, výdech na 4, zádrž na 4. Opakuj 4x. Okamžitý reset pro nervový systém.',
        duration: '1 min'
    },
    {
        id: 'stres-2',
        category: 'stres',
        headline: 'Pohled do dálky',
        description: 'Zvedni oči od monitoru. Zadívej se z okna na nejvzdálenější bod, který vidíš. Uvolníš tím oční svaly i mozek.',
        duration: '20 s'
    },
    {
        id: 'stres-3',
        category: 'stres',
        headline: 'Proklepání',
        description: 'Vstaň a rychle proklepej ruce, nohy i celé tělo. Setřes ze sebe napětí jako pes vodu. Energie se okamžitě vrátí.',
        duration: '15 s'
    }
];

export const CATEGORIES: { id: TipCategory; label: string }[] = [
    { id: 'krk', label: 'Krk / Hlava' },
    { id: 'bedra', label: 'Bedra' },
    { id: 'rameno', label: 'Ramena / Lopatky' },
    { id: 'stres', label: 'Stres / Únava' }
];
