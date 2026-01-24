"use client";

import { Section } from "@/components/ui/Section";
import { Quote } from "lucide-react";
import { CLIENTS_DATA } from "@/data/clients";
import { motion } from "framer-motion";

export function Clients() {
    return (
        <Section
            id="klienti"
            className="relative min-h-[80vh] flex flex-col justify-center bg-cover bg-center bg-fixed text-white py-24 overflow-hidden"
            style={{ backgroundImage: "url('/images/clients-bg.jpg')" }}
        >
            {/* Dark Overlay for Readability */}
            <div className="absolute inset-0 bg-black/70 z-0 pointer-events-none" />

            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-[#D9F99D]/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] left-[-10%] w-[30%] h-[30%] bg-[#D9F99D]/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-black mb-6 uppercase tracking-tight">
                        Naši <span className="text-[#D9F99D]">SPOKOJENÍ</span> klienti
                    </h2>
                    <p className="text-neutral-400 max-w-2xl mx-auto font-light text-lg">
                        Příběhy těch, kteří se rozhodli investovat do svého zdraví a pohybu.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                    {CLIENTS_DATA.map((item, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            key={index}
                            className="group relative bg-[#1a1a1a]/60 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-white/5 hover:border-[#D9F99D]/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex flex-col"
                        >
                            {/* Decorative Quote Mark */}
                            <div className="absolute top-6 right-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                                <Quote className="w-24 h-24 text-[#D9F99D] rotate-180" />
                            </div>

                            <Quote className="w-10 h-10 text-[#D9F99D] mb-8 relative z-10" />

                            <p className="text-lg md:text-xl text-neutral-200 mb-8 leading-relaxed font-light relative z-10 flex-grow italic">
                                &quot;{item.text}&quot;
                            </p>

                            <div className="relative z-10 flex flex-col border-t border-white/10 pt-6 group-hover:border-[#D9F99D]/30 transition-colors duration-500">
                                <span className="font-bold text-white text-lg tracking-wide uppercase">{item.author}</span>
                                <span className="text-sm text-[#D9F99D] font-medium tracking-widest uppercase opacity-80">{item.role}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Section>
    );
}
