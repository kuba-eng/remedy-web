"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "O nás", href: "/#o-nas" },
        { name: "Naše služby", href: "/#sluzby" },
        { name: "Ceník", href: "/cenik" },
        { name: "REMEDY team", href: "/#tym" },
        { name: "Naši klienti", href: "/#klienti" },
        { name: "Kontakt", href: "/#kontakt" },
    ];

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b border-transparent",
                isScrolled ? "bg-neutral-950/80 backdrop-blur-md py-4 border-white/5" : "bg-transparent py-6"
            )}
        >
            <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
                {/* LOGO */}
                <Link href="/" className="relative h-8 w-32 md:h-10 md:w-40 transition-opacity hover:opacity-90">
                    {/* Using CSS filter to make the lime logo white: brightness(0) makes it black, invert(1) makes it white */}
                    <img
                        src="/images/logo.png"
                        alt="REMEDY"
                        className="object-contain w-full h-full filter brightness-0 invert"
                    />
                </Link>

                {/* DESKTOP NAV & CTA */}
                <div className="hidden md:flex items-center gap-8 ml-auto">
                    <nav className="flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-white/70 hover:text-white transition-colors tracking-widest uppercase font-sans text-xs"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    <Button
                        variant="primary"
                        size="sm"
                        className="bg-white text-black hover:bg-neutral-200 rounded-none font-semibold px-6 border-none"
                        onClick={() => window.open("https://rezervace.remedy.cz/", "_blank")}
                    >
                        Rezervace
                    </Button>
                </div>

                {/* MOBILE TOGGLE (kept separate for mobile view logic) */}
                <div className="flex md:hidden items-center gap-4">
                    <button
                        className="p-2 text-white"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* MOBILE MENU */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-neutral-900 border-b border-white/10 shadow-2xl p-6 flex flex-col gap-6 animate-in slide-in-from-top-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-2xl font-light py-2 text-white/90 font-display hover:text-accent transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Button
                        variant="primary"
                        fullWidth
                        size="lg"
                        className="bg-accent text-black rounded-none mt-4"
                        onClick={() => window.open("https://rezervace.remedy.cz/", "_blank")}
                    >
                        Rezervace Online
                    </Button>
                </div>
            )}
        </header>
    );
}
