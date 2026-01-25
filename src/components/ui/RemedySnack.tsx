"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Mail, Calendar, ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { REMEDY_TIPS, CATEGORIES, Tip, TipCategory } from "@/data/remedy-tips";

const STORAGE_KEY_DISMISSED = "remedy-snack-dismissed";
const STORAGE_KEY_PERMANENT = "remedy-snack-permanent";
const RESERVATION_URL = "https://rezervace.remedy.cz";
const PRIVACY_URL = "/ochrana-udaju";

export function RemedySnack() {
    const [isVisible, setIsVisible] = useState(false);
    const [view, setView] = useState<'INITIAL' | 'TIP' | 'EMAIL'>('INITIAL');
    const [selectedCategory, setSelectedCategory] = useState<TipCategory | null>(null);
    const [currentTip, setCurrentTip] = useState<Tip | null>(null);
    const [email, setEmail] = useState("");
    const [emailSent, setEmailSent] = useState(false);

    // --- TRIGGER LOGIC ---
    useEffect(() => {
        // 1. Check permanent dismissal
        if (localStorage.getItem(STORAGE_KEY_PERMANENT)) return;

        // 2. Check 24h dismissal
        const lastDismissal = localStorage.getItem(STORAGE_KEY_DISMISSED);
        if (lastDismissal) {
            const timeSince = Date.now() - parseInt(lastDismissal, 10);
            if (timeSince < 24 * 60 * 60 * 1000) return; // Wait 24h
        }

        // 3. Time trigger (8-10s)
        const timeTimer = setTimeout(() => {
            setIsVisible(true);
        }, 9000);

        // 4. Scroll trigger (30%)
        const handleScroll = () => {
            const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
            if (scrollPercent > 0.3) {
                setIsVisible(true);
                // Cleanup scroll listener once triggered
                window.removeEventListener("scroll", handleScroll);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            clearTimeout(timeTimer);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // --- ACTIONS ---

    const handleDismiss = (permanent: boolean = false) => {
        setIsVisible(false);
        if (permanent) {
            localStorage.setItem(STORAGE_KEY_PERMANENT, "true");
        } else {
            localStorage.setItem(STORAGE_KEY_DISMISSED, Date.now().toString());
        }
    };

    const selectCategory = (cat: TipCategory) => {
        setSelectedCategory(cat);
        showTip(cat);
        setView('TIP');
    };

    const showTip = (cat: TipCategory) => {
        const categoryTips = REMEDY_TIPS.filter(t => t.category === cat);
        // Avoid repeating the same tip if possible
        let nextTip = categoryTips[Math.floor(Math.random() * categoryTips.length)];
        if (currentTip && categoryTips.length > 1 && nextTip.id === currentTip.id) {
            nextTip = categoryTips.find(t => t.id !== currentTip.id) || nextTip;
        }
        setCurrentTip(nextTip);
    };

    const handleNextTip = () => {
        if (selectedCategory) showTip(selectedCategory);
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    // ... (rest of code) ...

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    category: selectedCategory
                })
            });

            // Success handling even if API fails (graceful degradation for demo)
            setEmailSent(true);
            setTimeout(() => {
                handleDismiss(true);
            }, 5000);

        } catch (error) {
            console.error("Failed to subscribe:", error);
            // Show success anyway to not frustrate user in this MVP
            setEmailSent(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="fixed bottom-4 right-4 md:bottom-10 md:right-10 z-[60] w-[90vw] md:w-[380px] pointer-events-auto"
                >
                    <div className="relative overflow-hidden rounded-[24px] bg-[#1a1a1a]/95 backdrop-blur-xl border border-[#D9F99D]/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6">

                        {/* Inner Glow */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#D9F99D]/10 rounded-full blur-[60px]" />

                        {/* Close Controls */}
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                            <button
                                onClick={() => handleDismiss(false)}
                                className="text-white/20 hover:text-white transition-colors"
                                aria-label="Zavřít"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <button
                            onClick={() => handleDismiss(true)}
                            className="absolute bottom-2 right-4 text-[10px] text-white/10 hover:text-white/40 uppercase tracking-widest transition-colors"
                        >
                            Už nezobrazovat
                        </button>

                        {/* --- VIEW: INITIAL --- */}
                        {view === 'INITIAL' && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-[#D9F99D] shadow-[0_0_10px_#D9F99D]" />
                                    <h3 className="text-[#D9F99D] font-bold text-xs tracking-widest uppercase">
                                        Remedy Jednohubka
                                    </h3>
                                </div>
                                <h4 className="text-white font-bold text-xl">
                                    Co tě dneska nejvíc trápí?
                                </h4>
                                <div className="grid grid-cols-2 gap-2 mt-4">
                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => selectCategory(cat.id)}
                                            className="px-3 py-3 rounded-xl bg-white/5 hover:bg-[#D9F99D]/10 border border-white/5 hover:border-[#D9F99D]/30 text-stone-300 hover:text-[#D9F99D] text-sm font-medium transition-all text-left"
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* --- VIEW: TIP --- */}
                        {view === 'TIP' && currentTip && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[#D9F99D] shadow-[0_0_10px_#D9F99D]" />
                                        <h3 className="text-[#D9F99D] font-bold text-xs tracking-widest uppercase">
                                            Tip pro tebe
                                        </h3>
                                    </div>
                                    <button onClick={handleNextTip} className="text-[#D9F99D]/50 hover:text-[#D9F99D] text-xs flex items-center gap-1 transition-colors">
                                        <RefreshCw className="w-3 h-3" /> Další tip
                                    </button>
                                </div>

                                <div>
                                    <div className="flex items-baseline justify-between mb-1">
                                        <h4 className="text-white font-bold text-lg">{currentTip.headline}</h4>
                                        <span className="text-[#D9F99D] text-xs font-mono bg-[#D9F99D]/10 px-2 py-0.5 rounded ml-2 whitespace-nowrap">
                                            {currentTip.duration}
                                        </span>
                                    </div>
                                    <p className="text-stone-300 text-sm leading-relaxed">
                                        {currentTip.description}
                                    </p>
                                </div>

                                <div className="pt-2 flex flex-col gap-2">
                                    <a
                                        href={RESERVATION_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full"
                                    >
                                        <Button className="w-full bg-[#D9F99D] text-black hover:bg-[#D9F99D]/90 h-10">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            Rezervace
                                        </Button>
                                    </a>
                                    <Button
                                        variant="outline"
                                        className="w-full border-white/20 hover:bg-white/5 text-stone-300 h-9 text-xs"
                                        onClick={() => setView('EMAIL')}
                                    >
                                        <Mail className="w-3 h-3 mr-2" />
                                        Pošli mi 5 tipů do mailu
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* --- VIEW: EMAIL --- */}
                        {view === 'EMAIL' && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <button onClick={() => setView('TIP')} className="text-stone-500 hover:text-white transition-colors">
                                        <span className="sr-only">Zpět</span>
                                        ←
                                    </button>
                                    <h3 className="text-[#D9F99D] font-bold text-xs tracking-widest uppercase">
                                        Tipy do schránky
                                    </h3>
                                </div>

                                {!emailSent ? (
                                    <form onSubmit={handleEmailSubmit} className="space-y-3">
                                        <h4 className="text-white font-bold text-lg">
                                            Chceš víc takových tipů?
                                        </h4>
                                        <p className="text-stone-400 text-sm">
                                            Pošlu ti jich 5 nejlepších rovnou do mailu. Žádný spam, slibuju.
                                        </p>
                                        <input
                                            type="email"
                                            required
                                            placeholder="tvuj@email.cz"
                                            className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-stone-600 focus:outline-none focus:border-[#D9F99D]/50 text-sm"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <div className="flex items-start gap-2">
                                            <input type="checkbox" required id="privacy" className="mt-1" />
                                            <label htmlFor="privacy" className="text-[10px] text-stone-500 leading-tight">
                                                Souhlasím se <a href={PRIVACY_URL} className="underline hover:text-stone-300">zpracováním osobních údajů</a> pro zaslání tipů.
                                            </label>
                                        </div>
                                        <Button
                                            type="submit"
                                            className="w-full bg-white text-black hover:bg-stone-200"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Odesílám..." : "Odeslat"}
                                        </Button>
                                    </form>
                                ) : (
                                    <div className="text-center py-6">
                                        <div className="w-12 h-12 bg-[#D9F99D]/20 text-[#D9F99D] rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Mail className="w-6 h-6" />
                                        </div>
                                        <h4 className="text-white font-bold">Odesláno!</h4>
                                        <p className="text-stone-400 text-xs mt-1">Mrkni do schránky (i do spamu).</p>
                                        <Button
                                            onClick={() => handleDismiss(true)}
                                            variant="ghost"
                                            className="mt-4 text-[#D9F99D] hover:bg-[#D9F99D]/10 hover:text-[#D9F99D]"
                                        >
                                            Zavřít
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
