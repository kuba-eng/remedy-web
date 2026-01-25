import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPage() {
    return (
        <main className="bg-neutral-950 min-h-screen text-stone-300 font-sans selection:bg-[#D9F99D] selection:text-black">
            <Navbar />

            <section className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 block">
                    Zásady ochrany osobních údajů
                </h1>

                <div className="space-y-8 leading-relaxed">
                    <p className="text-lg text-stone-400">
                        Vstupem na tyto webové stránky a používáním našich služeb nám (Remedy, se sídlem Žďár nad Sázavou) svěřujete své osobní údaje.
                        Tady je přehled toho, jak s nimi nakládáme, proč je sbíráme a jaká máte práva.
                    </p>

                    <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                        <h2 className="text-2xl font-bold text-white mb-4">1. Jaké údaje sbíráme?</h2>
                        <ul className="list-disc list-outside ml-5 space-y-2">
                            <li>
                                <strong className="text-white">Cookies:</strong> Používáme cookies pro zajištění funkčnosti webu a analýzu návštěvnosti (pokud nám dáte souhlas).
                            </li>
                            <li>
                                <strong className="text-white">Kontaktní údaje:</strong> Pokud vyplníte formulář (např. pro odběr tipů), zpracováváme váš e-mail, abychom vám mohli službu poskytnout.
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Proč je sbíráme?</h2>
                        <p>Údaje zpracováváme za účelem:</p>
                        <ul className="list-disc list-outside ml-5 mt-2 space-y-2">
                            <li>Poskytování služeb, které jste si objednali (např. zasílání tipů).</li>
                            <li>Zlepšování našich webových stránek.</li>
                            <li>Komunikaci s vámi ohledně vašich dotazů či rezervací.</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Jak dlouho je uchováváme?</h2>
                        <p>
                            Vaše údaje uchováváme jen po dobu nezbytně nutnou. U odběru novinek do doby, než se odhlásíte.
                            U Cookies dle nastavení vašeho prohlížeče nebo do odvolání souhlasu.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Vaše práva</h2>
                        <p>Podle GDPR máte právo:</p>
                        <ul className="list-disc list-outside ml-5 mt-2 space-y-2">
                            <li>Požadovat přístup k vašim osobním údajům.</li>
                            <li>Požadovat opravu nebo výmaz vašich údajů ("právo být zapomenut").</li>
                            <li>Vznést námitku proti zpracování.</li>
                            <li>Odvolat souhlas se zpracováním.</li>
                        </ul>
                    </div>

                    <div className="pt-8 border-t border-white/10 mt-12">
                        <h2 className="text-xl font-bold text-white mb-2">Kontakt</h2>
                        <p>
                            Máte dotaz ohledně vašich dat? Napište nám na e-mail: <br />
                            <a href="mailto:info@remedy.cz" className="text-[#D9F99D] hover:underline">info@remedy.cz</a>
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
