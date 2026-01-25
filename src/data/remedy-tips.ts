export type TipCategory = 'krk_hlava' | 'bedra' | 'rameno_lopatky' | 'stres_regenerace';
export type TipType = 'tip' | 'vite_ze' | 'motivace';

export interface Tip {
    id: string;
    category: TipCategory;
    headline: string;
    body: string;
    micro: string;
    type: TipType;
}

export const CATEGORIES: { id: TipCategory; label: string }[] = [
    { id: 'krk_hlava', label: 'Krk / Hlava' },
    { id: 'bedra', label: 'Bedra' },
    { id: 'rameno_lopatky', label: 'Ramena / Lopatky' },
    { id: 'stres_regenerace', label: 'Stres / Únava' }
];

// Helper to determine type based on headline
const getType = (headline: string): TipType => {
    if (headline.startsWith("Víte, že") || headline.startsWith("Víte, že")) return 'vite_ze';
    if (headline.startsWith("Motivace:")) return 'motivace';
    return 'tip';
};

const RAW_TIPS: Omit<Tip, 'type'>[] = [
    { "id": "K01", "category": "krk_hlava", "headline": "Krk není vždy krk", "body": "Ztuhlý krk často souvisí s mělkým dechem a staženou čelistí.", "micro": "3× nádech do žeber (do stran), při výdechu povol čelist a jazyk." },
    { "id": "K02", "category": "krk_hlava", "headline": "Brada dolů, ne dopředu", "body": "Vysunutá brada umí přetížit šíji rychleji než špatná židle.", "micro": "Zasuň bradu o 2 mm dozadu (bez záklonu), 5 pomalých výdechů." },
    { "id": "K03", "category": "krk_hlava", "headline": "Oči tahají krk", "body": "Dlouhé koukání do blízka často stáhne šíji i čelo.", "micro": "Podívej se 10 s do dálky, pak 10 s jemně krouž očima." },
    { "id": "K04", "category": "krk_hlava", "headline": "Čelist = spínač napětí", "body": "Stisk zubů se často propíše až do krku a spánků.", "micro": "Rty zavřené, zuby od sebe, 4 dlouhé výdechy." },
    { "id": "K05", "category": "krk_hlava", "headline": "Lopatky drží šíji", "body": "Když lopatky “nejsou doma”, krk dělá práci za ně.", "micro": "10× jemně stáhni lopatky dolů a dozadu, bez zvedání ramen." },
    { "id": "K06", "category": "krk_hlava", "headline": "Hrudník pro krk", "body": "Tuhý hrudník často nutí krk kompenzovat při každém nádechu.", "micro": "Ruce na žebra, 5× nádech “do stran”, výdech prodluž o 2 s." },
    { "id": "K07", "category": "krk_hlava", "headline": "Mikropauza je lék", "body": "Krk miluje změnu polohy častěji než dlouhé protažení 1× denně.", "micro": "Každých 45 min: 20 s se postav a 5× zatoč rameny." },
    { "id": "K08", "category": "krk_hlava", "headline": "Telefon níž, ne hlavu níž", "body": "Sklon hlavy k mobilu rychle přidá zátěž na šíji.", "micro": "Zvedni telefon k očím, 3 výdechy a povol ramena." },
    { "id": "K09", "category": "krk_hlava", "headline": "Krk chce teplo", "body": "Pocit tuhosti bývá často o stažení, ne o “slabosti”.", "micro": "15–20 s dlaně na šíji, pomalý výdech, ramena dolů." },
    { "id": "K10", "category": "krk_hlava", "headline": "Jazyk dolů", "body": "Stažený jazyk zvyšuje napětí v krku a pod čelistí.", "micro": "Nech jazyk volně ležet, 5× pomalý výdech nosem." },
    { "id": "K11", "category": "krk_hlava", "headline": "Dýchej “tiše”", "body": "Hlučný nádech do hrudi často zvedá ramena a tahá krk.", "micro": "5× tichý nádech nosem, výdech delší než nádech." },
    { "id": "K12", "category": "krk_hlava", "headline": "Šíje a spánek", "body": "Krk se často ozývá po noci, kdy hlava “padá” mimo osu.", "micro": "Zkus dnes spát s menší oporou pod hlavou (bez extrémů)." },
    { "id": "K13", "category": "krk_hlava", "headline": "Změň úhel", "body": "Někdy stačí drobná změna výšky monitoru a krk přestane protestovat.", "micro": "Zvedni obraz o 2–3 cm, 3 výdechy, brada jemně dozadu." },
    { "id": "K14", "category": "krk_hlava", "headline": "Ruce uvolní krk", "body": "Přetížené předloktí a úchop můžou zbytečně přidat napětí výš.", "micro": "10× otevři a zavři dlaně + 10 s protřep zápěstí." },
    { "id": "K15", "category": "krk_hlava", "headline": "Hlava lehká", "body": "Pocit “těžké hlavy” často souvisí s dechem a postojem.", "micro": "Vytáhni se za temenem, 4× dlouhý výdech." },
    { "id": "K16", "category": "krk_hlava", "headline": "Neprotahuj agresivně", "body": "Silné tahání krku může napětí krátkodobě zhoršit.", "micro": "Místo toho 20 s jemně krouž rameny a dýchej do žeber." },
    { "id": "K17", "category": "krk_hlava", "headline": "Jedna věc: lopatka", "body": "Když lopatka klouže dobře, krk často povolí sám.", "micro": "Lokty u těla, 8× přitáhni lopatky k sobě “na půl plynu”." },
    { "id": "K18", "category": "krk_hlava", "headline": "Tři body opory", "body": "Opora chodidel, pánve a hrudníku srovná krk bez přemýšlení.", "micro": "Obě chodidla na zemi, sedni na sedací kosti, 3 pomalé výdechy." },
    { "id": "K19", "category": "krk_hlava", "headline": "Krk a stres", "body": "Čím větší tlak v hlavě, tím víc se šíje stáhne.", "micro": "Nádech 4 s, výdech 6 s, 4 kola." },
    { "id": "K20", "category": "krk_hlava", "headline": "Spánky nejsou zrádné", "body": "Napětí ve spáncích často znamená “přetažené” čelo a oči.", "micro": "Zavři oči, 10 s jemně uvolni obočí, 3 dlouhé výdechy." },
    { "id": "K21", "category": "krk_hlava", "headline": "Ramena pryč od uší", "body": "Zvednutá ramena jsou rychlá cesta k šíji v křeči.", "micro": "3×: nádech, při výdechu “pustit ramena dolů” jako by ztěžkla." },
    { "id": "K22", "category": "krk_hlava", "headline": "Krátké protažení prsou", "body": "Stažené prsní svaly táhnou ramena dopředu a krk to odnese.", "micro": "20 s opři předloktí o futra a jemně “otevři hrudník”." },
    { "id": "K23", "category": "krk_hlava", "headline": "Zvedni hrudník, ne bradu", "body": "Lepší vzpřímení je přes hrudník, ne přes záklon krku.", "micro": "Nádech do žeber, výdech a jemně zvedni hrudník o 1 cm." },
    { "id": "K24", "category": "krk_hlava", "headline": "Krk a batoh", "body": "Jednostranné nošení tašky umí rozhádat trapézy během dne.", "micro": "Přehoď stranu, 10 s proklepej rameno a lopatku." },
    { "id": "K25", "category": "krk_hlava", "headline": "Méně je víc", "body": "Krk často potřebuje spíš klid a variabilitu než tvrdý stretching.", "micro": "20 s chůze + 5 klidných výdechů." },
    { "id": "B01", "category": "bedra", "headline": "Bedra často jen drží", "body": "Když kyčle a hrudník “nejedou”, bedra to odpracují za ně.", "micro": "Postav se, lehce pokrč kolena, 5× přenes váhu pata–špička." },
    { "id": "B02", "category": "bedra", "headline": "Změna polohy vyhrává", "body": "Jedna dokonalá poloha neexistuje — tělo chce střídání.", "micro": "30 s: sed–stoj–sed, s klidným výdechem." },
    { "id": "B03", "category": "bedra", "headline": "Chůze je reset", "body": "Krátká chůze často sníží “sevření” v bedrech rychleji než protažení.", "micro": "2 min svižnější chůze, ramena volně." },
    { "id": "B04", "category": "bedra", "headline": "Dech do břicha není vše", "body": "Zkus dýchat i do žeber — bedra často povolí.", "micro": "Ruce na žebra, 5 nádechů do stran, výdech delší." },
    { "id": "B05", "category": "bedra", "headline": "Kyčle udělají místo", "body": "Tuhé kyčle nutí bedra přebírat rotace i ohyb.", "micro": "10× pomalu zvedni koleno (střídavě), jako pochod na místě." },
    { "id": "B06", "category": "bedra", "headline": "Nezadržuj výdech", "body": "Zadržovaný dech zvyšuje nitrobřišní tlak a bedra to cítí.", "micro": "4× dlouhý výdech pusou, ramena dolů." },
    { "id": "B07", "category": "bedra", "headline": "Zvedej z kyčlí", "body": "Když se ohýbáš hlavně v bedrech, rychle přetížíš záda.", "micro": "Zkus “poslat zadek dozadu” a držet hrudník dlouhý (10 s nácvik)." },
    { "id": "B08", "category": "bedra", "headline": "Pružnost není síla", "body": "Bolest zad často nechce víc “core”, ale víc variability.", "micro": "30 s: kroužení pánví malými kruhy na obě strany." },
    { "id": "B09", "category": "bedra", "headline": "Sedací kosti", "body": "Když sedíš na kostrči, bedra se snadno přetáhnou.", "micro": "Najdi sedací kosti (lehce se zhoupni dopředu/dozadu), pak 3 výdechy." },
    { "id": "B10", "category": "bedra", "headline": "Jednostranné stojení", "body": "Postoj “na jedné noze” v kuchyni umí rozhodit pánev.", "micro": "30 s postav váhu rovnoměrně, jemně odemkni kolena." },
    { "id": "B11", "category": "bedra", "headline": "Schody bez sevření", "body": "Ztuhlá záda se často zlepší, když zapojíš hýždě.", "micro": "10× vědomě zatlač patou při kroku, hýždě jemně aktivní." },
    { "id": "B12", "category": "bedra", "headline": "Měkký břicho, pevný střed", "body": "Přílišné zatnutí břicha může bedra paradoxně zhoršit.", "micro": "Nadechni se do žeber, výdech a jen 20% zpevnění." },
    { "id": "B13", "category": "bedra", "headline": "Protažení bez boje", "body": "Agresivní tah často zvyšuje obranné napětí.", "micro": "Lehké předklonění s oporou o stehna, 4 klidné výdechy." },
    { "id": "B14", "category": "bedra", "headline": "Hýždě jako brzda", "body": "Když hýždě spí, bedra jedou na plný výkon.", "micro": "8× zatni/povol hýždě vestoje, bez prohnutí zad." },
    { "id": "B15", "category": "bedra", "headline": "Záda a hydratace", "body": "Únava a nízký příjem tekutin často zhorší vnímání ztuhlosti.", "micro": "Napij se a dej 60 s chůze." },
    { "id": "B16", "category": "bedra", "headline": "Ranní rozjezd", "body": "Po ránu bývá páteř citlivější — tělo chce jemný start.", "micro": "30 s: pomalé kroužení ramen + 30 s chůze." },
    { "id": "B17", "category": "bedra", "headline": "Místo dlouhého sezení", "body": "Dlouhé sezení je pro bedra horší než “špatné sezení”.", "micro": "Každých 45–60 min: 20 s se postav a natáhni boky." },
    { "id": "B18", "category": "bedra", "headline": "Zvedni rebra", "body": "Když se hrudník “propadne”, bedra často přebírají stabilitu.", "micro": "Nádech do žeber, výdech a jemně “narovnej hrudník” o 1 cm." },
    { "id": "B19", "category": "bedra", "headline": "Rotace jemně", "body": "Bedra nemají ráda velké rotace pod zátěží.", "micro": "10× malá rotace hrudníku vestoje (pánev stabilní), bez bolesti." },
    { "id": "B20", "category": "bedra", "headline": "Záda a spánek", "body": "Když se budíš s bedry, často pomůže drobná změna polohy nohou.", "micro": "Zkus polštář mezi kolena (na boku) nebo pod kolena (na zádech)." },
    { "id": "B21", "category": "bedra", "headline": "Nohy pomáhají zádům", "body": "Tuhé kotníky/kyčle změní mechaniku kroku a záda reagují.", "micro": "20 s: zhoupni se na špičky a paty, klidný dech." },
    { "id": "B22", "category": "bedra", "headline": "Jedna minuta stačí", "body": "Krátký pravidelný impuls bývá účinnější než občasná hodina cvičení.", "micro": "60 s: chůze na místě + dlouhý výdech." },
    { "id": "B23", "category": "bedra", "headline": "Zpomal pohyb", "body": "Rychlé ohyby často spustí ochranné stažení v bedrech.", "micro": "Zvedni něco “na 2 doby” — pomalu dolů, pomalu nahoru." },
    { "id": "B24", "category": "bedra", "headline": "Opora chodidel", "body": "Když stojíš na vnější hraně nebo na špičkách, záda se často stáhnou.", "micro": "Najdi celý kontakt chodidla se zemí, 3 dlouhé výdechy." },
    { "id": "B25", "category": "bedra", "headline": "Záda chtějí plán", "body": "Když se to vrací, bývá nejlepší dát tomu systém a diagnostiku.", "micro": "Zkus dnes jen 2 min chůze po jídle a sleduj rozdíl." },
    { "id": "R01", "category": "rameno_lopatky", "headline": "Rameno není samo", "body": "Bolest ramene často souvisí s lopatkou a hrudníkem.", "micro": "10× lopatky dolů/dozadu “na půl plynu”, bez zvedání ramen." },
    { "id": "R02", "category": "rameno_lopatky", "headline": "Lokty blíž k tělu", "body": "Při práci u PC se lokty často rozjedou a ramena tuhnou.", "micro": "Přitáhni lokty k tělu, 4 dlouhé výdechy." },
    { "id": "R03", "category": "rameno_lopatky", "headline": "Hrudník otevři jemně", "body": "Stažený hrudník posune ramena dopředu a přetíží předek ramene.", "micro": "20 s opři předloktí o futra, jemně otevři hrudník." },
    { "id": "R04", "category": "rameno_lopatky", "headline": "Zvedání ramen pryč", "body": "Ramena u uší = rychlá cesta k trapézům v křeči.", "micro": "3×: nádech, výdech a “pustit” ramena dolů." },
    { "id": "R05", "category": "rameno_lopatky", "headline": "Lopatka klouže", "body": "Když lopatka neklouže po hrudníku, rameno tahá vepředu.", "micro": "10× pomalé kroužení ramen dozadu (větší kruh, bez bolesti)." },
    { "id": "R06", "category": "rameno_lopatky", "headline": "Zápěstí a rameno", "body": "Přetížené zápěstí a úchop umí “vytáhnout” napětí do ramene.", "micro": "10 s protřep ruce + 10× otevři/ zavři dlaň." },
    { "id": "R07", "category": "rameno_lopatky", "headline": "Dýchání do zad", "body": "Nádech jen do hrudi často zvedá ramena.", "micro": "Zkus 5 nádechů “do zad”, ruce na spodní žebra." },
    { "id": "R08", "category": "rameno_lopatky", "headline": "Pauza pro lopatky", "body": "Lopatky milují krátký pohyb během dne.", "micro": "Každých 60 min: 10× stáhni lopatky dolů a povol." },
    { "id": "R09", "category": "rameno_lopatky", "headline": "Nezvedej ruce do maxima", "body": "Když je rameno citlivé, extrémy rozsahu ho často zbytečně dráždí.", "micro": "Pracuj dnes jen v komfortním rozsahu a přidej 4 dlouhé výdechy." },
    { "id": "R10", "category": "rameno_lopatky", "headline": "Krk s ramenem spolu", "body": "Napětí v šíji často “zamkne” rameno.", "micro": "Nejprve 3 výdechy + povolit čelist, pak 8× krouž rameny." },
    { "id": "R11", "category": "rameno_lopatky", "headline": "Taška na střídačku", "body": "Nošení tašky na jedné straně přetíží trapéz a lopatku.", "micro": "Přehoď stranu + 15 s proklep trapézu." },
    { "id": "R12", "category": "rameno_lopatky", "headline": "Opora předloktí", "body": "Když pracuješ bez opory, ramena drží napětí navíc.", "micro": "Opři předloktí, 3 dlouhé výdechy, ramena dolů." },
    { "id": "R13", "category": "rameno_lopatky", "headline": "Rozsah bez bolesti", "body": "Rameno se učí bezpečí v malém rozsahu.", "micro": "10× zvedni paži jen do místa bez bolesti, s plynulým výdechem." },
    { "id": "R14", "category": "rameno_lopatky", "headline": "Hrudník je kolejnice", "body": "Když je hrudník tuhý, lopatka nemá kde jezdit.", "micro": "20 s “otevři” hrudník (ruce za hlavou) + 3 výdechy." },
    { "id": "R15", "category": "rameno_lopatky", "headline": "Neotáčej jen ramenem", "body": "Při dosahování do stran pomáhá otočit i hrudník, ne jen rameno.", "micro": "Zkus drobnou rotaci hrudníku při pohybu ruky, 5 opakování." },
    { "id": "R16", "category": "rameno_lopatky", "headline": "Trapéz nech odpočívat", "body": "Přetížený horní trapéz často “přebírá” stabilitu.", "micro": "15 s jemně zatlač dlaní do stolu, rameno drž dole, dýchej." },
    { "id": "R17", "category": "rameno_lopatky", "headline": "Lopatka do kapsy", "body": "Jednoduchý obraz často funguje líp než složitá instrukce.", "micro": "10× “zasuň lopatku do zadní kapsy” a povol." },
    { "id": "R18", "category": "rameno_lopatky", "headline": "Ruce nad hlavou s klidem", "body": "Nadhlavní poloha je citlivá, když chybí stabilita hrudníku.", "micro": "Zkus jen 3× pomalé zvednutí paží do 70–80% rozsahu, výdech." },
    { "id": "R19", "category": "rameno_lopatky", "headline": "Pomalost zklidní", "body": "Pomalý pohyb často sníží obranné napětí v rameni.", "micro": "8× velmi pomalé kroužení ramen, 1 kruh = 4 s." },
    { "id": "R20", "category": "rameno_lopatky", "headline": "Méně tlaku myší", "body": "Silný stisk myši/pera zvyšuje napětí v celé linii paže.", "micro": "Povol úchop o 20% a udělej 3 dlouhé výdechy." },
    { "id": "R21", "category": "rameno_lopatky", "headline": "Hlava do osy", "body": "Když hlava ujíždí dopředu, ramena jdou do kompenzace.", "micro": "Brada 2 mm dozadu, hrudník dlouhý, 4 výdechy." },
    { "id": "R22", "category": "rameno_lopatky", "headline": "Zadní strana pomáhá", "body": "Často chybí práce zadní části ramene a lopatky.", "micro": "Lokty u těla, 10× jemně táhni lokty dozadu (bez bolesti)." },
    { "id": "R23", "category": "rameno_lopatky", "headline": "Krátké zahřátí", "body": "Ztuhlé rameno často ocení nejdřív teplo/pohyb, až pak rozsah.", "micro": "30 s kroužení pažemi malý kruh, postupně zvětšuj." },
    { "id": "R24", "category": "rameno_lopatky", "headline": "Dvě minuty denně", "body": "Ramena milují konzistenci, i když je to krátké.", "micro": "2 min: 10× lopatky + 10× kroužení + 4 výdechy." },
    { "id": "R25", "category": "rameno_lopatky", "headline": "Když se to vrací", "body": "Opakované rameno často chce individuální nastavení a manuální práci.", "micro": "Dnes jen zklidni: 5 dlouhých výdechů + jemné kroužení." },
    { "id": "S01", "category": "stres_regenerace", "headline": "Výdech je brzda", "body": "Dlouhý výdech umí zklidnit systém rychleji než “motivace”.", "micro": "Nádech 4 s, výdech 6 s, 5 kol." },
    { "id": "S02", "category": "stres_regenerace", "headline": "Mikro-regenerace", "body": "Regenerace není hodina — někdy stačí 60 sekund.", "micro": "60 s: pomalá chůze + výdech delší než nádech." },
    { "id": "S03", "category": "stres_regenerace", "headline": "Tělo slyší tempo", "body": "Rychlost řeči i pohybu zvyšuje napětí v těle.", "micro": "Zpomal o 10% a dej 3 klidné výdechy." },
    { "id": "S04", "category": "stres_regenerace", "headline": "Zem pod nohama", "body": "Kontakt chodidel se zemí pomáhá nervovému systému.", "micro": "10 s vnímej celé chodidlo + 4 dlouhé výdechy." },
    { "id": "S05", "category": "stres_regenerace", "headline": "Oči do dálky", "body": "Stres se často zvyšuje při “tunelovém” vidění na blízko.", "micro": "Podívej se 15 s do dálky, pak 5 pomalých mrknutí." },
    { "id": "S06", "category": "stres_regenerace", "headline": "Ramena dolů", "body": "Stažená ramena drží tělo v “pohotovosti”.", "micro": "3×: nádech, výdech a ramena nechat spadnout." },
    { "id": "S07", "category": "stres_regenerace", "headline": "Jedna věc teď", "body": "Mozek nemá rád přepínání — tělo to pozná.", "micro": "Vyber 1 úkol na 5 min a u toho jen dýchej nosem." },
    { "id": "S08", "category": "stres_regenerace", "headline": "Voda + chůze", "body": "Únava a stres se často násobí, když chybí základní režim.", "micro": "Napij se a dej 90 s chůze." },
    { "id": "S09", "category": "stres_regenerace", "headline": "Uvolni čelo", "body": "Stažené čelo a obočí udržuje “alarm”.", "micro": "10 s uvolni obočí, 4 výdechy." },
    { "id": "S10", "category": "stres_regenerace", "headline": "Jazyk a klid", "body": "Poloha jazyka často odráží napětí v systému.", "micro": "Jazyk volně dole, rty zavřené, 5 dlouhých výdechů." },
    { "id": "S11", "category": "stres_regenerace", "headline": "Krátké zastavení", "body": "Zastavit se na chvíli není slabost — je to řízení systému.", "micro": "30 s: nic nedělej, jen sleduj výdech." },
    { "id": "S12", "category": "stres_regenerace", "headline": "Spánek není luxus", "body": "Málo spánku zvyšuje citlivost na bolest i stres.", "micro": "Dnes: o 20 min dřív do postele (ne perfektně, jen o kousek)." },
    { "id": "S13", "category": "stres_regenerace", "headline": "Dýchání do žeber", "body": "Boční dech často zklidní víc než “nafouknout břicho”.", "micro": "Ruce na žebra, 5 nádechů do stran, výdech prodluž." },
    { "id": "S14", "category": "stres_regenerace", "headline": "Méně kofeinu pozdě", "body": "Kofein pozdě odpoledne může rozházet spánek a regeneraci.", "micro": "Zkus dnes poslední kávu dřív a dej 60 s chůze." },
    { "id": "S15", "category": "stres_regenerace", "headline": "Ticho pro mozek", "body": "Nepřetržitý input (hudba, feed) drží systém v běhu.", "micro": "2 min bez obrazovky, jen klidný výdech." },
    { "id": "S16", "category": "stres_regenerace", "headline": "Krátká mobilita", "body": "Jemný pohyb umí stres snížit rychleji než sezení.", "micro": "30 s: kroužení ramen + 30 s: pochod na místě." },
    { "id": "S17", "category": "stres_regenerace", "headline": "Dýchej nosem", "body": "Nosní dech podporuje klidnější rytmus než dýchání pusou.", "micro": "5 nádechů a výdechů nosem, pomalu." },
    { "id": "S18", "category": "stres_regenerace", "headline": "Zpomal výdech", "body": "Prodloužený výdech je signál “jsem v bezpečí”.", "micro": "Nádech 3–4 s, výdech 6–7 s, 4 kola." },
    { "id": "S19", "category": "stres_regenerace", "headline": "Krk a stres", "body": "Stres se často uloží do šíje dřív než si toho všimneš.", "micro": "15 s dlaně na šíji + 4 dlouhé výdechy." },
    { "id": "S20", "category": "stres_regenerace", "headline": "Pauza po jídle", "body": "Krátká chůze po jídle podporuje regeneraci i energii.", "micro": "5 min klidná chůze (stačí i doma)." },
    { "id": "S21", "category": "stres_regenerace", "headline": "Jeden hluboký nádech nestačí", "body": "Tělo se uklidňuje rytmem, ne jedním “super nádechem”.", "micro": "5 cyklů: nádech 4 s, výdech 6 s." },
    { "id": "S22", "category": "stres_regenerace", "headline": "Někdy stačí světlo", "body": "Denní světlo ráno pomáhá rytmu a spánku.", "micro": "Dnes: 3–5 min venku (i když je zataženo)." },
    { "id": "S23", "category": "stres_regenerace", "headline": "Změň prostředí", "body": "Krátká změna místa často zlepší hlavu i tělo.", "micro": "Vstaň, dojdi k oknu, 5 výdechů." },
    { "id": "S24", "category": "stres_regenerace", "headline": "Neřeš všechno najednou", "body": "Multitasking = napětí v těle.", "micro": "Na 2 min jen jedna věc + plynulý nosní dech." },
    { "id": "S25", "category": "stres_regenerace", "headline": "Regenerace je strategie", "body": "Když se to opakuje, chce to plán, ne další vůli.", "micro": "Dnes: 2 min dech + 2 min chůze a sleduj rozdíl." },

    { "id": "K26", "category": "krk_hlava", "headline": "Víte, že oči tahají šíji?", "body": "Když dlouho koukáš do blízka, tělo často stáhne krk a čelo jako “držák”.", "micro": "20 s: podívej se do dálky + 5 pomalých mrknutí + dlouhý výdech." },
    { "id": "K27", "category": "krk_hlava", "headline": "Motivace: 20 sekund je plán", "body": "Nečekej na ideální chvíli — krk se uklidní i z mikro změny.", "micro": "3×: výdech, ramena dolů, brada o 2 mm dozadu." },
    { "id": "K28", "category": "krk_hlava", "headline": "Víte, že jazyk ovlivní krk?", "body": "Stažený jazyk často zvedá napětí v krku a pod čelistí.", "micro": "Jazyk volně dole, zuby od sebe, 5 dlouhých výdechů nosem." },
    { "id": "K29", "category": "krk_hlava", "headline": "Motivace: nejsi rozbitý", "body": "Tělo často jen dlouho jelo v jednom režimu. Změna režimu = úleva.", "micro": "60 s: postav se, 10× zatoč rameny dozadu, dýchej klidně." },
    { "id": "K30", "category": "krk_hlava", "headline": "Víte, že pro krk je klíčový hrudník?", "body": "Když je hrudník ztuhlý, krk často přebírá pohyb i dech.", "micro": "Ruce na žebra: 5 nádechů do stran, výdech o 2 s delší." },

    { "id": "B26", "category": "bedra", "headline": "Víte, že záda milují variabilitu?", "body": "Zádům často víc pomůže střídání poloh než “dokonalá poloha”.", "micro": "30 s: sed–stoj–sed, s pomalým výdechem." },
    { "id": "B27", "category": "bedra", "headline": "Motivace: 2 min denně vyhrávají", "body": "Pravidelnost poráží heroické jednorázové cvičení.", "micro": "2 min: chůze na místě + dlouhý výdech (nádech kratší než výdech)." },
    { "id": "B28", "category": "bedra", "headline": "Víte, že hýždě chrání bedra?", "body": "Když hýždě “spí”, bedra často zbytečně drží stabilitu.", "micro": "10×: jemně zatni hýždě na 1 s a povol (bez prohnutí zad)." },
    { "id": "B29", "category": "bedra", "headline": "Motivace: udělej to snadné", "body": "Nech si úlevu na očích: malý krok hned je víc než velký plán nikdy.", "micro": "20 s: kroužení pánví malé kruhy + 3 dlouhé výdechy." },
    { "id": "B30", "category": "bedra", "headline": "Víte, že dech umí snížit sevření?", "body": "Když je systém ve stresu, bedra často automaticky “přitvrdí”.", "micro": "4 kola: nádech 4 s, výdech 6 s. Při výdechu povol břicho o 10%." },

    { "id": "R26", "category": "rameno_lopatky", "headline": "Víte, že lopatka je “kolejnice” ramene?", "body": "Když lopatka neklouže, rameno často bolí i bez velké zátěže.", "micro": "10×: lopatka dolů/dozadu “na půl plynu”, ramena ne k uším." },
    { "id": "R27", "category": "rameno_lopatky", "headline": "Motivace: uvolni tlak, ne jen sval", "body": "Často stačí sundat 20 % napětí a rameno přestane bojovat.", "micro": "Povol úchop (myš/telefon) o 20 % a udělej 4 dlouhé výdechy." },
    { "id": "R28", "category": "rameno_lopatky", "headline": "Víte, že krk a rameno jsou tým?", "body": "Když je šíje stažená, rameno často ztratí lehkost pohybu.", "micro": "Nejdřív 3 výdechy + čelist volně, pak 8× krouž rameny dozadu." },
    { "id": "R29", "category": "rameno_lopatky", "headline": "Motivace: malý rozsah je vítězství", "body": "Bezpečný malý rozsah učí rameno klidu. Klid pak dovolí víc.", "micro": "10× zvedni paži jen do komfortu, každý pohyb s výdechem." },
    { "id": "R30", "category": "rameno_lopatky", "headline": "Víte, že opora šetří trapézy?", "body": "Když ruce nemají oporu, ramena drží napětí navíc celý den.", "micro": "Opři předloktí o stůl/stehna, 5 klidných výdechů, ramena dolů." },

    { "id": "S26", "category": "stres_regenerace", "headline": "Víte, že výdech je signál bezpečí?", "body": "Prodloužený výdech dává nervovému systému informaci “můžeš povolit”.", "micro": "5 kol: nádech 4 s, výdech 6–7 s." },
    { "id": "S27", "category": "stres_regenerace", "headline": "Motivace: stačí 60 sekund", "body": "Regenerace není projekt. Je to drobná rutina, která se dá stihnout vždy.", "micro": "60 s: pomalá chůze + nosní dech, výdech delší." },
    { "id": "S28", "category": "stres_regenerace", "headline": "Víte, že mikro-pauzy zvedají výkon?", "body": "Krátké pauzy umí snížit únavu a zlepšit soustředění během dne.", "micro": "2 min: bez mobilu, jen klidný nosní dech + uvolnit ramena." },
    { "id": "S29", "category": "stres_regenerace", "headline": "Motivace: nedělej to dokonale", "body": "Lepší je “trochu často” než “hodně občas”. Tělo to pozná.", "micro": "3×: výdech, ramena dolů, chodidla plně na zemi." },
    { "id": "S30", "category": "stres_regenerace", "headline": "Víte, že světlo ladí rytmus?", "body": "Krátký kontakt s denním světlem pomáhá tělu držet režim dne a noci.", "micro": "3–5 min venku nebo u okna + 5 dlouhých výdechů." }
];

export const REMEDY_TIPS: Tip[] = RAW_TIPS.map(tip => ({
    ...tip,
    type: getType(tip.headline)
}));
