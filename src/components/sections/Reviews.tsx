"use client";

import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const REVIEWS = [
    {
        id: 1,
        author: "Petr Novák",
        rating: 5,
        text: "Naprosto profesionální přístup. Kuba mi pomohl s bolavými zády, se kterými jsem se trápil roky. Doporučuji všema deseti!",
        date: "před měsícem"
    },
    {
        id: 2,
        author: "Jana Dvořáková",
        rating: 5,
        text: "Skvělé prostředí a úžasná atmosféra. Chodím sem na cvičení pravidelně a cítím se lépe než kdy dřív. Díky kluci!",
        date: "před 2 měsíci"
    },
    {
        id: 3,
        author: "Martin Svoboda",
        rating: 5,
        text: "Radim má zlaté ruce. Po zranění ramene jsem se rychle vrátil zpět do formy. Líbí se mi propojení terapie a cvičení.",
        date: "před 3 týdny"
    },
    {
        id: 4,
        author: "Veronika K.",
        rating: 5,
        text: "Nejlepší fyzio ve Žďáře. Individuální přístup, žádné 'běžte tamhle na stroj', ale opravdový zájem o problém.",
        date: "před 4 měsíci"
    }
];

export function Reviews() {
    return (
        <section
            id="klienti"
            className="py-32 relative overflow-hidden bg-center bg-cover bg-fixed scroll-mt-20"
            style={{ backgroundImage: "url('/reviews_bg.jpg')" }}
        >
            {/* Dark Overlay Gradient for Readability */}
            <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-[2px]" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-white/10 backdrop-blur-md">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-5 h-5" />
                        <span className="text-white font-medium text-sm tracking-wide">Hodnocení 5.0/5</span>
                        <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Star key={i} className="w-3 h-3 text-[#F4B400] fill-[#F4B400]" />
                            ))}
                        </div>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight">
                        Co o nás <span className="text-[#D9F99D]">Říkají</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {REVIEWS.map((review, index) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-neutral-900/40 border border-white/5 p-8 rounded-3xl relative group hover:bg-neutral-900/60 hover:border-[#D9F99D]/20 transition-all duration-300"
                        >
                            <Quote className="absolute top-6 right-6 w-8 h-8 text-white/5 group-hover:text-[#D9F99D]/20 transition-colors" />

                            <div className="flex gap-1 mb-4">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-[#F4B400] fill-[#F4B400]" />
                                ))}
                            </div>

                            <p className="text-neutral-300 font-light leading-relaxed mb-6 min-h-[80px]">
                                "{review.text}"
                            </p>

                            <div className="flex items-center gap-3 mt-auto border-t border-white/5 pt-4">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D9F99D] to-[#a3d65c] flex items-center justify-center text-black font-bold text-xs uppercase">
                                    {review.author[0]}
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-white text-sm font-bold">{review.author}</span>
                                    <span className="text-neutral-500 text-xs">{review.date}</span>
                                </div>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-4 h-4 ml-auto opacity-50 grayscale group-hover:grayscale-0 transition-all" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <a
                        href="https://www.google.com/search?q=remedy+zdar+nad+sazavou+recenze"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-[#D9F99D] hover:text-white transition-colors font-medium text-sm tracking-widest uppercase border-b border-[#D9F99D] hover:border-white pb-1"
                    >
                        Přečíst všechny recenze na Google
                    </a>
                </div>
            </div>
        </section>
    );
}
