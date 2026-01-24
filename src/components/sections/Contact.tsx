"use client";

import { CustomMap } from "@/components/ui/Map";


export function Contact() {
    return (
        <section id="kontakt" className="bg-neutral-950 text-white py-24 relative overflow-hidden flex flex-col gap-16">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-[#D9F99D]/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] left-[-10%] w-[30%] h-[30%] bg-[#D9F99D]/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
                {/* Heading */}
                <div className="flex flex-col items-center text-center">
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
                        Kontaktujte <span className="text-[#D9F99D]">Nás</span>
                    </h2>
                </div>
            </div>

            {/* Full Width Map Strip */}
            <div className="w-full h-[350px] lg:h-[450px] relative shadow-2xl border-y border-white/5 grayscale-[20%] hover:grayscale-0 transition-all duration-700 z-10">
                <CustomMap />
            </div>

            {/* Reservation Button - Below Map */}
            <div className="flex justify-center relative z-10">
                <a
                    href="https://rezervace.remedy.cz/"
                    target="_blank"
                    className="inline-flex items-center justify-center bg-[#D9F99D] text-[#1a1a1a] px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 transform hover:-translate-y-1 shadow-[0_0_20px_rgba(217,249,157,0.3)] min-w-[200px]"
                >
                    Online Rezervace
                </a>
            </div>

        </section>
    );
}
