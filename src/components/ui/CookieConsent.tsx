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
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 bg-stone-900/95 backdrop-blur-md border-t border-stone-800 text-stone-200">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
                <div className="text-sm md:text-base leading-relaxed text-center md:text-left">
                    <p>
                        <strong>Používáme cookies 🍪</strong> – aby web fungoval správně a abychom věděli, co se vám líbí.
                        Kliknutím na "Přijmout vše" nám dáte souhlas se všemi soubory cookies.
                    </p>
                    <p className="mt-1 text-xs text-stone-400">
                        Více informací najdete v našich <Link href="/ochrana-udaju" className="underline hover:text-white transition-colors">Zásadách ochrany osobních údajů</Link>.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDecline}
                        className="bg-transparent border-stone-700 hover:bg-stone-800 text-stone-300 w-full sm:w-auto"
                    >
                        Jen nezbytné
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handleAccept}
                        className="w-full sm:w-auto"
                    >
                        Přijmout vše
                    </Button>
                </div>
            </div>
        </div>
    );
}
