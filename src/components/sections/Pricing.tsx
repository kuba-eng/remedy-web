"use client";

import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/utils";
import { Bone, Hand, Bandage, Activity, Users, Brain, Scale, Sparkles, LucideIcon, PersonStanding, User, Waves } from "lucide-react";
import { PRICING_DATA, PricingItem, IconName } from "@/data/pricing";

const ICON_MAP: Record<IconName, LucideIcon> = {
    Hand: Hand,
    Bone: Bone,
    PersonStanding: PersonStanding,
    Waves: Waves,
    Bandage: Bandage,
    Activity: Activity,
    User: User,
    Users: Users,
    Brain: Brain,
    Scale: Scale,
    Sparkles: Sparkles,
};

export function Pricing() {
    return (
        <section className="min-h-screen relative overflow-hidden bg-neutral-950 text-white font-sans pt-32 pb-20">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#D9F99D]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#D9F99D]/5 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                {/* Hero Header */}
                <div className="text-center mb-20">
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight uppercase">
                        Ceník <span className="text-[#D9F99D]">Služeb</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-neutral-400 font-light max-w-2xl mx-auto">
                        Investice do vašeho <span className="text-white font-medium">zdraví</span> a <span className="text-white font-medium">těla</span>.
                    </p>
                </div>

                {/* Grid Container - 4 cols on XL for 8 items */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {PRICING_DATA.map((item) => {
                        const IconComponent = ICON_MAP[item.iconName];
                        return (
                            <PricingCard
                                key={item.id}
                                icon={<IconComponent className={cn("w-8 h-8", item.highlight ? "text-[#D9F99D]" : "text-[#D9F99D]")} />}
                                title={item.title}
                                subtitle={item.subtitle}
                                timeRange={item.timeRange}
                                highlight={item.highlight}
                            >
                                {item.prices.map((price, idx) => (
                                    <PriceRow key={idx} time={price.label} price={price.price} />
                                ))}
                                {item.note && (
                                    <div className="mt-6 pt-4 border-t border-white/10 text-xs text-neutral-400 italic text-center">
                                        {item.note}
                                    </div>
                                )}
                            </PricingCard>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function PricingCard({
    children,
    title,
    subtitle,
    timeRange,
    highlight = false,
    icon
}: {
    children: React.ReactNode;
    title: React.ReactNode;
    subtitle: string;
    timeRange: string;
    highlight?: boolean;
    icon: React.ReactNode;
}) {
    return (
        <div className={cn(
            "relative group overflow-hidden rounded-3xl font-sans transition-all duration-300 hover:-translate-y-2",
            highlight
                ? "bg-[#D9F99D] text-[#1a1a1a]"
                : "bg-neutral-900/60 backdrop-blur-md border border-white/10 text-white hover:border-[#D9F99D]/50 hover:shadow-[0_0_30px_rgba(217,249,157,0.1)]"
        )}>
            {/* Hlo/Glow Effect for Dark Cards */}
            {!highlight && (
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#D9F99D]/10 rounded-full blur-3xl group-hover:bg-[#D9F99D]/20 transition-all" />
            )}

            <div className="p-8 h-full flex flex-col relative z-10">
                {/* Header */}
                <div className="flex flex-col items-center text-center mb-8">
                    <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg",
                        highlight ? "bg-[#1a1a1a]" : "bg-[#1a1a1a] border border-white/10"
                    )}>
                        {icon}
                    </div>

                    <h3 className="text-2xl font-bold uppercase mb-1 leading-none">{title}</h3>
                    <div className={cn("text-sm font-medium", highlight ? "text-neutral-800" : "text-neutral-400")}>
                        {subtitle}
                    </div>

                    <div className={cn(
                        "mt-4 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider",
                        highlight ? "bg-[#1a1a1a] text-[#D9F99D]" : "bg-[#D9F99D]/10 text-[#D9F99D]"
                    )}>
                        {timeRange}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-grow space-y-1 mb-8">
                    {children}
                </div>

                {/* Button */}
                <a
                    href="https://rezervace.remedy.cz/"
                    target="_blank"
                    className={cn(
                        "block w-full py-4 rounded-xl text-center font-bold uppercase tracking-widest text-sm transition-all relative overflow-hidden",
                        highlight
                            ? "bg-[#1a1a1a] text-white hover:bg-black"
                            : "bg-white/5 text-[#D9F99D] hover:bg-[#D9F99D] hover:text-[#1a1a1a]"
                    )}
                >
                    Rezervovat
                </a>
            </div>
        </div>
    );
}

function PriceRow({ time, price }: { time: string; price: string }) {
    return (
        <div className="flex justify-between items-center py-2.5 border-b border-current border-opacity-10 last:border-0">
            <span className="opacity-80 text-sm">{time}</span>
            <span className="font-bold">{price}</span>
        </div>
    );
}
