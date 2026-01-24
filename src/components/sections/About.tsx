"use client";

import { ParallaxSection } from "@/components/ui/ParallaxSection";

export function About() {
    return (
        <ParallaxSection
            id="o-nas"
            bgImage="/about_background_1769192109659.png"
            title="Pohyb je základem zdraví"
            description="Naším cílem není jen odstranit bolest, ale najít její příčinu. Spojujeme tradiční fyzioterapii s moderní vědou v prostředí, kde se budete cítit dobře."
            ctaText="Více o týmu"
            ctaLink="#tym"
            align="left"
        />
    );
}
