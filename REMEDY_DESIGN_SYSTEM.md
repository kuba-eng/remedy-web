# REMEDY DESIGN SYSTEM & AI MANKIND PROMPT

Tento dokument slouží jako **hlavní referenční prompt** pro jakoukoliv budoucí tvorbu nebo úpravu stránek, podstránek a komponent na webu Remedy. 
Kdykoliv budeš (jako AI) nebo jakýkoliv jiný vývojář tvořit nový obsah pro Remedy, **MUSÍŠ BEZPODMÍNEČNĚ CTÍT A APLIKOVAT NÁSLEDUJÍCÍ PRAVIDLA GRAFIKY A UX DESIGNU:**

## 1. 🪨 ZÁKLADNÍ VIBE A ESTETIKA (Brand Essence)
*   **Identita:** Remedy = Prémiová lékařská fitness, fyzioterapie a manuální terapie.
*   **Vibe:** "Lenochodí" (pomalý, uvolněný, nevtíravý), luxusní, minimalistický, extrémně čistý. Zaměřuje se na uvolnění napětí a prémiovou profesionální péči. Žádný stres.
*   **Rozvržení (Layout):** Hodně negativního prostoru (dýchající design). Obrovské okraje (paddings), vzdušnost.
*   **Režim (Theme):** Web je **Dark Mode by default** (vždy tmavé, teplé pozadí).

## 2. 🎨 BAREVNÁ PALETA (Tailwind CSS 4)
Musíš striktně používat CSS proměnné z `globals.css` nebo hardcodované HEX kódy, které se k nim vztahují.
*   `--background`: **#1C1917** (Teplá temně hnědo-černá / Charcoal). Toto je absolutní základ každé stránky.
*   `--foreground`: **#FDFCF8** (Čistá lomená bílá / Off-white). Hlavní text.
*   `--accent`: **#D4B483** (Zlato-písková / Muted Gold). Určeno výhradně pro Call-to-Action (tlačítka rezervace, aktivní stavy, hover efekty, tenké okraje/bordery pro důraz).
*   `--muted-foreground`: **#A8A29E** (Stone 400). Používá se pro popisky, vedlejší texty, placeholder texty.

Při návrhu se vyhýbej svítivým barvám (žádná ostrá modrá, zelená, červená), výjimkou jsou logické chybové stavy formulářů, které se ale řeší tmavě červeným gradientem, aby nerušily auru luxusu.

## 3. ✍️ TYPOGRAFIE
*   **Nadpisy (Headings - h1, h2, h3):** Font **Sora** (`var(--font-sora)` nebo v Tailwindu `font-display`). Znaky musí mít moderní, mírně geometrický feeling, často používat `tracking-tight` (mírné smrsknutí písmen) a `text-balance`.
*   **Běžný text (Body):** Font **Manrope** (`var(--font-manrope)` nebo `font-sans`). Super čitelný, uhlazený. Font-weight je obvykle `font-light` nebo `font-normal`.
*   Zásadně nevyužívat VŠECHNA VELKÁ PÍSMENA (ALL CAPS) pro dlouhé texty (ruší relaxační vibe), pouze u drobných labelů (př. `uppercase tracking-widest text-[10px]`). Nativní inputy nesmí transformovat text.

## 4. 🔲 UI PARADIGMATA A KOMPONENTY
*   **Tvary:** Převážně jemně zaoblené rohy (používat `rounded-2xl` nebo u miniaturních tlačítek `rounded-full`). Žádné ostré řezavé krabice.
*   **Struktura elementů (Karty/Okna):** Povolen je tzv. "Glassmorphism" s vysokou průhledností.
    *   Třídy pro karty: `bg-white/5 border border-white/10 backdrop-blur-md`
    *   Služby na pozadí často doplňuje jemný svítící "Glow", např.: `shadow-[0_0_40px_-10px_rgba(212,180,131,0.2)]`
*   **Tlačítka (Buttons):**
    *   Primární: `bg-accent text-accent-foreground hover:bg-accent/90 transition-colors rounded-full px-6 py-3 font-medium`
    *   Sekundární / Ghost: `border border-white/20 text-white hover:bg-white/10 rounded-full px-6 py-3 transition-colors`

## 5. 🎬 ANIMACE A INTERAKCE (Framer Motion)
Web musí působit "živě, ale plynule a rozvážně". Téměř každá významnější komponenta musí využívat `framer-motion`.
*   **Při scrollování:** Sekce a texty by měly přijíždět zlehka zdola a blednout do viditelnosti.
    *   *Příklad kódu:* `<motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: "easeOut" }}>`
*   **Mikrointerakce na hover:** Jemné pohnutí s tlačítkem. `<motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>`
*   Rychlé "vyskakovací" blikající animace PŘÍSNĚ ZAKÁZÁNY. Trvání (duration) by mělo být typicky `0.5` až `0.8` sekundy.

## 6. UX DESIGN RULES & STRUKTURA PODSTRÁNEK
*   **Jednoduchost a čitelnost:** Uživatel se nesmí ztratit v textu. Textových bloků je málo, jsou úderné, zbytek příběhu vypráví design.
*   **Sticky/Fixed prvky:** Jsou řešeny s extrémním ohledem na mobilní uživatele. Zásadní CTA (objednat se) je vždy dostupné, buď v hlavičce, nebo zakomponované jako Floating Menu. 
*   **Grid a Flexbox:** Používej striktní mezery (klasicky `gap-8` nebo `gap-12`). Na mobilech je vše `flex-col`, na desktopu max 2-3 sloupce (`md:grid-cols-2`).
*   Každá stránka začíná obřím vizuálně působivým **Hero Headerem** (zaujímá ideálně 80-100% výšky obrazovky), a text hraje až sekundární roli.

---
**Instrukce pro AI (Kopírovat pro příští zadání):** 
„Chovej se jako Senior Frontend Developer zaměřený na Awwwards a prémiový design. Budeš stavět kód do projektu 'Remedy'. Tvá práce musí 100% zrcadlit prémiovou, tmavou, minimalistickou tvář brandu z definice výše. Použij TailwindCSS 4, Framer Motion pro plynulé animace a zajisti absolutní dokonalost pro mobilní zařízení.“
