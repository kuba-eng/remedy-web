"use strict";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Pricing } from "@/components/sections/Pricing";

export default function PricingPage() {
    return (
        <main className="min-h-screen bg-neutral-950">
            <Navbar />
            <Pricing />
            <Footer />
        </main>
    );
}
