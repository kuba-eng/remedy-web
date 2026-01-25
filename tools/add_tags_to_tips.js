const fs = require("fs");
const path = require("path");

const inputPath = path.join(__dirname, "../assets/remedy-tips.json");
const outputPath = path.join(__dirname, "../assets/remedy-tips.json");

const tips = JSON.parse(fs.readFileSync(inputPath, "utf8"));

const rules = [
    // dech / stres / režim
    { tag: "dech", re: /(dech|dýchej|dýchání|nadech|nádech|vydech|výdech)/i },
    { tag: "vydech", re: /(vydech|výdech)/i },
    { tag: "nosni_dech", re: /(nosem|nosní)/i },
    { tag: "stres", re: /(stres|alarm|napětí|pohotovost)/i },
    { tag: "regenerace", re: /(regenerace|odpoč|spánek|unava|únava)/i },
    { tag: "pauza", re: /(pauza|mikro|zastav|ticho)/i },
    { tag: "vykon", re: /(výkon|soustřed|produktivit)/i },

    // pohyb / režim
    { tag: "chuze", re: /(chůze|choď|projdi|pochod)/i },
    { tag: "postoj", re: /(postav|stoj|stání|chodid|váha|50\/50)/i },
    { tag: "variabilita", re: /(stříd|změna polohy|variabil)/i },
    { tag: "mobilita", re: /(krouž|kroužení|rotace|rozsah|mobilit)/i },

    // spánek / hydratace
    { tag: "spanek", re: /(spánek|noc|postele|polštář)/i },
    { tag: "hydratace", re: /(hydrat|napij|tekutin)/i },

    // krk / hlava
    { tag: "krk", re: /(krk)/i },
    { tag: "sije", re: /(šíje|sije)/i },
    { tag: "celist", re: /(čelist|celist|zuby|skříp)/i },
    { tag: "jazyk", re: /(jazyk)/i },
    { tag: "oci", re: /(oči|oci|mrkn)/i },
    { tag: "celo", re: /(čelo|obočí|spánk)/i },
    { tag: "pc_mobil", re: /(pc|počítač|monitor|mobil|telefon)/i },
    { tag: "monitor", re: /(monitor|obrazovk)/i },

    // hrudník / lopatky
    { tag: "hrudnik", re: /(hrudník|hrudnik|žebra|zebra|prs)/i },
    { tag: "lopatky", re: /(lopatk)/i },

    // bedra / pánev / kyčle
    { tag: "bedra", re: /(bedra|bedern)/i },
    { tag: "panev", re: /(pánev|panev|kostrč|sedací kosti)/i },
    { tag: "kycle", re: /(kyčl|kycl)/i },
    { tag: "hyzde", re: /(hýžd|hyzd)/i },
    { tag: "kolena", re: /(kolen)/i },
    { tag: "chodidla", re: /(chodid|pata|špičk)/i },

    // rameno / ruka
    { tag: "rameno", re: /(ramen)/i },
    { tag: "trapezy", re: /(trapéz|trapez)/i },
    { tag: "zapesti", re: /(zápěst|zapesti)/i },
    { tag: "uchop", re: /(úchop|uchop|stisk|myš|mys)/i },
];

function uniq(arr) {
    return Array.from(new Set(arr));
}

function buildTags(tip) {
    const text = `${tip.headline || ""} ${tip.body || ""} ${tip.micro || ""}`.trim();
    const tags = [];

    for (const r of rules) {
        if (r.re.test(text)) tags.push(r.tag);
    }

    // jemná “kotva” podle kategorie (ať je to vždycky aspoň 1-2 tagy)
    if (tip.category === "krk_hlava") tags.push("krk");
    if (tip.category === "bedra") tags.push("bedra");
    if (tip.category === "rameno_lopatky") tags.push("rameno");
    if (tip.category === "stres_regenerace") tags.push("stres");

    // omez délku (zbytečně moc tagů je bordel)
    const cleaned = uniq(tags).slice(0, 6);
    return cleaned;
}

const out = tips.map(t => ({
    ...t,
    tags: Array.isArray(t.tags) && t.tags.length ? t.tags : buildTags(t)
}));

fs.writeFileSync(outputPath, JSON.stringify(out, null, 2), "utf8");
console.log(`OK: doplněno tags do ${out.length} tipů -> ${outputPath}`);
