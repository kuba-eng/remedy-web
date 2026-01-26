"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function About() {
    return (
        <section
            id="o-nas"
            className="relative w-full min-h-screen flex items-center bg-fixed bg-center bg-cover bg-no-repeat scroll-mt-20"
            style={{ backgroundImage: `url('/images/about_bg_v2.jpg')` }}
        >
            {/* Dark Overlay Gradient for depth */}
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/50 to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center lg:py-24">

                {/* Text Content in a clean, semi-transparent container */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="flex flex-col gap-8"
                >
                    <div className="space-y-4">
                        {/* BADGE REMOVED HERE */}
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
                            Vítejte v <span className="text-[#D9F99D]">Remedy</span>.
                        </h2>
                    </div>

                    <div className="space-y-6 text-lg md:text-xl text-neutral-300 font-light leading-relaxed max-w-xl backdrop-blur-sm bg-black/10 p-6 rounded-2xl border border-white/5 shadow-2xl">
                        <p>
                            Nezáleží nám na tom, jestli jste vrcholový sportovec nebo knihomol. Ať jste malí, velcí, hubení, silní, slabí, mladí nebo staří, bolí vás koleno, nebo celé tělo, chcete skákat dál, nebo výš, nebo prostě jen v PO HO DĚ doběhnout autobus.
                        </p>
                        <p>
                            Pokud opravdu něco chcete změnit, stačí přestat hledat výmluvy a my vám ukážeme jak na to.
                        </p>
                        <p>
                            Remedy v současné době pravidelně navštěvuje více než 1&nbsp;200 klientů z celé České republiky, kteří se začli aktivně podílet na příběhu svého života. A jaký je ten váš? <strong className="text-white font-medium">Je čas na změnu!</strong>
                        </p>
                        <p>
                            Zázraky na počkání neděláme. Zato děláme plán, který funguje: <span className="text-white">zdravotní cvičení, fyzioterapii a masáže</span>. Hledáme příčinu, řešíme souvislosti a držíme směr.
                        </p>
                        <p>
                            Jsme tělocvična, jsme masérna, jsme nestátní zdravotnické zařízení. Jsme Remedy.
                        </p>

                        <div className="pt-4 flex justify-end">
                            <p className="text-[#D9F99D] font-display font-medium text-lg text-right italic">
                                Vaše holé hlavy, vaše holé štěstí.<br />
                                <span className="text-white/60 not-italic text-sm uppercase tracking-widest">Kuba a Radim</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <Button
                            variant="primary"
                            size="lg"
                            className="bg-[#D9F99D] text-black hover:bg-white border-none rounded-full px-8 h-12 font-bold tracking-wide uppercase text-sm shadow-[0_0_20px_rgba(217,249,157,0.3)] transition-all hover:scale-105"
                            onClick={() => window.open("#tym", "_self")}
                        >
                            Náš Tým
                        </Button>
                        {/* SECONDARY BUTTON REMOVED HERE */}
                    </div>
                </motion.div>

                {/* Visual / Empty Space column - keeps focus on text but allows background to show */}
                <div className="hidden lg:block h-full min-h-[500px]" />
            </div>
        </section>
    );
}
