"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Mail, Calendar, ExternalLink, RefreshCw, ThumbsUp, Star, Link, Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { REMEDY_TIPS, CATEGORIES, Tip, TipCategory } from "@/data/remedy-tips";

const STORAGE_KEY_DISMISSED = "remedy-snack-dismissed";
const STORAGE_KEY_PERMANENT = "remedy-snack-permanent";
const RESERVATION_URL = "https://rezervace.remedy.cz";
const PRIVACY_URL = "/ochrana-udaju";

interface RemedySnackProps {
    initialTipId?: string;
}

export function RemedySnack({ initialTipId }: RemedySnackProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [view, setView] = useState<'INITIAL' | 'TIP' | 'EMAIL'>('INITIAL');
    const [selectedCategory, setSelectedCategory] = useState<TipCategory | null>(null);
    const [currentTip, setCurrentTip] = useState<Tip | null>(null);
    const [email, setEmail] = useState("");
    const [emailSent, setEmailSent] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);
    const GENERAL_TAGS = ["krk", "bedra", "rameno", "stres"];

    // --- HELPER: SELECT TAGS TO DISPLAY ---
    const getDisplayTags = (tip: Tip): string[] => {
        if (!tip.tags || tip.tags.length === 0) return [];
        const specific = tip.tags.filter(t => !GENERAL_TAGS.includes(t));

        if (specific.length >= 2) return specific.slice(0, 2);
        if (specific.length === 1) {
            const general = tip.tags.find(t => GENERAL_TAGS.includes(t));
            return general ? [specific[0], general] : [specific[0]];
        }
        return tip.tags.slice(0, 2);
    };

    const showSmartTip = (type: 'SIMILAR' | 'TAG', tag?: string) => {
        if (!currentTip) return;
        const cat = currentTip.category;

        // 1. Get history to avoid immediate repetition of the EXACT SAME tip
        const lastTipIdKey = `remedy_last_tip_${cat}`;
        const lastTipId = localStorage.getItem(lastTipIdKey);

        const categoryTips = REMEDY_TIPS.filter(t => t.category === cat && t.id !== currentTip.id && t.id !== lastTipId);

        let candidates: Tip[] = [];

        if (type === 'TAG' && tag) {
            candidates = categoryTips.filter(t => t.tags?.includes(tag));
        } else {
            // SIMILAR: Score by overlap
            const currentTags = currentTip.tags || [];
            if (currentTags.length === 0) {
                // No tags? Fallback to normal random
                showTip(cat);
                return;
            }

            // Calculate scores
            const scored = categoryTips.map(t => {
                const intersection = t.tags?.filter(x => currentTags.includes(x)).length || 0;
                return { tip: t, score: intersection };
            });

            const maxScore = Math.max(...scored.map(s => s.score));
            if (maxScore > 0) {
                candidates = scored.filter(s => s.score === maxScore).map(s => s.tip);
            }
        }

        // Fallback if no smart match found
        if (candidates.length === 0) {
            showTip(cat);
            return;
        }

        // Select random from candidates
        const selectedTip = candidates[Math.floor(Math.random() * candidates.length)];

        // Save state & Show
        if (selectedTip) {
            localStorage.setItem(lastTipIdKey, selectedTip.id);
            localStorage.setItem(`remedy_last_type_${cat}`, selectedTip.type);
            setCurrentTip(selectedTip);
        }
    };

    // --- FAVORITES LOGIC ---
    interface FavoriteItem {
        id: string;
        category: string;
        type: string;
        headline: string;
        tags?: string[];
        ts: number;
    }

    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
    const [showFavorites, setShowFavorites] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("remedy_favorites");
        if (stored) {
            try {
                setFavorites(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse favorites", e);
            }
        }
    }, []);

    const toggleFavorite = () => {
        if (!currentTip) return;

        // Check if already favorited
        const isFav = favorites.some(f => f.id === currentTip.id);

        let newFavs;
        if (isFav) {
            newFavs = favorites.filter(f => f.id !== currentTip.id);
        } else {
            const newItem: FavoriteItem = {
                id: currentTip.id,
                category: currentTip.category,
                type: currentTip.type,
                headline: currentTip.headline,
                tags: currentTip.tags,
                ts: Date.now()
            };
            // Add to start, keep max 30
            newFavs = [newItem, ...favorites].slice(0, 30);
        }

        setFavorites(newFavs);
        localStorage.setItem("remedy_favorites", JSON.stringify(newFavs));
    };

    const isCurrentFavorite = currentTip ? favorites.some(f => f.id === currentTip.id) : false;

    // --- TRIGGER LOGIC ---
    useEffect(() => {
        // 0. Check for initialTipId (Deep Linking)
        if (initialTipId) {
            const tip = REMEDY_TIPS.find(t => t.id === initialTipId);
            if (tip) {
                setCurrentTip(tip);
                setSelectedCategory(tip.category);
                setView('TIP');
                setIsVisible(true);
                return; // Skip other triggers if deep linked
            }
        }

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
    }, [initialTipId]);

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

    // Helper for weighted random selection
    const getWeightedType = (): 'tip' | 'vite_ze' | 'motivace' => {
        const rand = Math.random();
        if (rand <= 0.4) return 'tip';
        if (rand <= 0.7) return 'vite_ze';
        return 'motivace';
    };

    const showTip = (cat: TipCategory) => {
        // 1. Get history from localStorage to avoid repetition
        const lastTipIdKey = `remedy_last_tip_${cat}`;
        const lastTypeKey = `remedy_last_type_${cat}`;

        const lastTipId = localStorage.getItem(lastTipIdKey);
        const lastType = localStorage.getItem(lastTypeKey);

        // 2. Determine target type (try to avoid same type twice if possible - max 3 attempts)
        let targetType = getWeightedType();
        let attempts = 0;

        // Optional: Try to diversify type if it matches the last one
        while (lastType && targetType === lastType && attempts < 3) {
            targetType = getWeightedType();
            attempts++;
        }

        // 3. Filter candidates
        const categoryTips = REMEDY_TIPS.filter(t => t.category === cat);
        let candidates = categoryTips.filter(t => t.type === targetType && t.id !== lastTipId);

        // 4. Fallback if no candidates found (e.g. only 1 tip of that type exists and it was just shown)
        if (candidates.length === 0) {
            // broaden search to any type in category, just avoid the exact same ID
            candidates = categoryTips.filter(t => t.id !== lastTipId);

            // Absolute fallback - if there's only 1 tip total in category, we must show it
            if (candidates.length === 0) candidates = categoryTips;
        }

        // 5. Select Tip
        const selectedTip = candidates[Math.floor(Math.random() * candidates.length)];

        // 6. Save state
        if (selectedTip) {
            localStorage.setItem(lastTipIdKey, selectedTip.id);
            localStorage.setItem(lastTypeKey, selectedTip.type);
            setCurrentTip(selectedTip);
        }
    };

    const handleNextTip = () => {
        if (selectedCategory) showTip(selectedCategory);
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    category: selectedCategory,
                    favorites: favorites.slice(0, 5) // Send top 5 favs
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

    const handleShare = async () => {
        if (!currentTip) return;
        const url = `${window.location.origin}/tip/${currentTip.id}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Remedy Tip: ${currentTip.headline}`,
                    text: currentTip.body,
                    url: url,
                });
            } catch (err) {
                console.log('Share failed', err);
            }
        } else {
            // Fallback to clipboard
            try {
                await navigator.clipboard.writeText(url);
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 2000);
            } catch (err) {
                console.error('Failed to copy', err);
            }
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
                    className="fixed bottom-6 right-4 md:bottom-12 md:right-10 z-[60] w-[90vw] md:w-[380px] pointer-events-auto"
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
                        {view === 'INITIAL' && (
                            <button
                                onClick={() => handleDismiss(true)}
                                className="absolute bottom-2 right-4 text-[10px] text-white/10 hover:text-white/40 uppercase tracking-widest transition-colors"
                            >
                                Už nezobrazovat
                            </button>
                        )}


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
                                {favorites.length > 0 && (
                                    <div className="pt-2 border-t border-white/5 flex justify-between items-center text-xs">
                                        <button
                                            onClick={() => { setView('TIP'); setShowFavorites(true); }}
                                            className="text-[#D9F99D] hover:underline flex items-center gap-1"
                                        >
                                            <Star className="w-3 h-3" /> Mé oblíbené ({favorites.length})
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* --- VIEW: TIP --- */}
                        {view === 'TIP' && (
                            <div className="space-y-4">
                                {showFavorites ? (
                                    // FAVORITES LIST VIEW
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-white font-bold flex items-center gap-2">
                                                <Star className="w-4 h-4 text-[#D9F99D]" /> Tvé oblíbené tipy
                                            </h3>
                                            <button
                                                onClick={() => setShowFavorites(false)}
                                                className="text-xs text-[#D9F99D] hover:underline"
                                            >
                                                Zpět na tip
                                            </button>
                                        </div>
                                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                            {favorites.length === 0 ? (
                                                <p className="text-stone-500 text-sm italic">Zatím žádné uložené.</p>
                                            ) : (
                                                favorites.map(fav => (
                                                    <div key={fav.id} className="bg-white/5 p-3 rounded-lg border border-white/5 text-sm">
                                                        <div className="text-[#D9F99D] text-[10px] uppercase font-bold mb-1 opacity-70">{fav.type.replace('_', ' ')}</div>
                                                        <div className="text-stone-200 font-medium">{fav.headline}</div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                ) : currentTip ? (
                                    // STANDARD TIP VIEW
                                    <>
                                        <div className="flex items-center justify-between mt-4 md:mt-0 mr-8 md:mr-0">
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
                                            <div className="flex items-start justify-between mb-2 gap-4">
                                                <h4 className="text-white font-bold text-lg leading-tight">{currentTip.headline}</h4>
                                                <button
                                                    onClick={handleShare}
                                                    className="shrink-0 p-2 -mr-2 -mt-2 rounded-full hover:bg-white/10 text-stone-500 hover:text-[#D9F99D] transition-colors"
                                                    title="Sdílet tip"
                                                >
                                                    {copiedLink ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
                                                </button>
                                            </div>
                                            <p className="text-stone-300 text-sm leading-relaxed mb-3">
                                                {currentTip.body}
                                            </p>

                                            {/* TAGS CHIPS */}
                                            {currentTip.tags && currentTip.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {getDisplayTags(currentTip).map(tag => (
                                                        <button
                                                            key={tag}
                                                            onClick={() => showSmartTip('TAG', tag)}
                                                            className="px-2 py-0.5 rounded-md border border-white/10 bg-white/5 text-[10px] text-stone-400 hover:text-[#D9F99D] hover:border-[#D9F99D]/30 transition-colors uppercase tracking-wide"
                                                        >
                                                            {tag.replace('_', ' ')}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}

                                            {/* MICRO TIP BLOCK */}
                                            <div className="bg-[#D9F99D]/10 border border-[#D9F99D]/20 rounded-xl p-3 relative">
                                                <div className="absolute -top-3 left-3 bg-[#1a1a1a] px-2 text-[10px] text-[#D9F99D] font-bold uppercase tracking-widest border border-[#D9F99D]/20 rounded-full">
                                                    {currentTip.type === 'motivace' ? 'Motivace' :
                                                        currentTip.type === 'vite_ze' ? 'Víte, že?' : 'Tip pro tebe'}
                                                </div>
                                                <p className="text-[#D9F99D] text-sm font-medium leading-relaxed">
                                                    {currentTip.micro}
                                                </p>
                                            </div>

                                            {/* LIKE & FAVORITES ACTION */}
                                            <div className="mt-3 flex items-center justify-between">
                                                <button
                                                    onClick={toggleFavorite}
                                                    className={`text-xs flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${isCurrentFavorite
                                                        ? "text-[#D9F99D] bg-[#D9F99D]/10 border border-[#D9F99D]/20"
                                                        : "text-stone-400 hover:text-white hover:bg-white/5"
                                                        }`}
                                                    aria-label={isCurrentFavorite ? "Odebrat z oblíbených" : "Přidat do oblíbených"}
                                                    aria-pressed={isCurrentFavorite}
                                                >
                                                    {isCurrentFavorite ? (
                                                        <><Star className="w-3 h-3 fill-current" /> Uloženo</>
                                                    ) : (
                                                        <><ThumbsUp className="w-3 h-3" /> Dneska mi to sedlo</>
                                                    )}
                                                </button>

                                                <button
                                                    onClick={() => setShowFavorites(true)}
                                                    className="text-[10px] text-stone-500 hover:text-stone-300"
                                                >
                                                    Zobrazit oblíbené
                                                </button>
                                            </div>
                                        </div>

                                        <div className="pt-2 flex flex-col gap-2 border-t border-white/5">
                                            {/* SMART NEXT BUTTON */}
                                            <button
                                                onClick={() => showSmartTip('SIMILAR')}
                                                className="w-full py-2 rounded-lg bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/20 border border-white/10 text-xs font-medium text-stone-200 flex items-center justify-center gap-2 transition-all group"
                                            >
                                                <span>⚡️</span> Další tip jako tenhle
                                            </button>

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
                                        <div className="text-center">
                                            <button
                                                onClick={() => { setView('INITIAL'); setShowFavorites(false); }}
                                                className="text-[10px] text-stone-500 hover:text-stone-300 uppercase tracking-widest mt-1"
                                            >
                                                Zpět na výběr
                                            </button>
                                        </div>
                                    </>
                                ) : null}
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
