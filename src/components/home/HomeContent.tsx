"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Team } from "@/components/sections/Team";
import { Reviews } from "@/components/sections/Reviews";
import { Contact } from "@/components/sections/Contact";
import { RemedySnack } from "@/components/ui/RemedySnack";

interface HomeContentProps {
    initialTipId?: string;
}

export function HomeContent({ initialTipId }: HomeContentProps) {
    return (
        <main className="min-h-screen bg-neutral-950">
            <Navbar />
            <Hero />
            <About />
            <Services />
            <Team />
            <Reviews />
            <Contact />
            <Footer />
            {/* We pass the ID to Snack to open it immediately */}
            <RemedySnack initialTipId={initialTipId} />
        </main>
    );
}
