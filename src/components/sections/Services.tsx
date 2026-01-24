"use client";

import { useState, useEffect } from "react";
import { PersonStanding, Hand, Activity, TrendingUp, Bandage, Scale, Brain, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const services = [
    {
        name: "FYZIOTERAPIE",
        icon: PersonStanding,
        desc: "Komplexní diagnostika a léčba bolesti pohybového aparátu."
    },
    {
        name: "MASÁŽE A MANUÁLNÍ TERAPIE",
        icon: Hand,
        desc: "Uvolnění napětí a regenerace svalů pomocí manuálních technik."
    },
    {
        name: "ZDRAVOTNÍ CVIČENÍ",
        icon: Activity,
        desc: "Individuální lekce zaměřené na správné držení těla."
    },
    {
        name: "KONDIČNÍ TRÉNINK",
        icon: TrendingUp,
        desc: "Zlepšení fyzické kondice a návrat do formy po zranění."
    },
    {
        name: "KINESIOTAPING",
        icon: Bandage,
        desc: "Podpora svalové funkce a redukce bolesti pomocí tejpů."
    },
    {
        name: "DIAGNOSTIKA INBODY",
        icon: Scale,
        desc: "Přesná analýza složení těla pro efektivní nastavení plánu."
    },
    {
        name: "KRANIOSAKRÁLNÍ TERAPIE",
        icon: Brain,
        desc: "Jemná metoda pro harmonizaci nervového systému."
    },
];

export function Services() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    // Auto-scroll logic
    useEffect(() => {
        // Initial intro animation delay
        const timer = setTimeout(() => setIsLoaded(true), 100);

        // Auto-play interval
        const autoPlayDelay = 1200;
        const intervalDuration = 2500; // Slower interval for better readability and smoothness

        let interval: NodeJS.Timeout;

        const startAutoPlay = setTimeout(() => {
            interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % services.length);
            }, intervalDuration);
        }, autoPlayDelay);

        return () => {
            clearTimeout(timer);
            clearTimeout(startAutoPlay);
            clearInterval(interval);
        };
    }, []);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + services.length) % services.length);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % services.length);
    };

    // Calculate indices for circular render
    const getCircularItem = (offset: number) => {
        const index = (currentIndex + offset + services.length) % services.length;
        return { item: services[index], index };
    };

    return (
        <section
            id="sluzby"
            className="relative w-full min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] overflow-hidden py-24 text-white bg-cover bg-center bg-fixed"
            style={{ backgroundImage: `url('/images/bg-services-custom.jpg')` }}
        >
            {/* Film Grain Overlay */}
            <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none mix-blend-overlay"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            {/* Dark Gradient Overlay for better readability over image */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-0 pointer-events-none" />

            <div className={cn(
                "relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col items-center gap-20 transition-all duration-1000 ease-out fill-mode-forwards",
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}>

                {/* Heading */}
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 uppercase tracking-wide">
                    Naše služby
                </h2>

                {/* Carousel */}
                <div className="relative w-full max-w-6xl h-[450px] flex items-center justify-center">

                    {/* Items */}
                    <div className="relative w-full h-full flex items-center justify-center">
                        {[-2, -1, 0, 1, 2].map((offset) => {
                            const { item, index } = getCircularItem(offset);
                            const isActive = offset === 0;
                            const isNear = Math.abs(offset) === 1; // Left or Right

                            // Stagger animation for initial load
                            const staggerDelay = `${600 + (Math.abs(offset) * 120)}ms`;

                            return (
                                <div
                                    key={`${index}-${offset}`} // Unique key for transition
                                    className={cn(
                                        "absolute transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col items-center justify-center p-0",
                                        isActive ? "z-20 w-[300px] md:w-[340px] scale-110 opacity-100" :
                                            isNear ? "z-10 w-[260px] opacity-40 blur-[1px] scale-90" :
                                                "z-0 w-[200px] opacity-0 scale-75 blur-[2px]", // Far items hidden/faded
                                        offset === -1 ? "-translate-x-[200px] md:-translate-x-[320px]" : "",
                                        offset === 1 ? "translate-x-[200px] md:translate-x-[320px]" : "",
                                        Math.abs(offset) >= 2 ? "opacity-0 pointer-events-none" : ""
                                    )}
                                    style={{
                                        // Intro animation styles
                                        animation: isLoaded ? `fadeIn 1s ease-out ${staggerDelay} forwards` : 'none',
                                    }}
                                >
                                    <item.icon
                                        className={cn(
                                            "mb-6 transition-all duration-500",
                                            isActive ? "w-20 h-20 stroke-1 text-[#D9F99D] drop-shadow-[0_0_15px_rgba(217,249,157,0.3)]" : "w-12 h-12 stroke-[0.5] text-white/30"
                                        )}
                                    />
                                    <h3 className={cn(
                                        "font-sans tracking-[0.2em] text-center mb-4 transition-all duration-500 uppercase",
                                        isActive ? "text-2xl font-bold text-[#D9F99D]" : "text-sm font-light text-white/50"
                                    )}>
                                        {item.name}
                                    </h3>
                                    <p className={cn(
                                        "text-center font-light leading-relaxed transition-all duration-500 px-4 max-w-[280px]",
                                        isActive ? "opacity-90 text-sm text-neutral-300" : "opacity-0 h-0 overflow-hidden"
                                    )}>
                                        {item.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Controls */}
                    <button onClick={handlePrev} className="absolute left-4 md:left-0 z-30 p-2 text-white/30 hover:text-white transition-colors">
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button onClick={handleNext} className="absolute right-4 md:right-0 z-30 p-2 text-white/30 hover:text-white transition-colors">
                        <ChevronRight className="w-8 h-8" />
                    </button>

                </div>
            </div>
        </section >
    );
}
