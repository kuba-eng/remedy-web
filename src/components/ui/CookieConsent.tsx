"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem("cookie-consent");
        if (!consent) {
            // Delay showing the banner slightly for better UX
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookie-consent", "accepted");
        setIsVisible(false);
        // Here we would trigger analytics initialization in a real app
    };

    const handleDecline = () => {
        localStorage.setItem("cookie-consent", "necessary-only");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-5 md:p-6 bg-neutral-950/95 backdrop-blur-xl border-t border-white/5 text-neutral-300 shadow-2xl">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                <div className="text-sm md:text-base leading-relaxed text-center md:text-left">
                    <p className="font-light">
                        <strong className="font-bold text-white uppercase tracking-wider text-xs mr-2">Cookies 🍪</strong> 
                        Naše tělo potřebuje pohyb, náš web zase cookies. Pomáhají nám udržet stránky ve formě a zjistit, jestli to tu vůbec někdo čte. Klikněte na „Přijmout vše“ a slibujeme, že už vás s touhle lištou nebudeme otravovat.
                    </p>
                    <p className="mt-2 text-[11px] text-neutral-500 uppercase tracking-wider">
                        Více nudného čtení v <Link href="/ochrana-udaju" className="underline hover:text-[#D9F99D] transition-colors">Zásadách ochrany osobních údajů</Link>.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDecline}
                        className="bg-transparent border-white/10 hover:bg-white/5 text-neutral-400 w-full sm:w-auto uppercase tracking-widest text-[10px] font-bold rounded-xl"
                    >
                        Jen to nutné
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handleAccept}
                        className="bg-[#D9F99D] text-black hover:bg-white w-full sm:w-auto uppercase tracking-widest text-[10px] font-bold rounded-xl"
                    >
                        Přijmout vše
                    </Button>
                </div>
            </div>
        </div>
    );
}
