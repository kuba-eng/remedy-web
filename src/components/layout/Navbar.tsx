"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

import { checkSession } from "@/actions/auth";


export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        checkSession().then(isAuth => {
            console.log("Navbar checkSession result:", isAuth);
            setIsLoggedIn(isAuth);
        });
    }, [pathname]);

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
                <div className="hidden md:flex items-center gap-6 ml-auto">
                    <nav className="flex items-center gap-6">
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

                    <Link href={isLoggedIn ? "/profil" : "/login"} className="text-white/70 hover:text-[#D9F99D] transition-colors p-2" title={isLoggedIn ? "Můj Profil" : "Přihlášení"}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    </Link>

                    <Link href="/rezervace">
                        <Button
                            variant="primary"
                            size="sm"
                            className="bg-white text-black hover:bg-neutral-200 rounded-none font-semibold px-6 border-none"
                        >
                            Rezervace
                        </Button>
                    </Link>
                </div>

                {/* MOBILE TOGGLE (kept separate for mobile view logic) */}
                <div className="flex md:hidden items-center gap-4">
                    <Link href={isLoggedIn ? "/profil" : "/login"} className="text-white/70 hover:text-[#D9F99D] transition-colors p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    </Link>
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
                <div className="md:hidden absolute top-full left-0 right-0 bg-neutral-950 border-b border-white/10 shadow-2xl p-6 flex flex-col gap-6 animate-in slide-in-from-top-2 h-[calc(100vh-80px)] overflow-y-auto">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-2xl font-light py-2 text-white/90 font-display hover:text-[#D9F99D] transition-colors border-b border-white/5"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}

                    <Link
                        href={isLoggedIn ? "/profil" : "/login"}
                        className="text-lg font-medium py-2 text-white/70 hover:text-[#D9F99D] flex items-center gap-3"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                        {isLoggedIn ? "Můj Profil" : "Přihlášení / Registrace"}
                    </Link>

                    <Link href="/rezervace" onClick={() => setMobileMenuOpen(false)}>
                        <Button
                            variant="primary"
                            fullWidth
                            size="lg"
                            className="bg-[#D9F99D] text-black rounded-none mt-4 font-bold"
                        >
                            Rezervace Online
                        </Button>
                    </Link>
                </div>
            )}
        </header>
    );
}
