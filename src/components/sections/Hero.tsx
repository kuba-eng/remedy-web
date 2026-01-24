"use client";

import { ParallaxSection } from "@/components/ui/ParallaxSection";

export function Hero() {
    return (
        <ParallaxSection
            id="hero"
            bgImage="/images/bg-hero-custom.jpg"
            title={
                <>
                    Život je <span className="text-[#D9F99D]">pohyb</span>.
                </>
            }
            description={
                <span className="text-xl md:text-3xl lg:text-4xl font-bold block leading-tight mt-2 opacity-90">
                    Změň svůj pohyb, <br className="hidden md:inline" />změníš svůj život.
                </span>
            }
            ctaText="Rezervovat termín"
            ctaLink="https://rezervace.remedy.cz/"
            secondaryCtaText="Naše služby"
            secondaryCtaLink="#sluzby"
            className="from-black/50 to-black/80"
            align="left"
            titleClassName="text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[1.1] max-w-4xl normal-case"
        />
    );
}
